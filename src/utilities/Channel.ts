import Client from "./Client";
import { WebSocketCodes } from "./ExtendedWebSocket";

class Channel {
    id: string;
    constructor(public client: Client, channel: string | Channel) {
        this.id = typeof channel === "string" ? channel : channel.id;
    }

    public async send(message: string) {
        const response = await this.client.socket?.request({ type: WebSocketCodes.CHANNEL_MESSAGE, data: { channel: this.id, message } });
        if (!response) throw new Error("Socket is not connected");
        if (response.type === WebSocketCodes.ERROR) throw new Error(response.data?.message as string);
        return response.data as { id: string; };
    }
    
}

export default Channel;
