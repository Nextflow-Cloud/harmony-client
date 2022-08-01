import { useState } from "preact/hooks";
import Video from "../components/Video";
import Call from "../utilities/Call";
import { Call24Filled, ShareScreenStart24Filled, CallCheckmark20Filled, CallEnd20Filled, CallConnecting20Filled, MicOff24Filled, MicOn24Filled } from "@fluentui/react-icons";
import "../tooltips.css";
import { Producer } from "mediasoup-client/lib/Producer";

const CallConnector = () => {
    const [call, setCall] = useState<Call>();
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [unmuted, setUnmuted] = useState(false);
    const [micProducer, setMicProducer] = useState<Producer>();
    const connectCall = async () => {
        setConnecting(true);
        const call = new Call("aaaauser", "aaaauser");
        await call.connect();
        setCall(call);
        setConnecting(false);
        setConnected(true);
    };
    const produce = async () => {
        // const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        // await call?.produce(mic.getTracks()[0]);
        const vid = await navigator.mediaDevices.getDisplayMedia({ video: true });
        await call?.produce(vid.getTracks()[0]);
    };
    const hangUp = async () => {

    };
    const toggleMute = async () => {
        if (!unmuted) {
            const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
            const p = await call?.produce(mic.getTracks()[0]);
            setUnmuted(true);
            setMicProducer(p);
        } else {
            micProducer?.close();
            setUnmuted(false);
        }
    };
    return (
        <div>
            <div class={"text-sm space-x-3" + (connecting ? " text-yellow-400" : (connected ? " text-green-400" : " text-red-400"))}>
                {connecting && <CallConnecting20Filled />}
                {connected && <CallCheckmark20Filled />}
                {(!connected && !connecting) && <CallEnd20Filled />}
                {connecting && "   Voice connecting..."}
                {connected && "   Voice connected!"}
                {(!connected && !connecting) && "   Voice disconnected!"}
            </div>
            <div id="video-list w-3/4">
                {/* {call && call.consumeTracks.map(t => <Video srcObject={t} key={t.id} />)} */}
            </div>
            <audio id="audio" />
            <button onClick={connectCall} class={"rounded-md text-white px-4 m-2 tooltip h-20" + ((connected || connecting) ? " bg-gray-400" : " bg-violet-400")} disabled={connected || connecting}><Call24Filled /><p class="text-sm">Connect call</p></button>
            <button onClick={produce} class={"rounded-md text-white px-4 m-2 tooltip h-20" + ((!connected) ? " bg-gray-400" : " bg-violet-400")} disabled={!connected}><ShareScreenStart24Filled /><p class="text-sm">Share screen</p></button>
            <button onClick={toggleMute} class={"rounded-md text-white px-4 m-2 tooltip h-20" + ((!connected) ? " bg-gray-400" : " bg-violet-400")} disabled={!connected}>
                {unmuted ? <><MicOn24Filled/><p class="text-sm">Mute</p></> : <><MicOff24Filled /><p class="text-sm">Unmute</p></>}
            </button>
            <button onClick={hangUp} class={"rounded-md text-white px-4 m-2 tooltip h-20" + ((!connected) ? " bg-gray-400" : " bg-violet-400")} disabled={!connected}><CallEnd20Filled /><p class="text-sm">Hang up</p></button>

            {/* <button onClick={consume} class="bg-green-400 rounded-md text-white p-4 m-2" disabled={!connected}>Watch screen</button> */}
        
        </div>
    );
};

export default CallConnector;
 