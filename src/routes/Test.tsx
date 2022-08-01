import { useEffect, useState } from "preact/hooks";
import StyleParser from "../components/StyleParser";
import { Chat20Regular, Group20Regular, Home20Regular, MailInbox20Regular, Person20Regular, Settings20Regular } from "@fluentui/react-icons";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const elements = ["home", "activity", "messages", "groups", "profile", "settings"];

const Test = () => {
    const [testText, setTestText] = useState("");
    const [activeElement, setActiveElement] = useState("home");
    const navigate =  useNavigate();

    useEffect(() => {
        const loc = location.pathname.split("/");
        if (loc.length < 3) 
            return navigate("/test/home");
        if (!elements.includes(loc[2].toLowerCase()))
            return navigate("/test/home");
        if (loc.length > 3)
            return navigate(`/test/${loc[2].toLowerCase()}`);
        setActiveElement(loc[2].toLowerCase());
    }, []);
    useEffect(() => {
        navigate(`/test/${activeElement}`);
    }, [activeElement]);

    return (
        <div>
            <Sidebar defaultElement="home" activeElement={activeElement} setActiveElement={setActiveElement} topElements={[{
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
            }]} bottomElements={[{
                icon: <Person20Regular />,
                text: "Profile",
                id: "profile"
            }, {
                icon: <Settings20Regular />,
                text: "Settings",
                id: "settings"
            }]} />
            <div>
                <div>
                    <textarea class="text-black rounded-md p-2 w-2/3 resize-none bg-gray-200 text-sm h-80" type="text" onChange={e => setTestText((e.target as HTMLInputElement).value)} />
                </div>
                <div class="text-sm">
                    <StyleParser raw={testText} />
                </div>
            </div>
        </div>
    );
};

export default Test;
