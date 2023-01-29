import { Chat20Regular, Group20Regular, Home20Regular, Settings20Regular } from "@fluentui/react-icons";
import { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { observe, preferences } from "../utilities/state";

const SidebarDescription = styled.div`
    justify-content: flex-start;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom-width: 1px;
    width: 100%;
`;

const SidebarContents = styled.div`
    height: 100%;
    width: 100%;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
`;

const SidebarElements = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    border-top-width: 1px;
    padding: 0.5rem;
`;

const SidebarElement = styled.div`
    font-size: 0.75rem;
    line-height: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    :hover {
        ${props => props.darkTheme ? css`
            background-color: rgb(156 163 175 / 0.5);
        ` : css`
            background-color: rgb(229 231 235);
        `}
    }
    :active {
        opacity: 0.5;
    }
    ${props => props.active && (props.darkTheme ? css`
        background-color: rgb(31 41 55 / 0.5);
    ` : css`
        background-color: rgb(229 231 235);
    `)}
    width: 65px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 5px;
    position: relative;
    margin-top: 2px;
    margin-bottom: 2px;
    ${props => props.active && css`
        :after {
            background-color: #0061b4;
            border-radius: 6px;
            content: "";
            width: 50%;
            top: 0px;
            position: absolute;
            left: calc((65px/2)-(45%/2));
            height: 3px;
        }
    `}
`;

const SidebarElementLabel = styled.span`
    user-select: none;
`;

interface Props {
    id: string;
    text: string;
    children: ComponentChildren;
}

const SidebarBase = observe((props: Props) => {
    const navigate = useNavigate();
    const darkTheme = useMemo(() => preferences.theme === "dark", [preferences.theme]);
    
    return (
        <>
            <SidebarDescription>
                <b>{props.text}</b>
            </SidebarDescription>
            <SidebarContents>
                {props.children}
            </SidebarContents>
            <SidebarElements>
                <SidebarElement id="home" onClick={() => navigate("/app/home")} darkTheme={darkTheme} active={props.id === "home"}>
                    <Home20Regular />
                    <SidebarElementLabel>Home</SidebarElementLabel>
                </SidebarElement>
                <SidebarElement id="messages" onClick={() => navigate("/app/channels")} darkTheme={darkTheme} active={props.id === "messages"}>
                    <Chat20Regular />
                    <SidebarElementLabel>Messages</SidebarElementLabel>
                </SidebarElement>
                <SidebarElement id="spaces" onClick={() => navigate("/app/spaces")} darkTheme={darkTheme} active={props.id === "spaces"}>
                    <Group20Regular />
                    <SidebarElementLabel>Spaces</SidebarElementLabel>
                </SidebarElement>
                <SidebarElement id="settings" onClick={() => navigate("/app/settings")} darkTheme={darkTheme} active={props.id === "settings"}>
                    <Settings20Regular />
                    <SidebarElementLabel>Settings</SidebarElementLabel>
                </SidebarElement>
            </SidebarElements>
        </>
    );
}, preferences);

export default SidebarBase;
