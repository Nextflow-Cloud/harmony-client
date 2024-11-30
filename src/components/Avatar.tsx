import { styled } from "solid-styled-components";


const AvatarBase = styled.img`
    border-radius: 10px;
    width: 40px;
    height: 40px;
`;

const AvatarContainer = styled.svg<{ main?: boolean }>`
    ${({ main }) => main ? `
        &:hover {
            filter: drop-shadow(0px 0px 10px #9153ad);
        }
        transition: filter 0.2s;
    ` : ""}
    user-select: none;
`

interface Props {
    url: string;
    status: "online" | "away" | "busy"| "busy_notify" | "offline";
    main?: boolean;
}

const statusColors = {
    online: "#5EFFB9",
    away: "#FFFF5E",
    busy: "#ff5e91",
    busy_notify: "#5E91FF",
    offline: "#848484"
}

const Avatar = (props: Props) => {
    return (
        <AvatarContainer main={props.main} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="avatar-status">
                <rect x="0" y="0" width="40" height="40" fill="white" />
                <circle cx="35" cy="35" r="8" fill={"black"} />
            </mask>
            <foreignObject 
                width="40" 
                height="40"
                // @ts-expect-error
                mask="url(#avatar-status)"
            >
                <AvatarBase src={props.url} alt="User Avatar" draggable={false} />
            </foreignObject>
            <circle
                cx="35"
                cy="35"
                r="5"
                fill={statusColors[props.status]}
            />
        </AvatarContainer>
    );
}

export default Avatar;
