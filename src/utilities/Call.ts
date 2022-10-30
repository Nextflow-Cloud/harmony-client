import ExtendedWebSocket, { WebSocketCodes } from "./ExtendedWebSocket";
import { Device } from "mediasoup-client";
import { MediaKind, RtpCapabilities, RtpParameters } from "mediasoup-client/lib/RtpParameters";
import { IceCandidate, Transport, TransportOptions } from "mediasoup-client/lib/Transport";
import { ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { StateUpdater } from "preact/hooks";

interface ConsumerData {
    consumerId: string;
    uniqueId: string;
    userId: string;
    stream: MediaStream;
}

export type { ConsumerData };

class Call {
    socket: ExtendedWebSocket;
    id: string;
    device: Device;
    audioTracks: ConsumerData[] = [];
    videoTracks: ConsumerData[] = [];
    callMembers: Map<string, string> = new Map();
    memberStateUpdater: StateUpdater<[string, string][]>;
    videoListStateUpdater: StateUpdater<ConsumerData[]>;
    constructor(id: string, socket: ExtendedWebSocket, memberStateUpdater: StateUpdater<[string, string][]>, videoListStateUpdater: StateUpdater<ConsumerData[]>) {
        this.id = id;
        this.device = new Device();
        this.socket = socket;
        this.socket.on("message", m => {
            if (m.type === WebSocketCodes.NEW_PRODUCER) {
                const p = (m.data as Record<string, unknown>).producer as { id: string; kind: "audio" | "video"; };
                this.onNewProducer(p.id, p.kind);
            }
            else if (m.type === WebSocketCodes.CALL_MEMBER_JOINED) {
                const d = m.data as { userId: string; uniqueId: string; };
                this.callMembers.set(d.uniqueId, d.userId);
                this.memberStateUpdater(Array.from(this.callMembers.entries()));
            }
            else if (m.type === WebSocketCodes.CALL_MEMBER_LEFT) {
                const d = m.data as { userId: string; uniqueId: string; };
                this.callMembers.delete(d.uniqueId);
                this.memberStateUpdater(Array.from(this.callMembers.entries()));
                for (const track of this.audioTracks.filter(v => v.uniqueId === d.uniqueId)) {
                    const audio = document.getElementById("audio") as HTMLAudioElement;
                    (audio.srcObject as MediaStream).removeTrack(track.stream.getTracks()[0]);
                }
                this.audioTracks = this.audioTracks.filter(v => v.uniqueId !== d.uniqueId);
                this.videoTracks = this.videoTracks.filter(v => v.uniqueId !== d.uniqueId);
                this.videoListStateUpdater(this.videoTracks);
            }
        });
        this.memberStateUpdater = memberStateUpdater;
        this.videoListStateUpdater = videoListStateUpdater;
        Object.assign(window, {
            device: this.device,
            callSocket: this.socket,
            call: this,
        });
        
    }
    protected async onNewProducer(id: string, type: "audio" | "video") {
        const transportData = (await this.socket.request({ type: WebSocketCodes.TRANSPORT, data: { channel_id: this.id, producer: false } })).data!;
        (transportData.ice_candidates as any) = (transportData.ice_candidates as any).map((c: { ip: any; }) => {
            c.ip = c.ip.V4.join(".");
            return c;
        });
        const transportOptions = {
            dtlsParameters: transportData.dtls_parameters,
            iceCandidates: transportData.ice_candidates,
            iceParameters: transportData.ice_parameters,
            sctpParameters: transportData.sctp_parameters,
            id: transportData.id
        } as TransportOptions;
        const transport = this.device.createRecvTransport(transportOptions);
        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
            this.socket.request({ type: WebSocketCodes.DTLS, data: { dtls_parameters: dtlsParameters, transport_id: transportOptions.id, channel_id: this.id } })
                .then(() => callback())
                .catch(e => errback(e));
        });
        const consumerData = (await this.socket.request({ type: WebSocketCodes.CONSUME, data: { 
            rtp_capabilities: this.device.rtpCapabilities, 
            producer_id: id, 
            channel_id: this.id, 
            transport_id: transportOptions.id 
        } })).data as {
            // consumer: ConsumerOptions;
            // user_id: string;
            // unique_id: string;
            id: string;
            kind: MediaKind;
            rtp_parameters: RtpParameters;
            producer_id: string;
            producer_paused: boolean;
        };
        const consumer = await transport.consume({
            rtpParameters: consumerData.rtp_parameters,
            id: consumerData.id,
            kind: consumerData.kind,
            producerId: consumerData.producer_id
        });
        await this.socket.request({ type: WebSocketCodes.RESUME, data: { channel_id: this.id, consumer_id: consumer.id } });
        const stream = new MediaStream([consumer.track]);
        console.log(`Received new stream of type ${type}`);
        if (type === "audio") {
            this.audioTracks.push({
                consumerId: consumer.id,
                stream,
                userId: "consumerData.user_id",
                uniqueId: "consumerData.unique_id"
            });
            const audio = document.getElementById("audio") as HTMLAudioElement;
            if (!audio.srcObject)
                audio.srcObject = stream;
            else 
                (audio.srcObject as MediaStream).addTrack(consumer.track);
            await audio.play();
        } else {
            this.videoTracks.push({
                consumerId: consumer.id,
                stream,
                userId:" consumerData.user_id",
                uniqueId:" consumerData.unique_id"
            });
            this.videoListStateUpdater(this.videoTracks);
            // const videoList = document.getElementById("video-list") as HTMLDivElement;
            // const video = document.createElement("video");
            // // console.log(stream)
            // video.srcObject = stream;
            // video.playsInline = true;
            // video.autoplay = true;
            // videoList.appendChild(video);
            // await video.play();
        }
    }
    async connect() {
        const joinCall = (await this.socket.request({ type: WebSocketCodes.CAPABILITIES, data: { channel_id: this.id } })).data as { 
            rtp_capabilities: RtpCapabilities; 
            call_members: { user_id: string; unique_id: string; producers: { id: string; kind: MediaKind; rtp_parameters: RtpParameters }[] }[]; 
        };
        this.callMembers = new Map(joinCall.call_members.map(m => [m.unique_id, m.user_id]));
        this.memberStateUpdater(Array.from(this.callMembers.entries()));
        await this.device.load({ routerRtpCapabilities: joinCall.rtp_capabilities as RtpCapabilities });
        joinCall.call_members.forEach(m => {
            m.producers.forEach(p => {
                this.onNewProducer(p.id, p.kind);
            });
        });
    }
    async produce(track: MediaStreamTrack): Promise<[Transport, Producer]> {
        const transportRequest = await this.socket.request({ type: WebSocketCodes.TRANSPORT, data: { channel_id: this.id, producer: true } })
        const transportData = transportRequest.data as Record<string, unknown>;
        (transportData.ice_candidates as any) = (transportData.ice_candidates as any).map((c: { ip: any; }) => {
            c.ip = c.ip.V4.join(".");
            return c;
        });
        const transportOptions = {
            dtlsParameters: transportData.dtls_parameters,
            iceCandidates: transportData.ice_candidates,
            iceParameters: transportData.ice_parameters,
            sctpParameters: transportData.sctp_parameters,
            id: transportData.id
        } as TransportOptions;
        const transport = this.device.createSendTransport(transportOptions);
        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
            this.socket.request({ type: WebSocketCodes.DTLS, data: { dtls_parameters: dtlsParameters, channel_id: this.id, transport_id: transportOptions.id } })
                .then(() => callback())
                .catch(e => errback(e));
        });
        transport.on("produce", (parameters, callback, errback) => {
            this.socket.request({ type: WebSocketCodes.PRODUCE, data: { kind: parameters.kind, rtp_parameters: parameters.rtpParameters, channel_id: this.id, transport_id: transportOptions.id } })
                .then(data => callback(data.data as { id: string; }))
                .catch(e => errback(e));
        });
        const producer = await transport.produce({ track, encodings: [{ maxBitrate: 1000000 }] });
        return [transport, producer];
    }
    async hangUp() {
        await this.socket.request({ type: WebSocketCodes.LEAVE_CALL, data: { channel_id: this.id } });
        this.audioTracks = [];
        this.videoTracks = [];
        this.callMembers = new Map();

        this.memberStateUpdater([]);
        this.videoListStateUpdater([]);
    }

}

export default Call;