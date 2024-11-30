import { styled } from "solid-styled-components";
import avatar from "../assets/default.png";
import { Message } from "./MessageRenderer";
import { formatTime } from "../utilities";


const MessageAvatar = styled.img`
    border-radius: 10px;
    width: 40px;
    height: 40px;
`;

const MessageAuthor = styled.div``;

const MessageAuthorDetails = styled.div`
    display: flex;
    & > * + * {
        margin-left: 10px;
    }
    align-items: center;
`;

const MessageAuthorName = styled.div`
    font-weight: 700;
`;

const MessageAuthorTime = styled.div`
    font-weight: 300;
    font-size: 12px;
    color: #9c9c9c;
`;

const MessageContent = styled.div``;

const MessageContentGroup = styled.div``;

const MessageGroupBase = styled.div`
    display: flex;
    & > * + * {
        margin-left: 10px;
    }
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
`;

const MessageGroup = ({ messages }: { messages: Message[] }) => {
  return (
    <MessageGroupBase>
        <MessageAuthor>
            <MessageAvatar src={avatar}  />
        </MessageAuthor>
        <MessageContentGroup>
            <MessageAuthorDetails>
                <MessageAuthorName>{messages[0].author.name}</MessageAuthorName>
                <MessageAuthorTime>{formatTime(new Date(messages[0].timestamp))}</MessageAuthorTime>
            </MessageAuthorDetails>
            {messages.map((message) => (
                <MessageContent>
                    {message.content}
                </MessageContent>
            ))}
        </MessageContentGroup>
    </MessageGroupBase>
  );
}

export default MessageGroup;
