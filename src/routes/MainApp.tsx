import { useCallback, useEffect, useState } from "preact/hooks";
import { Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Channel from "../components/Channel";
import Loading from "../components/Loading";
import styled from "styled-components";
import ContentContainer from "../components/ContentContainer";
import Home from "../components/Home";
import { client, observe, preferences } from "../utilities/state";

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

interface Props {
    // eslint-disable-next-line no-unused-vars
    showModalDialog: (title: string, content: string, buttons: Button[], onClose: (button: string) => void) => void;
    hideModalDialog: () => void;
}

const MainApp = observe(({ showModalDialog, hideModalDialog }: Props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        establishConnection();
        return () => client.client?.destroy();
    }, []);
    
    const handle = useCallback((e: MediaQueryListEvent) => {
        if (preferences.themeSystem) {
            preferences.theme = e.matches ? "dark" : "light";
        }
    }, [preferences.themeSystem]);

    const establishConnection = async () => {
        await client.client.connect(localStorage.getItem("token") ?? "");
        await client.client.fetchChannels();
            setLoading(false);
    };

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
                    <Route path="/channels/:channel" element={
                        <Channel 
                            openContextMenu={() => {}} 
                            closeContextMenu={() => {}}
                            showModalDialog={showModalDialog}
                            hideModalDialog={hideModalDialog} 
                        />
                    } />
                </Routes>
            </AppContainer>}
        </>
    );
}, preferences);

export default MainApp;
