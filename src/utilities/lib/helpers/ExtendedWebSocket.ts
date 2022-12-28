/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
interface WebSocketEvents {
    open: []
    close: [code: number, reason: string];
    error: [error: Error];
    message: [message: WebSocketMessage];
}

interface WebSocketMessage {
    type: WebSocketCodes;
    data?: Record<string, unknown>;
    error?: number;
    id?: string;
}

export const enum WebSocketCodes {
    HELLO = "HELLO",
    IDENTIFY = "IDENTIFY",
    HEARTBEAT = "HEARTBEAT",
    HEARTBEAT_ACK = "HEARTBEAT_ACK",
    ERROR = "ERROR",
    GET_ID = "GET_ID",

    GET_CHANNELS = "GET_CHANNELS",
    GET_SPACES = "GET_SPACES",

    GET_CHANNEL_MESSAGES = "GET_MESSAGES",
    NEW_CHANNEL_MESSAGE = "NEW_MESSAGE",
    SEND_CHANNEL_MESSAGE = "SEND_MESSAGE",

    CONNECT_SDP = "CONNECT_SDP",
    CONNECT_ICE = "CONNECT_ICE",

    CAPABILITIES = "CAPABILITIES",
    TRANSPORT = "TRANSPORT",
    DTLS = "DTLS",
    PRODUCE = "PRODUCE",
    CONSUME = "CONSUME",
    RESUME = "RESUME",
    NEW_PRODUCER = "NEW_PRODUCER",

    LEAVE_CALL = "LEAVE_CALL",

    CALL_MEMBER_JOINED = "CALL_MEMBER_JOINED",
    CALL_MEMBER_LEFT = "CALL_MEMBER_LEFT",
}

export type { WebSocketEvents, WebSocketMessage };

import { encode, decode } from "@msgpack/msgpack";
import { EventEmitter } from "eventemitter3";

class ExtendedWebSocket extends EventEmitter<WebSocketEvents> {
    socket?: WebSocket;
    idStore: string[] = [];
    queue: WebSocketMessage[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openPromise?: [(value: void | PromiseLike<void>) => void, (reason: any) => void];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    waitingPromises: Record<string, [(value: WebSocketMessage | PromiseLike<WebSocketMessage>) => void, (reason: any) => void]> = {};
    closed = false;
    interval?: number;
    reconnect: boolean;
    manuallyClosed = false;
    token?: string;
    constructor(public url: string | URL, options?: { reconnect?: boolean }) {
        super();
        this.reconnect = options?.reconnect ?? false;
    }
    protected onOpen(event: Event) {
        this.interval = setInterval(() => {
            this.socket?.send(encode({ type: WebSocketCodes.HEARTBEAT }));
        }, 10000);
    }
    protected onMessage(event: MessageEvent) {
        const message = decode(event.data as ArrayBuffer) as WebSocketMessage;
        console.debug(message);
        if (message.type === WebSocketCodes.HEARTBEAT_ACK) return;
        if (message.type === WebSocketCodes.HELLO) {
            if (message.data?.requestIds && message.data.requestIds instanceof Array) 
                for (const x of message.data.requestIds) 
                    this.idStore.push(x);
            const id = this.idStore.length && this.idStore.shift();
            if (id) {
                this.request({ id, type: WebSocketCodes.IDENTIFY, data: { publicKey: [], token: this.token } })
                    .then(() => this.openPromise?.[0]())
                    .catch(e => this.openPromise?.[1](e));
            }
            else this.openPromise?.[1](new Error("Unexpected error: No id available"));
            return;
        }
        if (message.id) {
            const promise = this.waitingPromises[message.id];
            if (promise) {
                if (message.type === WebSocketCodes.ERROR) 
                    promise[1](new Error(`Error ${message.error}: ${message.data?.message}`));
                else
                    promise[0](message);
                delete this.waitingPromises[message.id];
            }
        } else {
            this.emit("message", message);
        }
    }
    protected onError(event: Event) {
        this.emit("error", new Error(event.toString()));
    }
    protected onClose(event: CloseEvent) {
        clearInterval(this.interval);
        this.queue = [];
        this.socket = undefined;
        this.waitingPromises = {};
        this.idStore = [];
        this.closed = true;
        this.emit("close", event.code, event.reason);

        if (this.reconnect && !this.manuallyClosed) {
            setTimeout(() => {
                this.connect();
            }, 5000);
        }
    }
    
    send(data: WebSocketMessage) {
        this.queue.push(data);
    }
    async request(data: WebSocketMessage) {
        console.log(data);
        return await new Promise<WebSocketMessage>(async (resolve, reject) => {
            if (this.idStore.length && this.idStore.length < 3) {
                const d = await new Promise((s, e) => {
                    const id = this.idStore.shift() as string;
                    this.waitingPromises[id] = [s, e];
                    this.socket?.send(encode({ type: WebSocketCodes.GET_ID, id, data: {} }));
                }).catch(reject);
                const { requestIds } = (d as { data: { requestIds: string[] } }).data;
                for (const id of requestIds) this.idStore.push(id);
            }
            const id = this.idStore.length && this.idStore.shift();
            if (id) { 
                data.id = id;
                this.waitingPromises[data.id] = [resolve, reject];
                this.socket?.send(encode(data));
            } else {
                reject(new Error("Unexpected error: No id available"));
            }
        });
    }
    async connect(token?: string, timeout = 5000) {
        this.token = token;
        const settings = new URLSearchParams();
        settings.set("v", "1");
        settings.set("compress", "zlib-stream");
        this.socket = new WebSocket(`${this.url}/api/rpc?${settings}`);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        return await new Promise<void>((resolve, reject) => {
            this.openPromise = [resolve, reject];
        }).then(() => this.emit("open"));
    }
    destroy() {
        this.manuallyClosed = true;
        this.socket?.close();
    }
}

export { ExtendedWebSocket };
