import { useRef } from "preact/hooks";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../utilities/redux/redux";

interface Button {
    text: string;
    id: string;
    primary?: boolean;
}

interface Props {
    title: string;
    content: string;
    buttons: Button[];
    // eslint-disable-next-line no-unused-vars
    onClose: (button: string) => void;
}

const ModalDialog = ({ title, content, onClose, buttons }: Props) => {

    const dialog = useRef<HTMLDivElement>(null);
    const darkTheme = useAppSelector(state => state.preferences.theme === "dark", shallowEqual);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50 fadein" onContextMenu={e => e.preventDefault()} ref={dialog}>
            <div className={`rounded-md ${darkTheme ? "bg-gray-900 text-gray-200" : "bg-white"} p-5 drop-shadow-lg opacity-100 max-w-prose`}>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            {title}
                        </h2>
                    </div>
                    <div className="flex flex-col">
                        {content}
                    </div>
                    <div className="flex flex-row justify-end">
                        {buttons.map(button => (
                            <button 
                                key={button.id} 
                                className={`px-4 py-2 mx-2 rounded-md cursor-default ${button.primary ? "bg-green-500 hover:bg-green-600" : (darkTheme ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300  hover:bg-gray-400")}`} 
                                onClick={() => {
                                    onClose(button.id);
                                    dialog.current?.classList.add("fadeout");
                                }}
                            >
                                {button.text}
                            </button>
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDialog;
