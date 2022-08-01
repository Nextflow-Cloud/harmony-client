import { Channel28Regular, Call28Filled, MoreVertical28Filled, Send28Regular } from "@fluentui/react-icons";
import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import ExtendedWebSocket, { WebSocketCodes, WebSocketMessage } from "../utilities/ExtendedWebSocket";
import LRU from "../utilities/LRU";
import StyleParser from "./StyleParser";
import expandingTextArea from "../utilities/expandingTextArea";

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
const Voice = ({ setCall }: { setCall: StateUpdater<boolean> }) => {
    return (<></>);
};
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
            
            // messagesElement.current.addEventListener('DOMNodeInserted', event => {
            //     const { currentTarget: target } = event;
            //     (target! as HTMLDivElement).scroll({ top: (target! as HTMLDivElement).scrollHeight, behavior: 'smooth' });
            // });
            (messagesElement.current! as HTMLDivElement).scroll({ top: (messagesElement.current! as HTMLDivElement).scrollHeight, behavior: 'smooth' });
        }
        const textarea = document.getElementById("message-input")!;
        const heightLimit = 200;
        textarea.onchange = () => {
            textarea.style.height = "";
            textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
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
        const request = await fetch(`https://secure.nextflow.cloud/api/user/${id ?? ""}`, {
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
                const data = message.data!;
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

        var date = new Date(time);
        var hours = date.getHours().toString().padStart(2, "0");
        var minutes = date.getMinutes().toString().padStart(2, "0");
        var seconds = date.getSeconds().toString().padStart(2, "0");

        var currentDate = new Date();
        var currentMonth = currentDate.getMonth().toString().padStart(2, "0");
        var currentDay = currentDate.getDate().toString().padStart(2, "0");
        var currentYear = currentDate.getFullYear().toString().padStart(4, "0");

        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var day = date.getDate().toString().padStart(2, "0");
        var year = date.getFullYear().toString().padStart(4, "0");

        var dateFormatted = `${month}/${day}/${year}`;
        var timeFormatted = `${hours}:${minutes}:${seconds}`;

        var currentDateFormatted = `${currentMonth}/${currentDay}/${currentYear}`;

        if (dateFormatted === currentDateFormatted) {
            return `Today at ${timeFormatted}`;
        } else if (isYesterday(time)) {
            return `Yesterday at ${timeFormatted}`;
        } else {
            return `${dateFormatted} at ${timeFormatted}`;
        }
    };
    const joinCall = () => {
        showModalDialog(
            "Information", 
            "Calls not supported yet. We're working on it :)", 
            [{ text: "OK", id: "ok", primary: true }], 
            () => hideModalDialog()
        );
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
            console.log("Message: " + message);
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
            {call ? <Voice setCall={setCall} /> : <></>}
            <div ref={messagesElement} className="messages flex flex-col h-full justify-start overflow-y-scroll" onContextMenu={handleContextMenu} onClick={handleClick}>
                {loadedMessages.map(message => (
                    <div className="message hover:bg-gray-200 hover:bg-opacity-80 flex flex-row items-center space-x-2 w-full px-2" key={message.id}>
                        <div className="message-header-avatar m-2 self-start">
                            <img src={window.internals.userStore.get(message.authorId)?.avatar} className="w-14 h-14 rounded-full self-start border-slate-400 border-2" />
                        </div>
                        <div className="message-header-details flex flex-col">
                            <div className="flex space-x-2">
                                <div className="message-header-name self-start">
                                    <h2><strong style={{ 
                                        fontWeight: 500,
                                    }}>{window.internals.userStore.get(message.authorId)?.username ?? "Unknown user"}</strong></h2> {/* use lighter font */}
                                </div>
                                <div className="message-header-time self-start">
                                    <h2 style={{ 
                                        fontWeight: 300,
                                    }}>{formatTime(new Date(message.createdAt))}</h2> {/* use lighter font */}
                                </div>
                                <div className="message-header-options self-start">
                                    <div className="message-header-right-options-item hover:text-green-400" onClick={() => console.log("Message options clicked")}>
                                        <MoreVertical28Filled className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="message-body flex">
                                <p className="text-left whitespace-pre-wrap">
                                    <StyleParser raw={message.content} />
                                </p>
                            </div>
                        </div>
                    
                    </div>
                ))}
                
            </div>
            <div className="input flex self-stretch justify-self-end px-5 py-2 w-full">
                <textarea onChange={v => {
                    setMessage((v.target as HTMLTextAreaElement).value)
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
