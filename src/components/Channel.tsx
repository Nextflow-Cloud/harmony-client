import { Channel28Regular, Call28Filled, MoreVertical28Filled, Send28Regular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "preact/hooks";
// import CallConnector from "./CallConnector";
import { useAppSelector } from "../utilities/redux/redux";
import Message from "./Message";
import { shallowEqual } from "react-redux";
import { ChatChannel } from "../utilities/lib/Channel";
import ChannelMessage from "../utilities/lib/Message";
import { Navigate } from "react-router-dom";
import useChannel from "../hooks/useChannel";
import styled, { css } from "styled-components";
import useClient from "../hooks/useClient";
// import expandingTextArea from "../utilities/expandingTextArea";
// import { Virtuoso } from "react-virtuoso";
// import { ChannelRenderer } from "../utilities/ChannelRenderer";
// import LRU from "../utilities/LRU";
// import Scroller from "./Scroller";

interface Props {
    openContextMenu: () => void;
    closeContextMenu: () => void;
    // eslint-disable-next-line no-unused-vars
    showModalDialog: (title: string, message: string, buttons: { text: string; id: string; primary?: boolean }[], callback: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const ChannelContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    width: 100%;
    height: 100%;
    min-height: 0px;
    overflow: hidden;
`;

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    ${props => props.darkTheme && css`
        background-color: rgb(107 114 128 / 0.2);
        backdrop-filter: blur(16px);
    `}
`;

const Channel = ({ openContextMenu, closeContextMenu, showModalDialog, hideModalDialog }: Props) => {
    // const [currentUser, setCurrentUser] = useState<User>({ id: "1", username: "John Doe", avatar: "https://avatars0.githubusercontent.com/u/17098281?s=460&u=e8d9c9f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8&v=4" });
    const [message, setMessage] = useState("");
    // const [isOpen, setIsOpen] = useState(false);
    // const [isTyping, setIsTyping] = useState(false);
    const [call, setCall] = useState(false);
    const [loadedMessages, setLoadedMessages] = useState<ChannelMessage[]>([]);
    
    const darkTheme = useAppSelector(state => state.preferences.theme === "dark", shallowEqual);

    const messagesElement = useRef<HTMLDivElement>(null);
    const messageInput = useRef<HTMLTextAreaElement>(null);

    const client = useClient();
    const channel = useChannel();
    
    useEffect(() => {
        let x = false;
        const observer = new MutationObserver(events => {
            const target = events[0].target as HTMLDivElement;
            target.scroll({ top: target.scrollHeight, behavior: !x ? void 0 : "smooth" });
            x = true;
        });
        if (messagesElement.current) {
            observer.observe(messagesElement.current, { childList: true });
            messagesElement.current.scroll({ top: messagesElement.current.scrollHeight });
        }
        loadMessages();
        const handler = (message: ChannelMessage) => {
            setLoadedMessages(s => [...s, message]);
        };
        client?.on("messageCreate", handler);
        return () => {
            observer.disconnect();
            client?.off("messageCreate", handler);
        };
    }, []);
    
    useEffect(() => {
        if (messageInput.current) {
            const textarea = messageInput.current;
            const heightLimit = 200;
            textarea.onchange = () => {
                textarea.style.height = "";
                textarea.style.height = `${Math.min(textarea.scrollHeight, heightLimit)}px`;
            };
        }
    }, [messageInput]);

    const loadMessages = async () => {
        const msgs = Array.from((await (channel as ChatChannel).messages.fetch({ latest: true })).values()).reverse();
        setLoadedMessages(msgs);
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
            
            try {
                await (channel as ChatChannel).send(message.trim());
                setMessage("");
            } catch {}
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

    if (!channel) {
        return (
            <Navigate to="/app/home" />
        );
    }
    
    return (
        <ChannelContainer>
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
            
            {/* {call ? <CallConnector token={token} socket={store.getState().socket.socket!} /> : <></>} */}
            {/* <Scroller loadingComponent={
                <div>Loading...</div>
            } nextDataFn={() => {
                "t";
            }} nextEnd={true} nextLoading={true} previousDataFn={() => {"t";}} previousEnd={false} previousLoading={false} >
                e
            </Scroller> */}
            {/* <Virtuoso>

            </Virtuoso> */}
            <MessagesContainer darkTheme={darkTheme} ref={messagesElement} onContextMenu={handleContextMenu} onClick={handleClick}>
                {loadedMessages.map(message => (
                    <Message message={message} showModalDialog={showModalDialog} hideModalDialog={hideModalDialog} />
                ))}
            </MessagesContainer>
            <div className={`input flex self-stretch justify-self-end px-5 py-4 w-full ${darkTheme ? "bg-opacity-20 bg-gray-500 backdrop-blur-lg" : ""}`}>
                <textarea ref={messageInput} onChange={v => {
                    setMessage((v.target as HTMLTextAreaElement).value);
                    // expandingTextArea(v.target as HTMLTextAreaElement, { maxLines: 10 });
                }} onKeyPress={handleKeypress} value={message} type="text" placeholder="Type a message..." className={`${darkTheme ? "backdrop-blur-sm bg-gray-300 bg-opacity-20 border-slate-200 border-opacity-40 text-gray-300" : "border-slate-200"} w-full h-12 px-4 py-2 border-2 rounded-md focus:outline-none`}
                style={{
                    minHeight: "calc(16px + 2rem)",
                    maxHeight: "calc((16px*10) + 2rem)"
                }} />
                <div className={`self-center mx-5 px-5 py-3 rounded-md hover:opacity-80 hover:bg-slate-200 hover:text-green-400 border-2 h-12 flex justify-center items-center ${darkTheme ? "text-gray-300 border-slate-200 border-opacity-40" : "border-slate-200"}`} onClick={send}> 
                    <Send28Regular className="w-5 h-5" />
                </div>
            </div>
        </ChannelContainer>
    );
};

export default Channel;
