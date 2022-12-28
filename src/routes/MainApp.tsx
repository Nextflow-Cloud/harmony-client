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

const AppContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`;

const getCookie = (name: string) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop();

interface Props {
    // eslint-disable-next-line no-unused-vars
    showModalDialog: (title: string, content: string, buttons: Button[], onClose: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const MainApp = ({ showModalDialog, hideModalDialog }: Props) => {
    const [loading, setLoading] = useState(true);

    
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
            {!loading && <AppContainer>
                <Sidebar />
                <Routes>
                    <Route path="/" element={
                        <Navigate to="/app/home" />
                    } />
                    <Route path="/home" element={
                        <Home />
                    } />
                    <Route path="/channels" element={
                        <Channel 
                            openContextMenu={() => {}} 
                            closeContextMenu={() => {}}
                            showModalDialog={showModalDialog}
                            hideModalDialog={hideModalDialog} 
                        />
                    } />
                    <Route path="/spaces" element={
                        <ContentContainer />
                    } />
                    <Route path="/settings" element={
                        <ContentContainer />
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
            </AppContainer>}
        </>
    );
};

export default MainApp;
