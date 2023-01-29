import { ExtendedWebSocket, WebSocketCodes, WebSocketMessage } from "./helpers/ExtendedWebSocket";
import { EventEmitter } from "eventemitter3";
import { User } from "./User";
import { ClientUser } from "./ClientUser";
import { Channel, ChatChannel } from "./Channel";
import { LRU } from "./helpers/LRU";
import Message, { MessageData } from "./Message";
import Space, { SpaceData } from "./Space";
import { ObservableMap } from "../state";

export interface ClientEvents {
    ready: [];
    messageCreate: [Message];
}

class Client extends EventEmitter<ClientEvents> {
    socket: ExtendedWebSocket;
    token?: string;
    channels: ObservableMap<string, Channel>;
    user?: ClientUser;
    users: LRU<User>;
    spaces: ObservableMap<string, Space>;
    ready: boolean = false;

    constructor(server: string) {
        super();
        this.socket = new ExtendedWebSocket(server, { reconnect: true });
        this.socket.on("message", async (message: WebSocketMessage) => {
            if (message.type === WebSocketCodes.NEW_CHANNEL_MESSAGE) {
                const data = message.data as { message: MessageData; channelId: string; };
                if (!this.users.has(data.message.authorId))
                    await this.fetchUser(data.message.authorId);
                const user = this.users.get(data.message.authorId);
                if (!user) throw new Error("User expected");
                const channel = this.channels.get(data.channelId);
                const m = new Message(this, user, data.message);
                if (channel && channel.isChatChannel()) {
                    channel.messages.cache.set(data.message.id, m);
                }
                this.emit("messageCreate", m);
            }
        });

        this.channels = new ObservableMap();
        this.users = new LRU(500);
        this.spaces = new ObservableMap();
    }

    async fetchUser(id?: string) {
        if (id) {
            if (this.users.has(id)) return this.users.get(id);
            const request = await fetch(`https://sso.nextflow.cloud/api/user/${id ?? ""}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            if (request.ok) {
                const response = await request.json();
                const user = new User(response);
                this.users.set(user.id, user);
                return user;
            }
        } else {
            if (this.user) return this.user;
            const request = await fetch(`https://sso.nextflow.cloud/api/user/`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            if (request.ok) {
                const response = await request.json();
                const user = new ClientUser(response);
                this.users.set(user.id, user);
                return user;
            }
        }
    }

    async fetchChannels() {
        throw new Error("Not implemented");
    }

    async fetchSpaces() {
        const spaceData = (await this.socket.request({ type: WebSocketCodes.GET_SPACES })).data as { spaces: SpaceData[] };
        for (const s of spaceData.spaces) {
            this.spaces.set(s.id, new Space(this, s));
        }
        return this.spaces;
    }

    async connect(token?: string) {
        this.token = token;
        await this.socket.connect(token);
        await this.fetchUser();
        this.emit("ready");
        this.ready = true;
        
        // FIXME: Remove this
        this.channels.set("1", new ChatChannel(this, {
            id: "1",
            type: "CHAT_CHANNEL"
        }));
    }

    destroy() {
        this.ready = false;
        this.socket.destroy();
        this.channels = new ObservableMap();
        this.users = new LRU(500);
        this.user = undefined;
        this.token = undefined;
    }
}

export { Client };
