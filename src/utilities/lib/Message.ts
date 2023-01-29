import { Client } from "./Client";
import { User } from "./User";

export interface MessageData {
    content: string;
    createdAt: number;
    authorId: string;
    edited: boolean;
    editedAt?: number;
    id: string;
}

export type MessageContent = string;

class Message {
    content: string;
    createdAt: Date;
    edited: boolean;
    editedAt?: Date;
    id: string;

    constructor(public client: Client, public author: User, data: MessageData) {
        this.content = data.content;
        this.createdAt = new Date(data.createdAt);
        this.edited = data.edited;
        this.editedAt = data.editedAt ? new Date(data.editedAt) : undefined;
        this.id = data.id;
    }

    async delete() {
        throw new Error("Not implemented");
    }

    async edit(content: MessageContent) {
        throw new Error("Not implemented");
    }

    async reply(content: MessageContent) {
        throw new Error("Not implemented");
    }
}

export default Message;
