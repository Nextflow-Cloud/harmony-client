import styled from "styled-components";

const MessagesSidebarBase = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    color: white;
`;

const MessagesItem = styled.div`
    border-radius: 5px;
    background-color: rgba(217, 217, 217, 0.5);
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 8px;
`;

function ChannelSidebar() {
    return (
        <MessagesSidebarBase>
            <MessagesItem>Emperor of Bluegaria</MessagesItem>
        </MessagesSidebarBase>
    );
}

export default ChannelSidebar;
