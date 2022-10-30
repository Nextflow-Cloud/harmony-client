import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../utilities/redux/redux";

interface SidebarElement {
    id: string;
    icon: JSX.Element;
    text: string;
}

interface Props {
    defaultElement: string;
    activeElement: string;
    // eslint-disable-next-line no-unused-vars
    setActiveElement: (id: string) => void;
    // topElements: SidebarElement[];
    elements: SidebarElement[];
    children: ComponentChildren;
}

const Sidebar = (props: Props) => {
    const [activeElement, setActiveElement] = useState<string>(props.activeElement);
    const [downElement, setDownElement] = useState<string>();

    const darkTheme = useAppSelector(state => state.preferences.theme === "dark", shallowEqual);

    useEffect(() => {
        if (downElement)
            (document.getElementById(downElement) as HTMLDivElement).classList.add("opacity-50");
        const listener = () => {
            if (downElement) {
                const element = document.getElementById(downElement) as HTMLDivElement;
                element.classList.remove("opacity-50");
                setDownElement(undefined);
            }
        };
        window.addEventListener("mouseup", listener);
        return () => {
            window.removeEventListener("mouseup", listener);
        };
    }, [downElement]);
    useEffect(() => {
        if (props.activeElement !== activeElement) {
            const element = document.getElementById(props.activeElement) as HTMLDivElement;
            if (element) {
                element.classList.add("active");
            }
            if (activeElement) {
                const oldElement = document.getElementById(activeElement) as HTMLDivElement;
                if (oldElement) oldElement.classList.remove("active");
            }
            setActiveElement(props.activeElement);
        }
    }, [props.activeElement]);
    return (
        <div id="sidebar" class={`flex-shrink ${darkTheme ? "text-gray-400 backdrop-blur-sm bg-gray-700 bg-opacity-20" : ""}`} style={{
            borderRadius: "4px",
            boxShadow: "0px 0px 4px rgba(0,0,0,0.25)",
            // padding: "10px",
            width: "350px",
            height: "100%",
            zIndex: "1",
            WebkitOverflowScrolling: "touch",
            WebkitTransform: "translate3d(0, 0, 0)",
            MsTransform: "translate3d(0, 0, 0)",
            transform: "translate3d(0, 0, 0)",
            transition: "all 0.3s ease 0s",
            willChange: "transform",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "start",
            margin: "0",
        }}>
            <div className="description justify-start px-5 py-4 border-b w-full">
                <b>{props.elements.find(v => v.id === activeElement)?.text ?? "Error"}</b>
            </div>
            <div class="h-full w-full px-5 py-2">
                {props.children}
            </div>
            <div className="bottom flex flex-row w-full border-t p-2">
                {props.elements.map(element => (
                    <div key={element.id} id={element.id} class={`sidebar-item text-xs flex flex-col items-center mx-1 ${darkTheme ? "hover:bg-gray-400 hover:bg-opacity-50" : "hover:bg-gray-200"} ${activeElement === element.id ? (darkTheme ? " active bg-gray-800 bg-opacity-50" : " active bg-gray-200") : ""}`} style={{ 
                        width: "65px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        borderRadius: "5px",
                        position: "relative",
                        marginTop: "2px",
                        marginBottom: "2px"
                    }} onMouseDown={() => setDownElement(element.id)} onClick={() => props.setActiveElement(element.id)}>
                        {element.icon}
                        <span style={{ userSelect: "none" }} class="item-name">{element.text}</span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Sidebar;

