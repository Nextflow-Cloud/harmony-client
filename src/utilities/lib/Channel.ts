import { Client } from "./Client";
import { WebSocketCodes } from "./helpers/ExtendedWebSocket";
import MessageManager from "./MessageManager";

export interface ChannelData {
    id: string;
    type: ChannelType;
}

type ChannelType =
    | "PRIVATE_CHANNEL"
    | "GROUP_CHANNEL"
    | "ANNOUNCEMENT_CHANNEL"
    | "INFORMATION_CHANNEL"
    | "CHAT_CHANNEL";

class Channel {
    id: string;
    type: ChannelType;
    constructor(public client: Client, options: ChannelData) {
        this.id = options.id;
        this.type = options.type;
    }

    isChatChannel(): this is ChatChannel {
        return this instanceof ChatChannel;
    }
}

class ChatChannel extends Channel {
    messages: MessageManager;
    type: ChannelType = "CHAT_CHANNEL";

    constructor(client: Client, options: ChannelData) {
        super(client, options);

        this.messages = new MessageManager(this);
        // this.call = new VoiceManager(this);
    }

    public async send(message: string) {
        const response = await this.client.socket?.request({
            type: WebSocketCodes.SEND_CHANNEL_MESSAGE,
            data: { channelId: this.id, content: message },
        });
        if (!response) throw new Error("Socket is not connected");
        if (response.error) throw new Error(response.error as string);
        return response.data as { id: string };
    }
}

export { Channel, ChatChannel };
