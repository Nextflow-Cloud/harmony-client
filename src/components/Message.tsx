import { MoreVertical28Filled } from "@fluentui/react-icons";
import styled, { css } from "styled-components";
import { formatTime } from "../utilities/helpers";
import StyleParser from "./StyleParser";
import ChannelMessage from "../utilities/lib/Message";
import { useMemo } from "preact/hooks";
import { preferences } from "../utilities/state";

interface Props {
    message: ChannelMessage;
    showModalDialog: (title: string, message: string, buttons: { text: string; id: string; primary?: boolean }[], callback: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const MessageContainer = styled.div`
    :hover {
        ${props => props.darkTheme ? css`
            background-color: rgb(31 41 55 / 0.4); 
        ` : css`
            background-color: rgb(229 231 235 / 0.8);
        `}
    }
    ${props => props.darkTheme && css`
        color: rgb(209 213 219);
    `}
    display: flex;
    flex-direction: column;
    width: 100%;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
    }
`;

const MessageBase = styled.div`
    padding-right: 2.5rem;
    padding-left: 5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    position: relative;
`;

const MessageBody = styled.p`
    text-align: left;
    white-space: pre-wrap;
    overflow-wrap: break-words;
`;

const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
    }
    justify-items: center;
`;

const Message = (props: Props) => {
    const darkTheme = useMemo(() => preferences.theme === "dark", [preferences.theme]);

    return (
        <MessageContainer darkTheme={darkTheme} id={props.message.id}>
            <MessageBase> 
                <img src={"https://cdn.discordapp.com/avatars/494187257041780746/c6f8d7b695d6fa2f101010be71f29818.png?size=256"} className="message-header-avatar w-12 h-12 rounded-full self-start border-slate-400 border-2 left-2 absolute m-2" style={{
                    marginTop: "calc(4px - .25rem)"
                }} />
                <MessageHeader>
                    <h2><strong className="message-header-name" style={{ 
                        fontWeight: 500,
                    }}>
                        {props.message.author.username ?? "Unknown user"}
                    </strong></h2> {/* use lighter font */}
                    <h2 className={`message-header-time text-xs h-full ${darkTheme ? "text-gray-400" : "text-gray-600"}`} style={{ 
                        fontWeight: 300,
                    }}>{formatTime(props.message.createdAt)}</h2> {/* use lighter font */}
                    <div className="message-header-options">
                        <div className="message-header-right-options-item hover:text-green-400" onClick={() => console.log("Message options clicked")}>
                            <MoreVertical28Filled className="w-5 h-5" />
                        </div>
                    </div>
                </MessageHeader>
                <MessageBody>
                    <StyleParser raw={props.message.content} showModalDialog={props.showModalDialog} hideModalDialog={props.hideModalDialog} />
                </MessageBody>
            </MessageBase>
        </MessageContainer>
    )
};

export default Message;
