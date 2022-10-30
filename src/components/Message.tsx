import { MoreVertical28Filled } from "@fluentui/react-icons";
import { shallowEqual } from "react-redux";
import { formatTime } from "../utilities/helpers";
import { store, useAppSelector } from "../utilities/redux/redux";
import { ChannelMessage } from "./Channel";
import StyleParser from "./StyleParser";

interface Props {
    message: ChannelMessage;
    showModalDialog: (title: string, message: string, buttons: { text: string; id: string; primary?: boolean }[], callback: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const Message = (props: Props) => {
    const darkTheme = useAppSelector(state => state.preferences.theme === "dark", shallowEqual);

    return (
        <div className={`message ${darkTheme ? "hover: hover:bg-gray-800 hover:bg-opacity-40 text-gray-300" : "hover:bg-gray-200 hover:bg-opacity-80"} flex flex-col space-x-2 w-full`} key={props.message.id}>
            <div class="reseau pr-10 pl-20 my-3 relative"> 
                <img src={"https://cdn.discordapp.com/avatars/494187257041780746/c6f8d7b695d6fa2f101010be71f29818.png?size=256"} className="message-header-avatar w-12 h-12 rounded-full self-start border-slate-400 border-2 left-2 absolute m-2" style={{
                    marginTop: "calc(4px - .25rem)"
                }} />
                <div className="flex items-center space-x-2 justify-items-center">
                    <h2><strong className="message-header-name" style={{ 
                        fontWeight: 500,
                    }}>
                        {store.getState().users[props.message.authorId]?.username ?? "Unknown user"}
                    </strong></h2> {/* use lighter font */}
                    <h2 className={`message-header-time text-xs h-full ${darkTheme ? "text-gray-400" : "text-gray-600"}`} style={{ 
                        fontWeight: 300,
                    }}>{formatTime(new Date(props.message.createdAt))}</h2> {/* use lighter font */}
                    <div className="message-header-options">
                        <div className="message-header-right-options-item hover:text-green-400" onClick={() => console.log("Message options clicked")}>
                            <MoreVertical28Filled className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <p className="message-body text-left whitespace-pre-wrap break-words">
                    <StyleParser raw={props.message.content} showModalDialog={props.showModalDialog} hideModalDialog={props.hideModalDialog} />
                </p>
            </div>
        </div>
    )
};

export default Message;
