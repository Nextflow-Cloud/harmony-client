import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";

import { Chat20Regular, Group20Regular, Home20Regular, Settings20Regular } from "@fluentui/react-icons";
import Sidebar from "../components/Sidebar";
import ChannelComponent from "../components/Channel";

interface Button {
    text: string;
    id: string;
    primary?: boolean;
}

const elements = [{
    icon: <Home20Regular />,
    text: "Home",
    id: "home"
}, {
    icon: <Chat20Regular />,
    text: "Messages",
    id: "messages"
}, {
    icon: <Group20Regular />,
    text: "Spaces",
    id: "spaces"
}, {
    icon: <Settings20Regular />,
    text: "Settings",
    id: "settings"
}];

const getCookie = (name: string) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop();

interface Props {
    // eslint-disable-next-line no-unused-vars
    showModalDialog: (title: string, content: string, buttons: Button[], onClose: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const MainApp = ({ showModalDialog, hideModalDialog }: Props) => {
    const [activeElement, setActiveElement] = useState("home");
    const navigate = useNavigate();

    useEffect(() => {
        const elementIds = elements.map(k => k.id);
        const loc = location.pathname.split("/");
        if (loc.length < 3) 
            return navigate("/channel/home");
        if (!elementIds.includes(loc[2].toLowerCase()))
            return navigate("/channel/home");
        if (loc.length > 3)
            return navigate(`/channel/${loc[2].toLowerCase()}`);
        setActiveElement(loc[2].toLowerCase());
    }, []);
    useEffect(() => {
        navigate(`/channel/${activeElement}`);
    }, [activeElement]);
    useEffect(() => {
        const elementIds = elements.map(k => k.id);
        const loc = location.pathname.split("/");
        if (loc.length < 3) 
            return navigate("/channel/home");
        if (!elementIds.includes(loc[2].toLowerCase()))
            return navigate("/channel/home");
        if (loc.length > 3)
            return navigate(`/channel/${loc[2].toLowerCase()}`);
        setActiveElement(loc[2].toLowerCase());
    }, [location.pathname]);
    
    return (
        <div class="flex flex-row w-full h-full">
            <Sidebar defaultElement="home" activeElement={activeElement} setActiveElement={setActiveElement} elements={elements} />
            <ChannelComponent
                // profile={{ id: "aaa", username: "aaa", avatar: "https://avatars0.githubusercontent.com/u/17098281?s=460&u=e8d9c9f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8&v=4" }} 
                token={getCookie("token") ?? ""}
                openContextMenu={() => {}} 
                closeContextMenu={() => {}}
                showModalDialog={showModalDialog}
                hideModalDialog={hideModalDialog} 
            />
        </div>
    );
};

export default MainApp;
