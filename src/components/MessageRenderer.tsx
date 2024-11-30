import { createMemo } from "solid-js";
import MessageGroup from "./MessageGroup";

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Message {
    id: string;
    content: string;
    timestamp: number;
    author: User;
}

const MessageRenderer = ({ messages }: { messages: Message[] }) => {
    const value = createMemo(() => {
        let msgGroups: Message[][] = [];
        let currentGroup: Message[] = [];
        let lastAuthor: string | null = null;
        for (const message of messages) {
            if (lastAuthor !== message.author.id) {
                if (currentGroup.length > 0) {
                    msgGroups.push(currentGroup);
                    currentGroup = [];
                }
            }
            currentGroup.push(message);
            lastAuthor = message.author.id;
        }
        if (currentGroup.length > 0) {
            msgGroups.push(currentGroup);
        }
        return msgGroups;
    });

    return (
        <>
            {value().map((group) => (
                <MessageGroup messages={group} />
            ))}
        </>
    )
};

export default MessageRenderer;
