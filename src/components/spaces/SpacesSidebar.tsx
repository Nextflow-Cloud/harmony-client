import { Add20Regular } from "@fluentui/react-icons";
import { useEffect } from "preact/hooks";
import styled from "styled-components";
import { client, observe } from "../../utilities/state";
import SpaceItem from "./SpaceItem";

const SpacesSidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1rem;
    }
`;
const SpacesSidebarList = styled.div`
    display: flex;
    flex-direction: column;
    /* border-radius: 9px; */
    & > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1rem;
    }
    overflow-y: scroll;
    .container::-webkit-scrollbar {
        width: 0px;
    }
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.7) transparent;
    padding-right: 4px;
    /* border: 1px solid rgba(255, 255, 255, 0.7); */
`;

const SpacesSidebarActions = styled.div`
    display: flex;
    flex-direction: column;
    /* border-width: 1px; */
`;

const SpacesSidebarAction = styled.div`
    display: flex;
    padding: 8px;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
    }
    align-items: center;
    background-color: rgba(217, 217, 217, 0.5);
    border-radius: 9px;
    color: white;
    user-select: none;
`;

const SpacesSidebar = observe(() => {
    // const client = useClient();
    // const spaces = useSpaces();
    const createSpace = () => {
        const name = prompt("Enter a name") ?? "Default name";
        client.client.createSpace(name);
    };
    useEffect(() => {
        client.client.fetchSpaces();
    }, []);
    return (
        <SpacesSidebarContainer>
            <SpacesSidebarList>
                {Array.from(client.client.spaces.values()).map((s) => (
                    <SpaceItem space={s} />
                ))}
                {/* <SpaceItem name="Nextflow Support" /> */}
            </SpacesSidebarList>
            <SpacesSidebarActions>
                <SpacesSidebarAction onClick={createSpace}>
                    <Add20Regular />
                    <span>Create space</span>
                </SpacesSidebarAction>
            </SpacesSidebarActions>
        </SpacesSidebarContainer>
    );
}, client.client.spaces);

export default SpacesSidebar;
