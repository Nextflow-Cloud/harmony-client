import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../components/ModalDialog";

import { Chat20Regular, Group20Regular, Home20Regular, MailInbox20Regular, Person20Regular, Settings20Regular } from "@fluentui/react-icons";
import Sidebar from "../components/Sidebar";
import ChannelComponent from "../components/Channel";

interface Button {
    text: string;
    id: string;
    primary?: boolean;
}

const topElements = [{
    icon: <Home20Regular />,
    text: "Home",
    id: "home"
}, {
    icon: <MailInbox20Regular />,
    text: "Activity",
    id: "activity"
}, {
    icon: <Chat20Regular />,
    text: "Messages",
    id: "messages"
}, {
    icon: <Group20Regular />,
    text: "Groups",
    id: "groups"
}];

const bottomElements = [{
    icon: <Person20Regular />,
    text: "Profile",
    id: "profile"
}, {
    icon: <Settings20Regular />,
    text: "Settings",
    id: "settings"
}];

const getCookie = (name: string) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop();

interface Props {
    showModalDialog: (title: string, content: string, buttons: Button[], onClose: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const Channel = ({ showModalDialog, hideModalDialog }: Props) => {
    
    const [activeElement, setActiveElement] = useState("home");

    const navigate = useNavigate();

    useEffect(() => {
        const elements = topElements.map(k => k.id).concat(bottomElements.map(k => k.id));
        const loc = location.pathname.split("/");
        if (loc.length < 3) 
            return navigate("/channel/home");
        if (!elements.includes(loc[2].toLowerCase()))
            return navigate("/channel/home");
        if (loc.length > 3)
            return navigate(`/channel/${loc[2].toLowerCase()}`);
        setActiveElement(loc[2].toLowerCase());
    }, []);
    useEffect(() => {
        navigate(`/channel/${activeElement}`);
    }, [activeElement]);
    useEffect(() => {
        const elements = topElements.map(k => k.id).concat(bottomElements.map(k => k.id));
        const loc = location.pathname.split("/");
        if (loc.length < 3) 
            return navigate("/channel/home");
        if (!elements.includes(loc[2].toLowerCase()))
            return navigate("/channel/home");
        if (loc.length > 3)
            return navigate(`/channel/${loc[2].toLowerCase()}`);
        setActiveElement(loc[2].toLowerCase());
    }, [location.pathname]);
    

    return (
        <>
            <Sidebar defaultElement="home" activeElement={activeElement} setActiveElement={setActiveElement} topElements={topElements} bottomElements={bottomElements} />
            <ChannelComponent
                // profile={{ id: "aaa", username: "aaa", avatar: "https://avatars0.githubusercontent.com/u/17098281?s=460&u=e8d9c9f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8&v=4" }} 
                token={getCookie("token") ?? ""}
                openContextMenu={() => {}} 
                closeContextMenu={() => {}}
                showModalDialog={showModalDialog}
                hideModalDialog={hideModalDialog} 
            />
        </>
    );
};

export default Channel;
