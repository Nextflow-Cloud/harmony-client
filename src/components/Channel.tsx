import { Channel28Regular, Call28Filled, MoreVertical28Filled, Send28Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "preact/hooks";
import ExtendedWebSocket, { WebSocketCodes, WebSocketMessage } from "../utilities/ExtendedWebSocket";
// import LRU from "../utilities/LRU";
import StyleParser from "./StyleParser";
import expandingTextArea from "../utilities/expandingTextArea";
import CallConnector from "../routes/CallConnector";
import Scroller from "./Scroller";
import { Virtuoso } from "react-virtuoso";

interface User {
    id: string;
    username: string;
    avatar: string;
}

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
    // id: string;
    // message: string;
    // user: User;
    // time: string;
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
    // const [cachedUsers, setCachedUsers] = useState<LRU<User>>(new LRU(50));
    const [socket, setSocket] = useState<ExtendedWebSocket>();
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
    // useEffect(() => {
    //     console.log(cachedUsers);
    // }, [cachedUsers]);
    const fetchUser = async (id?: string) => {
        if (id && window.internals.userStore.get(id)) return;
        const request = await fetch(`https://sso.nextflow.cloud/api/user/${id ?? ""}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (request.ok) {
            const response = await request.json();
            if (id) {
                // setCachedUsers({
                //     ...cachedUsers, 
                //     [id]: {
                //         id: response.id,
                //         username: response.username,
                //         avatar: response.avatar
                //     }
                // });
                window.internals.userStore.set(id, {
                    id: response.id,
                    username: response.username,
                    avatar: response.avatar
                });
            } else {
                setCurrentUser({
                    id: response.id,
                    username: response.username,
                    avatar: response.avatar
                });
            }
        }
    };
    const establishConnection = async () => {
        const socket = new ExtendedWebSocket("wss://link1.nextflow.cloud/api/rpc", token);
        socket.on("message", (message: WebSocketMessage) => {
            if (message.type === WebSocketCodes.CHANNEL_MESSAGE) {
                const data = message.data as Record<string, unknown>;
                const m: ChannelMessage = {
                    content: data.content as string,
                    createdAt: data.createdAt as number,
                    authorId: data.authorId as string,
                    edited: data.edited as boolean,
                    editedAt: data.editedAt as number | undefined,
                    id: data.id as string,
                    channelId: data.channelId as string
                };
                setLoadedMessages(l => [...l, m]);
            }
        });
        Object.defineProperty(window, "socket", {
            value: socket,
            writable: false,
            configurable: false
        });
        await socket.connect();
        const { data } = await socket.request({ type: WebSocketCodes.GET_CHANNEL_MESSAGES, data: { channelId: "1" } });
        const msgs = data!.messages as ChannelMessage[];
        for (const msg of msgs) {
            // if (!cachedUsers[msg.authorId])
            if (!window.internals.userStore.get(msg.authorId))
                await fetchUser(msg.authorId);
        }
        setLoadedMessages(msgs);
        setSocket(socket);
    };
    const formatTime = (time: Date) => {
        const isYesterday = (time: Date) => {
            const today = new Date();
            const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            const date = new Date(time);
            return date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
        };

        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth().toString().padStart(2, "0");
        const currentDay = currentDate.getDate().toString().padStart(2, "0");
        const currentYear = currentDate.getFullYear().toString().padStart(4, "0");

        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear().toString().padStart(4, "0");

        const dateFormatted = `${month}/${day}/${year}`;
        const timeFormatted = `${hours}:${minutes}:${seconds}`;

        const currentDateFormatted = `${currentMonth}/${currentDay}/${currentYear}`;

        if (dateFormatted === currentDateFormatted) {
            return `Today at ${timeFormatted}`;
        } else if (isYesterday(time)) {
            return `Yesterday at ${timeFormatted}`;
        } 
        return `${dateFormatted} at ${timeFormatted}`;
        
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
            const data = await socket?.request({ type: WebSocketCodes.SEND_CHANNEL_MESSAGE, data: { content: message.trim(), channelId: "1" } });
            if (data) {
                const { messageId } = data.data as { messageId: string };
                setLoadedMessages(l => [...l, {
                    // id: "1" + Date.now(),
                    // message: message,
                    // user: {
                    //     id: currentUser.id,
                    //     username: currentUser.username,
                    //     avatar: currentUser.avatar
                    // },
                    // time: new Date().toISOString()
                    id: messageId,
                    content: message.trim(),
                    authorId: currentUser.id,
                    channelId: "1",
                    createdAt: Date.now(),
                    edited: false
                }]);
                setMessage("");
            }
        }
    };
    const handleContextMenu = () => {};
    const handleClick = () => {};
    const handleKeypress = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            send();
        }
    };
    return (
        <div className="conversation flex flex-col self-stretch w-full h-full min-h-0 overflow-hidden" style={{
            left: "56px",
            width: "calc(100% - 56px)",
            position: "fixed"
        }}>
            <div className="description flex justify-start p-5 border-b w-full">
                <Channel28Regular className="w-5 h-5 mr-2" />
                <div className="space-x-3 w-full">
                    <b>hello</b>
                    <span className="text-gray-600">A testing channel.</span>
                </div>
                <div className="justify-self-end flex flex-row">
                    {call ? <></> : <Call28Filled className="w-5 h-5 hover:text-green-400 mx-2" onClick={joinCall} />}
                    <MoreVertical28Filled className="w-5 h-5 hover:text-green-400 mx-2" /> {/* TODO: onClick and openContextMenu */}
                </div>
            </div>
            {call ? <CallConnector token={token} /> : <></>}
            {/* <Scroller loadingComponent={
                <div>Loading...</div>
            } nextDataFn={() => {
                "t";
            }} nextEnd={true} nextLoading={true} previousDataFn={() => {"t";}} previousEnd={false} previousLoading={false} >
                e
            </Scroller> */}
            {/* <Virtuoso>

            </Virtuoso> */}
            <div ref={messagesElement} className="messages flex flex-col h-full justify-start overflow-y-scroll" onContextMenu={handleContextMenu} onClick={handleClick}>
                {loadedMessages.map(message => (
                    <div className="message hover:bg-gray-200 hover:bg-opacity-80 flex flex-col space-x-2 w-full" key={message.id}>
                        <div class="reseau pr-2 pl-20 my-3 relative"> 
                            <img src={window.internals.userStore.get(message.authorId)?.avatar} className="message-header-avatar w-12 h-12 rounded-full self-start border-slate-400 border-2 left-2 absolute m-2" style={{
                                marginTop: "calc(4px - .25rem)"
                            }} />
                            <div className="flex space-x-2">
                                <h2><strong className="message-header-name self-start" style={{ 
                                    fontWeight: 500,
                                }}>
                                    
                                    {window.internals.userStore.get(message.authorId)?.username ?? "Unknown user"}
                                </strong></h2> {/* use lighter font */}
                                <h2 className="message-header-time self-start" style={{ 
                                    fontWeight: 300,
                                }}>{formatTime(new Date(message.createdAt))}</h2> {/* use lighter font */}
                                <div className="message-header-options self-start">
                                    <div className="message-header-right-options-item hover:text-green-400" onClick={() => console.log("Message options clicked")}>
                                        <MoreVertical28Filled className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <p className="message-body text-left whitespace-pre-wrap">
                                <StyleParser raw={message.content} />
                            </p>
                        </div>
                    </div>
                ))}
                
            </div>
            <div className="input flex self-stretch justify-self-end px-5 py-4 w-full">
                <textarea onChange={v => {
                    setMessage((v.target as HTMLTextAreaElement).value);
                    expandingTextArea(v.target as HTMLTextAreaElement, { maxLines: 10 });
                }} onKeyPress={handleKeypress} value={message} type="text" placeholder="Type a message..." className="w-full h-12 px-4 py-2 border-2 rounded-md border-slate-300" id="message-input" />
                <div className="self-center mx-5 px-5 py-3 rounded-md hover:opacity-80 hover:bg-slate-200 hover:text-green-400 border-slate-200 border-2 h-12 flex justify-center items-center" onClick={send}> 
                    <Send28Regular className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default Channel;
