import { useEffect, useState } from "preact/hooks";
import Video from "../components/Video";
import Call, { ConsumerData } from "../utilities/Call";
import { Call24Filled, ShareScreenStart24Filled, CallCheckmark20Filled, CallEnd20Filled, CallConnecting20Filled, MicOff24Filled, Mic24Filled, ShareScreenStop24Filled } from "@fluentui/react-icons";
import "../tooltips.css";
import { Producer } from "mediasoup-client/lib/Producer";
// import { Transport } from "mediasoup-client/lib/Transport";

// const useForceUpdate = () => {
//     const [, setValue] = useState(0);
//     return () => setValue(value => value + 1);
// };

const CallConnector = ({ token }: { token: string; }) => {
    const [call, setCall] = useState<Call>();
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);

    const [unmuted, setUnmuted] = useState(false);
    const [micProducer, setMicProducer] = useState<Producer>();

    const [screensharing, setScreensharing] = useState(false);
    const [screenVideoProducer, setScreenVideoProducer] = useState<Producer>();

    const [callMembers, setCallMembers] = useState<[string, string][]>([]);
    const [videoTracks, setVideoTracks] = useState<ConsumerData[]>([]);

    useEffect(() => {
        console.log(callMembers, videoTracks);
    }, [callMembers, videoTracks]);

    const connectCall = async () => {
        setConnecting(true);
        const call = new Call("testing", token, setCallMembers, setVideoTracks);
        await call.connect();
        setCall(call);
        setConnecting(false);
        setConnected(true);
    };
    const produce = async () => {
        if (!screensharing) {
            // const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
            // await call?.produce(mic.getTracks()[0]);
            const vid = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const p = await call?.produce(vid.getTracks()[0]);
            setScreenVideoProducer(p?.[1]);
            setScreensharing(true);
        } else {
            screenVideoProducer?.close();
            setScreensharing(false);
        }
    };
    const hangUp = async () => {
        // console.log("hung up");
        await call?.hangUp();
        setConnected(false);
        setUnmuted(false);
        setMicProducer(void 0);
        setScreensharing(false);
        setScreenVideoProducer(void 0);
    };
    const toggleMute = async () => {
        if (!unmuted) {
            if (micProducer) {
                micProducer.resume();
            } else {
                const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
                const p = await call?.produce(mic.getTracks()[0]);
                setMicProducer(p?.[1]);
            }
            setUnmuted(true);
        } else {
            micProducer?.pause();
            setUnmuted(false);
        }
    };

    return (
        <div class="flex flex-col w-full py-4 border-b">
            <div class={`self-center text-sm space-x-3${connecting ? " text-yellow-400" : (connected ? " text-green-400" : " text-red-400")}`}>
                {connecting && <CallConnecting20Filled />}
                {connected && <CallCheckmark20Filled />}
                {(!connected && !connecting) && <CallEnd20Filled />}
                {connecting && "   Voice connecting..."}
                {connected && "   Voice connected!"}
                {(!connected && !connecting) && "   Voice disconnected!"}
            </div>
            <div id="video-list" class="w-3/4 self-center flex flex-wrap justify-center">
                {callMembers && callMembers.map(m => 
                    <div key={m[0]} class="user rounded-md bg-violet-400 w-1/3 m-2 p-4 border relative">
                        <br />
                        <div class="bottom-4 absolute text-white">{window.internals.userStore.get(m[1])?.username ?? "Unknown user"}</div>
                    </div>
                )}
                {/* <div class="user rounded-md bg-violet-400 w-1/3 m-2 p-4 border relative">
                    <div class="bottom-4 absolute text-white">Queryzi</div>
                </div> */}
                {/* <video class="w-1/3 m-2 rounded-md border" src="https://wave.video/embed/6309c55fa301f52bde2cb8a7/5fc50afc46e0fb000d238ef3.mp4" /> */}
                {videoTracks && videoTracks.map(t => <Video class="w-1/3 m-2 rounded-md border" srcObject={t.stream} key={t.consumerId} />)}
            </div>
            <audio id="audio" />
            <div class="self-center flex flex-wrap justify-center">
                <button onClick={connectCall} class={`rounded-md text-white px-4 m-2 tooltip h-20${(connected || connecting) ? " bg-gray-400" : " bg-violet-400"}`} disabled={connected || connecting}>
                    <Call24Filled /><p class="text-sm">Connect call</p>
                </button>
                <button onClick={produce} class={`rounded-md text-white px-4 m-2 tooltip h-20${(!connected) ? " bg-gray-400" : " bg-violet-400"}`} disabled={!connected}>
                    {screensharing ? <><ShareScreenStop24Filled /><p class="text-sm">Stop sharing</p></> : <><ShareScreenStart24Filled /><p class="text-sm">Share screen</p></>}
                </button>
                <button onClick={toggleMute} class={`rounded-md text-white px-4 m-2 tooltip h-20${(!connected) ? " bg-gray-400" : " bg-violet-400"}`} disabled={!connected}>
                    {unmuted ? <><Mic24Filled /><p class="text-sm">Mute</p></> : <><MicOff24Filled /><p class="text-sm">Unmute</p></>}
                </button>
                <button onClick={hangUp} class={`rounded-md text-white px-4 m-2 tooltip h-20${(!connected) ? " bg-gray-400" : " bg-violet-400"}`} disabled={!connected}><CallEnd20Filled /><p class="text-sm">Hang up</p></button>
                {/* <button onClick={consume} class="bg-green-400 rounded-md text-white p-4 m-2" disabled={!connected}>Watch screen</button> */}
            </div>
        </div>
    );
};

export default CallConnector;
 