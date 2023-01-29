import { useMemo } from "preact/hooks";
import { Route, Routes } from "react-router-dom";
import styled, { css } from "styled-components";
import { observe, preferences } from "../utilities/state";
import ChannelSidebar from "./channels/ChannelSidebar";
import SidebarBase from "./SidebarBase";
import SpacesSidebar from "./spaces/SpacesSidebar";

const SidebarContainer = styled.div`
    flex-shrink: 1;
    ${(props) =>
        props.darkTheme &&
        css`
            color: rgb(156 163 175);
            backdrop-filter: blur(4px);
            background-color: rgb(55 65 81 / 0.2);
        `}
    border-radius: 4px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    width: 350px;
    height: 100%;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    /* overflow: auto; */
    margin: 0;
`;

const Sidebar = observe(() => {
    const darkTheme = useMemo(
        () => preferences.theme === "dark",
        [preferences.theme],
    );
    // transform: "translate3d(0, 0, 0)",
    // transition: "all 0.3s ease 0s",
    return (
        <SidebarContainer darkTheme={darkTheme}>
            <Routes>
                <Route
                    path="/home"
                    element={
                        <SidebarBase id="home" text="Home">
                            There is little difference visually, but the code is
                            significantly cleaner and better performing.
                        </SidebarBase>
                    }
                />
                <Route
                    path="/channels"
                    element={
                        <SidebarBase id="messages" text="Messages">
                            {/* <div class="flex flex-col">
                            <div class="user rounded-md border my-1 p-2">
                                hi 1
                            </div>
                            <div class="user rounded-md border my-1 p-2">
                                hi 2
                            </div>
                        </div> */}
                            <ChannelSidebar />
                        </SidebarBase>
                    }
                />
                <Route
                    path="/spaces"
                    element={
                        <SidebarBase id="spaces" text="Spaces">
                            <SpacesSidebar />
                        </SidebarBase>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <SidebarBase
                            id="settings"
                            text="Settings"
                        >
                            
                        </SidebarBase>
                    }
                />
            </Routes>
        </SidebarContainer>
    );
}, preferences);

export default Sidebar;
