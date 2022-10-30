import styled, { keyframes } from "styled-components";

const ring = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const LoadingBase = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    .spinner {
        display: inline-block;
        position: relative;
        width: 48px;
        height: 52px;
    }
    .spinner div {
        width: 32px;
        margin: 8px;
        height: 32px;
        display: block;
        position: absolute;
        border-radius: 50%;
        box-sizing: border-box;
        border: 2px solid #fff;
        animation: ${ring} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
    }
    .spinner div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .spinner div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .spinner div:nth-child(3) {
        animation-delay: -0.15s;
    }
`;

const Loading = () => {
    return (
        <div class="z-50 h-full w-full">
            <LoadingBase>
                <div class="spinner">
                    <div />
                    <div />
                    <div />
                </div>
            </LoadingBase>
        </div>
    );
};

export default Loading;
