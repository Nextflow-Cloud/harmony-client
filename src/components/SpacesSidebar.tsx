import { Add20Regular } from "@fluentui/react-icons";
import styled from "styled-components";

const SpacesSidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`;
const SpacesSidebarList = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 9px;
`;

const SpacesSidebarListItem = styled.div`
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 10px;
    padding-right: 10px;
`

const SpacesSidebarActions = styled.div`
    display: flex;
    flex-direction: column;
    border-width: 1px;
    border-radius: 9px;
`;

const SpacesSidebarAction = styled.div`
    display: flex;
    padding: 6px;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
    }
    align-items: center;

`;

const SpacesSidebar = () => {
    return (
        <SpacesSidebarContainer>
            <SpacesSidebarList>
                <SpacesSidebarListItem>
                    hi
                </SpacesSidebarListItem>
            </SpacesSidebarList>
            <SpacesSidebarActions>
                <SpacesSidebarAction>
                    <Add20Regular />
                    <span>Create space</span>
                </SpacesSidebarAction>
            </SpacesSidebarActions>
        </SpacesSidebarContainer>
    );
};

export default SpacesSidebar;
