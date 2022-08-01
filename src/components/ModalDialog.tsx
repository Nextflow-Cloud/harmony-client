interface Button {
    text: string;
    id: string;
    primary?: boolean;
}

interface Props {
    title: string;
    content: string;
    buttons: Button[];
    onClose: (button: string) => void;
}

const ModalDialog = ({ title, content, onClose, buttons }: Props) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50 backdrop-blur-sm" onContextMenu={e => e.preventDefault()}>
            <div className="rounded-md bg-white p-5 drop-shadow-lg opacity-100">
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
                            <button key={button.id} className={`px-4 py-2 mx-2 rounded-md ${button.primary ? "bg-green-500 hover:bg-green-600" : "bg-gray-300  hover:bg-gray-400"}`} onClick={() => onClose(button.id)}>
                                {button.text}
                            </button>
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDialog;
