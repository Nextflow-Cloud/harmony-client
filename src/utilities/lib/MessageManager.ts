import { Channel } from "./Channel";
import { WebSocketCodes } from "./helpers/ExtendedWebSocket";
import LRU from "./helpers/LRU";
import Message, { MessageContent, MessageData } from "./Message";

interface MessageFetchOptions {
    before?: string;
    after?: string;
    limit?: number;
    latest?: boolean;
}

class MessageManager {
    cache: LRU<Message>;
    constructor(public channel: Channel) {
        this.cache = new LRU(100);
    }

    async delete(id: string) {
        throw new Error("Not implemented");
    }

    async edit(id: string, content: MessageContent) {
        throw new Error("Not implemented");
    }

    async fetch(id: string): Promise<Message>;
    async fetch(options: MessageFetchOptions): Promise<Map<string, Message>>;

    async fetch(options: string | MessageFetchOptions): Promise<Message | Map<string, Message>> {
        if (typeof options === "string") {
            throw new Error("Not implemented");
        } else {
            const response = (await this.channel.client.socket.request({ type: WebSocketCodes.GET_CHANNEL_MESSAGES, data: {
                channelId: this.channel.id,
                before: options.before,
                after: options.after,
                limit: options.limit,
                latest: options.latest
            } })).data as { messages: MessageData[] };
            const map = new Map();
            for (const x of response.messages) {
                const user = await this.channel.client.fetchUser(x.authorId);
                if (!user) throw new Error("User expected");
                const message = new Message(this.channel.client, user, x);
                map.set(message.id, message);
            }
            return map;
        }
    }
}

export default MessageManager;
