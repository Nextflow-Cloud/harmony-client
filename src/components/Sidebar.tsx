import { LineHorizontal320Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "preact/hooks";

interface SidebarElement {
    id: string;
    icon: JSX.Element;
    text: string;
}

interface Props {
    defaultElement: string;
    activeElement: string;
    setActiveElement: (id: string) => void;
    topElements: SidebarElement[];
    bottomElements: SidebarElement[];
}

const Sidebar = (props: Props) => {
    const [activeElement, setActiveElement] = useState<string>(props.activeElement);
    const [downElement, setDownElement] = useState<string>();
    const menu = () => {
        const sidebar = (document.getElementById("sidebar")! as HTMLDivElement);
        sidebar.classList.toggle("hidden");
        // #sidebar.hidden .item-name {
        //     display: none;
        // }
        if (sidebar.classList.contains("hidden")) sidebar.style.width = "56px";
        else sidebar.style.width = "300px";
    };
    useEffect(() => {
        if (downElement)
            (document.getElementById(downElement)! as HTMLDivElement).classList.add("opacity-50");
        const listener = () => {
            if (downElement) {
                const element = document.getElementById(downElement)! as HTMLDivElement;
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
            const element = document.getElementById(props.activeElement)! as HTMLDivElement;
            if (element) {
                element.classList.add("active");
            }
            if (activeElement) {
                const oldElement = document.getElementById(activeElement)! as HTMLDivElement;
                oldElement.classList.remove("active");
            }
            setActiveElement(props.activeElement);
        }
    }, [props.activeElement]);
    return (
        <div id="sidebar" class="hidden" style={{
            backgroundColor: "rgb(248,244,244)",
            borderRadius: "4px",
            boxShadow: "0px 0px 4px rgba(0,0,0,0.25)",
            padding: "10px",
            position: "fixed",
            top: "0",
            left: "0",
            width: "56px",
            height: "100%",
            zIndex: "1",
            overflowY: "auto",
            overflowX: "hidden",
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
            flex: "0 0 300px",
            margin: "0",
            overflow: "hidden",
            color: "rgb(51,51,51)",
        }}>
            <div class="top w-full">
                <div class="flex flex-col items-start w-full">
                    <div class="logo mb-2" style={{
                        alignSelf: "center",

                    }}>
                        {/* <div class="logo-text item-name" style={{ userSelect: "none" }}>
                            Easylink
                        </div> */}
                    </div>
                    <div id="menu" class="sidebar-item space-x-3 text-sm flex hover:bg-gray-200" style={{ 
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        borderRadius: "5px",
                        position: "relative",
                        marginTop: "2px",
                        marginBottom: "2px"
                    }} onMouseDown={() => setDownElement("menu")} onClick={menu}>
                        <LineHorizontal320Regular />
                    </div>
                    {props.topElements.map(element => (
                        <div key={element.id} id={element.id} class={`sidebar-item space-x-3 text-sm flex hover:bg-gray-200${activeElement === element.id ? " active bg-gray-200" : ""}`} style={{ 
                            width: "100%",
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
            <div className="bottom flex flex-col w-full">
                {props.bottomElements.map(element => (
                    <div key={element.id} id={element.id} class={`sidebar-item space-x-3 text-sm flex hover:bg-gray-200${activeElement === element.id ? " active bg-gray-200" : ""}`} style={{ 
                        width: "100%",
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

