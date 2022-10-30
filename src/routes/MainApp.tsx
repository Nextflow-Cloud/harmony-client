import { useCallback, useContext, useEffect, useReducer, useState } from "preact/hooks";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { Chat20Regular, Group20Regular, Home20Regular, Settings20Regular } from "@fluentui/react-icons";
import Sidebar from "../components/Sidebar";
import Channel from "../components/Channel";
import Loading from "../components/Loading";
import { useAppDispatch, useAppSelector } from "../utilities/redux/redux";

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
    const [activeElement, setActiveElement] = useState(location.pathname.split("/")[2]);
    const [sidebarContents, setSidebarContents] = useState<JSX.Element>();
    const [loading, setLoading] = useState(true);
    // const x = useContext<string>("")
    // useReducer
    const navigate = useNavigate();

    useEffect(() => setLoading(false));

    useEffect(() => {
        navigate(`/app/${activeElement}`);
    }, [activeElement]);

    useEffect(() => {
        const path = location.pathname.split("/")[2];
        const e = elements.map(k => k.id).includes(path) ? path : "home";
        setActiveElement(e);
    }, [location.pathname]);
    
    const themeSystem = useAppSelector(state => state.preferences.themeSystem);
    const dispatch = useAppDispatch();

    const handle = useCallback((e: MediaQueryListEvent) => themeSystem && dispatch({
        type: "UPDATE_PREFERENCES",
        preferences: {
            theme: e.matches ? "dark" : "light"
        }
    }), [themeSystem]);

    useEffect(() => {
        const match = window.matchMedia("(prefers-color-scheme: dark)");
        match.addEventListener("change", handle);
        return () => match.removeEventListener("change", handle);
    }, []);
    
    return (
        <>
            {loading && <Loading />}
            <div class="flex flex-row w-full h-full">
                <Sidebar defaultElement="home" activeElement={activeElement} setActiveElement={setActiveElement} elements={elements}>
                    {sidebarContents}
                </Sidebar>
                <Routes>
                    <Route path="/" element={
                        <Navigate to="/home" />
                    } />
                    <Route path="/messages" element={
                        <Channel 
                            token={getCookie("token") ?? ""}
                            openContextMenu={() => {}} 
                            closeContextMenu={() => {}}
                            showModalDialog={showModalDialog}
                            hideModalDialog={hideModalDialog} 
                            setSidebarContents={setSidebarContents}
                        />
                    } />
                </Routes>
            </div>
        </>
    );
};

export default MainApp;
