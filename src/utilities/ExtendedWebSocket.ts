/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
interface WebSocketEvents {
    open: []
    close: [code: number, reason: string];
    error: [error: Error];
    // message: [message: string | ArrayBuffer];
    message: [message: WebSocketMessage];
}

interface WebSocketMessage {
    type: WebSocketCodes;
    data?: Record<string, unknown>;
    error?: number;
    id?: string;
}

export const enum WebSocketCodes {
    HELLO = 0,
    IDENTIFY = 1,
    HEARTBEAT = 2,
    HEARTBEAT_ACK = 3,
    ERROR = 4,
    GET_ID = 5,

    GET_CHANNEL_MESSAGES = 10,
    CHANNEL_MESSAGE = 11,
    SEND_CHANNEL_MESSAGE = 12,

    CAPABILITIES = 20,
    TRANSPORT = 21,
    DTLS = 22,
    PRODUCE = 23,
    CONSUME = 24,
    RESUME = 25,
    NEW_PRODUCER = 26,

    LEAVE_CALL = 27,

    CALL_MEMBER_JOINED = 28,
    CALL_MEMBER_LEFT = 29,
}

export type { WebSocketEvents, WebSocketMessage };

import { encode, decode } from "@msgpack/msgpack";

class ExtendedWebSocket {
    socket?: WebSocket;
    listeners: Record<keyof WebSocketEvents, ((...data: WebSocketEvents[keyof WebSocketEvents]) => void)[]> = {
        open: [],
        close: [],
        error: [],
        message: []
    };
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
    constructor(public url: string | URL, private token: string, options?: { reconnect?: boolean }) {
        this.reconnect = options?.reconnect ?? false;
    }
    protected onOpen(event: Event) {
        this.interval = setInterval(() => {
            // this.send({ type: WebSocketCodes.HEARTBEAT });
            this.socket?.send(encode({ type: WebSocketCodes.HEARTBEAT }));
        }, 10000);
    }
    protected onMessage(event: MessageEvent) {
        // const message = JSON.parse(event.data as string) as WebSocketMessage;
        const message = decode(event.data as ArrayBuffer) as WebSocketMessage;
        console.debug(message);
        if (message.type === WebSocketCodes.HEARTBEAT_ACK) return;
        if (message.type === WebSocketCodes.HELLO) {
            if (message.data?.ids && message.data.ids instanceof Array) 
                for (const x of message.data.ids) 
                    this.idStore.push(x);
            const id = this.idStore.length && this.idStore.shift();
            if (id) {
                this.request({ id, type: WebSocketCodes.IDENTIFY, data: { token: this.token } })
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
    protected deserialise(data: unknown[]) {
        const id = data[0];
        const error = data[1];
        const type = data[2];
        const content = data[3];
        return { id, error, type, data: (content as unknown[])[1] } as WebSocketMessage;
    }
    emit<E extends keyof WebSocketEvents>(event: E, ...data: WebSocketEvents[E]) {
        this.listeners[event].forEach(listener => listener(...data));
    }
    on<E extends keyof WebSocketEvents>(event: E, listener: (...data: WebSocketEvents[E]) => void) {
        this.listeners[event].push(listener as (...data: WebSocketEvents[keyof WebSocketEvents]) => void);
    }
    send(data: WebSocketMessage) {
        this.queue.push(data);
    }
    async request(data: WebSocketMessage) {
        return await new Promise<WebSocketMessage>(async (resolve, reject) => {
            if (this.idStore.length && this.idStore.length < 3) {
                // this.request({ type: WebSocketCodes.GET_ID });
                const d = await new Promise((s, e) => {
                    this.waitingPromises[this.idStore.shift() as string] = [s, e];
                    this.socket?.send(encode({ type: WebSocketCodes.GET_ID }));
                }).catch(reject);
                const { ids } = (d as { data: { ids: string[] } }).data;
                for (const id of ids) this.idStore.push(id);
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
    async connect(timeout = 5000) {
        const settings = new URLSearchParams();
        settings.set("v", "1");
        settings.set("encoding", "json");
        settings.set("compress", "zlib-stream");
        this.socket = new WebSocket(`${this.url}/api/v1/socket?${settings}`);
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

export default ExtendedWebSocket;
