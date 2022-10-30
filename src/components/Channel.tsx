import { Channel28Regular, Call28Filled, MoreVertical28Filled, Send28Regular } from "@fluentui/react-icons";
import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import CallConnector from "./CallConnector";
import ExtendedWebSocket, { WebSocketCodes, WebSocketMessage } from "../utilities/ExtendedWebSocket";
import { User } from "../utilities/redux/users";
import { store, useAppSelector } from "../utilities/redux/redux";
import Message from "./Message";
import { shallowEqual } from "react-redux";
// import expandingTextArea from "../utilities/expandingTextArea";
// import { Virtuoso } from "react-virtuoso";
// import LRU from "../utilities/LRU";
// import Scroller from "./Scroller";

interface Props {
    profile?: User;
    token: string;
    openContextMenu: () => void;
    closeContextMenu: () => void;
    // eslint-disable-next-line no-unused-vars
    showModalDialog: (title: string, message: string, buttons: { text: string; id: string; primary?: boolean }[], callback: (button: string) => void) => void;
    hideModalDialog: () => void;
}

interface ChannelMessage {
    content: string,
    createdAt: number,
    authorId: string,
    edited: boolean,
    editedAt?: number,
    id: string,
    channelId: string
}

const Channel = ({ profile, token, openContextMenu, closeContextMenu, showModalDialog, hideModalDialog }: Props) => {
    const [currentUser, setCurrentUser] = useState<User>({ id: "1", username: "John Doe", avatar: "https://avatars0.githubusercontent.com/u/17098281?s=460&u=e8d9c9f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8&v=4" });
    const messagesElement = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    // const [isOpen, setIsOpen] = useState(false);
    // const [isTyping, setIsTyping] = useState(false);
    const [call, setCall] = useState(false);
    const [loadedMessages, setLoadedMessages] = useState<ChannelMessage[]>([]);
    
    const darkTheme = useAppSelector(state => state.preferences.theme === "dark", shallowEqual);

    useEffect(() => {
        const observer = new MutationObserver(events => {
            const target = events[0].target as HTMLDivElement;
            target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        });
        if (messagesElement.current) {
            observer.observe(messagesElement.current, { childList: true });
            (messagesElement.current as HTMLDivElement).scroll({ top: (messagesElement.current as HTMLDivElement).scrollHeight, behavior: "smooth" });
        }
        const textarea = document.getElementById("message-input") as HTMLElement;
        const heightLimit = 200;
        textarea.onchange = () => {
            textarea.style.height = "";
            textarea.style.height = `${Math.min(textarea.scrollHeight, heightLimit)}px`;
        };
        fetchUser();
        establishConnection();
        return () => {
            observer.disconnect();
        };
    }, []);
    
    const fetchUser = async (id?: string) => {
        if (id && store.getState().users[id]) return;
        const request = await fetch(`https://sso.nextflow.cloud/api/user/${id ?? ""}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (request.ok) {
            const response = await request.json();
                store.dispatch({
                    type: "LOAD_USER", 
                    user: {
                        id: response.id,
                        username: response.username,
                        avatar: response.avatar
                    }
                });
            if (!id) {
                setCurrentUser({
                    id: response.id,
                    username: response.username,
                    avatar: response.avatar
                });
            }
        }
    };
    const establishConnection = async () => {
        let socket = store.getState().socket.socket;
        if (!socket) {
            socket = new ExtendedWebSocket("wss://link1.nextflow.cloud/api/rpc", token, { reconnect: true });
            socket.on("message", async (message: WebSocketMessage) => {
                if (message.type === WebSocketCodes.NEW_CHANNEL_MESSAGE) {
                    const data = message.data as { message: Record<string, unknown>; channel_id: string; };
                const m: ChannelMessage = {
                        content: data.message.content as string,
                        createdAt: data.message.created_at as number,
                        authorId: data.message.author_id as string,
                        edited: data.message.edited as boolean,
                        editedAt: data.message.edited_at as number | undefined,
                        id: data.message.id as string,
                        channelId: data.channel_id as string
                };
                    if (!store.getState().users[m.authorId])
                        await fetchUser(m.authorId);
                setLoadedMessages(l => [...l, m]);
            }
        });
            try {
        Object.defineProperty(window, "socket", {
            value: socket,
            writable: false,
            configurable: false
        });
            } catch {}
        await socket.connect();
            store.dispatch({
                type: "SET_SOCKET", 
                socket
            });
        }
        const channelId = "1";
        const { data } = await socket.request({ type: WebSocketCodes.GET_CHANNEL_MESSAGES, data: { channel_id: channelId } });
        const msgs = data!.messages as {
            id: string;
            content: string;
            author_id: string;
            created_at: number;
            edited: boolean;
            edited_at: number | null;
        }[];
        for (const msg of msgs) {
            // TODO: Fetch user correctly and fix SSO bug
            if (!store.getState().users[msg.author_id])
                await fetchUser(msg.author_id);
        }
        setLoadedMessages(msgs.map(m => ({ 
            id: m.id, 
            authorId: m.author_id, 
            channelId, 
            content: m.content, 
            createdAt: m.created_at, 
            edited: m.edited, 
            editedAt: m.edited_at ?? undefined
        })).reverse());
        };

    const joinCall = () => {
        // showModalDialog(
        //     "Information", 
        //     "Calls not supported yet. We're working on it :)", 
        //     [{ text: "OK", id: "ok", primary: true }], 
        //     () => hideModalDialog()
        // );
        setCall(true);
    };
    const send = async () => {
        if (message.trim().length > 0) {
            if (message.length > 4096) {
                showModalDialog(
                    "Error", // Whoa there, chill out.
                    "Message is too long. Please keep it under 4096 characters.", // Your message is too long. Please shorten your message to 4096 characters or less.
                    [{ text: "OK", id: "ok", primary: true }],
                    () => hideModalDialog()
                );
                return;
            }
            console.log(`Message: ${message}`);
            const data = await store.getState().socket.socket?.request({ type: WebSocketCodes.SEND_CHANNEL_MESSAGE, data: { content: message.trim(), channel_id: "1" } });
            if (data) {
                setMessage("");
            }
        }
    };
    const handleContextMenu = () => {};
    const handleClick = () => {};
    const handleKeypress = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };
    return (
        <div className="conversation flex flex-col self-stretch w-full h-full min-h-0 overflow-hidden">
            <div className={`description flex justify-start px-5 py-4 border-b w-full items-center ${darkTheme ? "bg-opacity-20 bg-gray-700 backdrop-blur-lg text-gray-300" : ""}`}>
                <Channel28Regular className="w-5 h-5 mr-2" />
                <div className="space-x-3 w-full">
                    <b>hello</b>
                    <span className={`text-sm  ${darkTheme ? "text-gray-400" : "text-gray-600"}`}>A testing channel.</span>
                </div>
                <div className="justify-self-end flex flex-row">
                    {call ? <></> : <Call28Filled className="w-5 h-5 hover:text-green-400 mx-2" onClick={joinCall} />}
                    <MoreVertical28Filled className="w-5 h-5 hover:text-green-400 mx-2" /> {/* TODO: onClick and openContextMenu */}
                </div>
            </div>
            
            {call ? <CallConnector token={token} socket={store.getState().socket.socket!} /> : <></>}
            {/* <Scroller loadingComponent={
                <div>Loading...</div>
            } nextDataFn={() => {
                "t";
            }} nextEnd={true} nextLoading={true} previousDataFn={() => {"t";}} previousEnd={false} previousLoading={false} >
                e
            </Scroller> */}
            {/* <Virtuoso>

            </Virtuoso> */}
            <div ref={messagesElement} className={`messages flex flex-col h-full justify-start overflow-y-scroll ${darkTheme ? "bg-opacity-20 bg-gray-500 backdrop-blur-lg" : ""}`} onContextMenu={handleContextMenu} onClick={handleClick}>
                {loadedMessages.map(message => (
                    <Message message={message} showModalDialog={showModalDialog} hideModalDialog={hideModalDialog} />
                ))}
                
            </div>
            <div className={`input flex self-stretch justify-self-end px-5 py-4 w-full ${darkTheme ? "bg-opacity-20 bg-gray-500 backdrop-blur-lg" : ""}`}>
                <textarea onChange={v => {
                    setMessage((v.target as HTMLTextAreaElement).value);
                    // expandingTextArea(v.target as HTMLTextAreaElement, { maxLines: 10 });
                }} onKeyPress={handleKeypress} value={message} type="text" placeholder="Type a message..." className={`${darkTheme ? "backdrop-blur-sm bg-gray-300 bg-opacity-20 border-slate-200 border-opacity-40 text-gray-300" : "border-slate-200"} w-full h-12 px-4 py-2 border-2 rounded-md focus:outline-none`} id="message-input"
                style={{
                    minHeight: "calc(16px + 2rem)",
                    maxHeight: "calc((16px*10) + 2rem)"
                }} />
                <div className={`self-center mx-5 px-5 py-3 rounded-md hover:opacity-80 hover:bg-slate-200 hover:text-green-400 border-2 h-12 flex justify-center items-center ${darkTheme ? "text-gray-300 border-slate-200 border-opacity-40" : "border-slate-200"}`} onClick={send}> 
                    <Send28Regular className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default Channel;
