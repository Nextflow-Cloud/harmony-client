// @ts-expect-error React is not installed but is aliased
import { VideoHTMLAttributes } from "react";
import { useEffect, useRef } from "preact/hooks";

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
    srcObject: MediaStream
}

const Video = ({ srcObject, ...props }: PropsType) => {
    const refVideo = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!refVideo.current) return;
        refVideo.current.srcObject = srcObject;
    }, [srcObject]);

    return <video ref={refVideo} {...props} />;
};

export default Video;
