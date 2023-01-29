import { BookInformation20Filled, ChevronDown16Regular, ChevronDown20Filled, Megaphone20Filled } from "@fluentui/react-icons";
import { useState } from "preact/hooks";
import styled from "styled-components";
import Space from "../../utilities/lib/Space";

const SpacesSidebarListItem = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: rgba(217, 217, 217, 0.5);
`;

const SpaceIcon = styled.div`
    border-radius: 5px;
    background-color: #D9D9D9;
    color: #00B574;
    font-size: x-large;
    padding-left: 8px;
    padding-right: 8px;
    width: 36px;
    text-align: center;
`;

const SpaceTitle = styled.span`
    
`;

const SpaceHeaderUnion = styled.div`
    display: flex;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.75rem;
    }
    align-items: center;
`;

const SpaceHeader = styled.div`
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: rgba(217, 217, 217, 0.2);
    color: white;
    /* border-radius: 5px; */
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ChannelsList = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    padding-bottom: 10px;
    color: white;

    transition: all 0.5s;
    margin-top: ${props => props.open ? "0%" : "-100%"};
`;

const Channel = styled.div`
    display: flex;
    align-items: center;
    & > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
    }
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
`;

const DynamicChevron = styled(ChevronDown20Filled)`
    transition: transform 0.2s;
    transform: rotate(${props => props.open ? "0deg" : "-90deg"});
`;

const ChannelsListWrapper = styled.div`
    overflow: hidden;
`;

interface Props {
    space: Space;
}

const SpaceItem = (props: Props) => {
    const [open, setOpen] = useState(false);
    return (
        <SpacesSidebarListItem>
            <SpaceHeader>
                <SpaceHeaderUnion>
                    <SpaceIcon>
                        {/* <span>🌎</span> */}
                        {props.space.name.charAt(0)}
                    </SpaceIcon>
                    <SpaceTitle>
                        {props.space.name}
                    </SpaceTitle>
                </SpaceHeaderUnion>
                <div onClick={() => setOpen(!open)} >
                    <DynamicChevron open={open} />
                </div>
            </SpaceHeader>
            <ChannelsListWrapper>
                <ChannelsList open={open}>
                    <div style={{ fontSize: "small", display: "flex", alignItems: "center" }}>
                        <ChevronDown16Regular />
                        <span>Important</span>
                    </div>
                    <Channel>
                        <BookInformation20Filled />
                        <span>Information</span>
                    </Channel>
                    <Channel>
                        <Megaphone20Filled />
                        <span>Announcements</span>
                    </Channel>
                    
                </ChannelsList>
            </ChannelsListWrapper>
        </SpacesSidebarListItem>
    );
};

export default SpaceItem;
