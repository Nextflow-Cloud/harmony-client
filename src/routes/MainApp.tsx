import { useCallback, useEffect, useState } from "preact/hooks";
import { Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Channel from "../components/Channel";
import Loading from "../components/Loading";
import { useAppDispatch, useAppSelector } from "../utilities/redux/redux";
import { Client } from "../utilities/lib/Client";
import useClient from "../hooks/useClient";
import styled from "styled-components";
import ContentContainer from "../components/ContentContainer";
import Home from "../components/Home";

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

    const client = useClient();

    useEffect(() => {
        establishConnection();
        return () => client?.destroy();
    }, []);
    
    const themeSystem = useAppSelector(state => state.preferences.themeSystem);
    const dispatch = useAppDispatch();

    const handle = useCallback((e: MediaQueryListEvent) => themeSystem && dispatch({
        type: "UPDATE_PREFERENCES",
        preferences: {
            theme: e.matches ? "dark" : "light"
        }
    }), [themeSystem]);

    const establishConnection = async () => {
        if (!client) {
            const client = new Client("wss://test.nextflow.cloud");
            await client.connect(getCookie("token") ?? "");
            try {
                Object.defineProperty(window, "client", {
                    value: client,
                    writable: false,
                    configurable: false
                });
            } catch {}
            dispatch({
                type: "SET_CLIENT", 
                client,
            });
            await client.fetchChannels();
            setLoading(false);
        }
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
};

export default MainApp;
