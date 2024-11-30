import { ChannelIcon } from "solid-fluent-icons";
import { createEffect, createSignal } from "solid-js";
import { styled } from "solid-styled-components";
import ChatInput from "./ChatInput";
import MessageGroup from "./MessageGroup";
import MessageRenderer from "./MessageRenderer";

const ChatHeading= styled.div`
    position: absolute;
    width: calc(100% - 60px);
    height: 50px;
    border-radius: 5px;
    background: rgba(54, 54, 54, 0.60);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
    backdrop-filter: blur(10px);
`;

const ChatContentBase = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;
const ChatMessages = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    /* justify-content: flex-end; */
    flex-direction: column;
    overflow-x: hidden;
    &:first-child {
        margin-top: 20px;
    }
`;
const ChatInputBox = styled.div`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
`;


const ChannelBasics = styled.div`
    display: flex;
    align-items: center;
    & > * + * {
        margin-left: 10px;
    }
    user-select: none;
`;

const ChannelName = styled.div`
    font-size: 16px;

`;

const ChannelDescription = styled.div`
    font-size: 12px;
    font-weight: 300;
    color: #9c9c9c;
`;

const ChannelControls = styled.div`
    display: flex;
    align-items: center;
    & > * + * {
        margin-left: 10px;
    }
    user-select: none;
`

const ChannelOption = styled.div<{ active?: boolean }>`
    &:after{
        content:"";
        display:block;
        width:0;
        height:3px;
        background-color:transparent;
        margin-top:2px;
    }
    ${({ active }) => active ? `
        &:after{
            width:75%;
            margin-left:12.5%;
            background-color:#6A009B;
            border-radius:5px;
            transition:width 0.3s, margin-left 0.3s;
        }
        &:hover:after{
            width:100%;
            margin-left:0;
        }
            font-weight: 600;
    `:``}
    border-radius: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 8px;
    padding-bottom: 5px;
    &:hover {
        background: rgba(28, 28, 28, 0.5);
    }
`;

const ChatBeginning = styled.div`
    width: 100%;
    padding: 20px;
    margin-top: 60px;
`;
const ChatContent = () => {
    // const [message, setMessage] = createSignal("");
    // let divRef: HTMLDivElement | undefined;
    // createEffect(() => {
    //     if (divRef) {
    //         const selection = window.getSelection();
    //         // if something is selected
    //         if (selection && selection.rangeCount > 0) {
    //             const range = selection.getRangeAt(0);
    //             const position = range.startOffset;
                
    //             // Update content
    //             divRef.textContent = message();
                
    //             // Restore the cursor position
    //             const newRange = document.createRange();
    //             console.log(position, divRef.textContent.length);
    //             newRange.setStart(divRef, Math.min(position, divRef.textContent.length) - 1);
    //             newRange.setEnd(divRef, Math.min(position, divRef.textContent.length) - 1);
    //             newRange.collapse(true);
                
    //             selection.removeAllRanges();
    //             selection.addRange(newRange);
    //         } else {
    //             // If no selection, update content as usual
    //             divRef.textContent = message();
    //         }
    //     }
    // });
      
    return (
        <ChatContentBase>
            <ChatHeading>
                <ChannelBasics>
                    <ChannelIcon />
                    <ChannelName>General</ChannelName>
                    <ChannelDescription>Hmm, what could this be about?</ChannelDescription>
                </ChannelBasics>
                <ChannelControls>
                    <ChannelOption active>Text</ChannelOption>
                    <ChannelOption>Voice</ChannelOption>
                </ChannelControls>
            </ChatHeading>
            <ChatMessages>
                <ChatBeginning>
                    This is the beginning of the channel.
                </ChatBeginning>
                <MessageRenderer messages={[
                    {
                        id: "1",
                        content: "Hello!",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "2",
                        content: "Hi!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "3",
                        content: "How are you?",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "4",
                        content: "I'm good, thanks!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "5",
                        content: "How about you?",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "6",
                        content: "I'm doing great!",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "7",
                        content: "That's good to hear!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "8",
                        content: "Yeah!",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "9",
                        content: "I'm glad you're doing well!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "10",
                        content: "Thanks!",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "11",
                        content: "No problem!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "12",
                        content: "How's your day going?",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "13",
                        content: "It's going well!",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "14",
                        content: "That's great!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "15",
                        content: "Yeah!",
                        timestamp: Date.now(),
                        author: {
                            id: "1",
                            name: "User 1",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                    {
                        id: "16",
                        content: "I'm glad you're doing well!",
                        timestamp: Date.now(),
                        author: {
                            id: "2",
                            name: "User 2",
                            avatar: "https://i.pravatar.cc/300",
                        }
                    },
                ]} />
            </ChatMessages>
            <ChatInputBox>
                <ChatInput />
            </ChatInputBox>
        </ChatContentBase>
    )
}

export default ChatContent;
