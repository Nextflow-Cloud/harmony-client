import ExtendedWebSocket, { WebSocketCodes } from "./ExtendedWebSocket";
import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { TransportOptions } from "mediasoup-client/lib/Transport";
import { ConsumerOptions } from "mediasoup-client/lib/Consumer";

class Call {
    socket: ExtendedWebSocket;
    id: string;
    device: Device;
    consumeTrackIds: Record<string, number> = {};
    consumeTracks: MediaStream[] = [];
    constructor(id: string, token: string) {
        this.id = id;
        this.device = new Device();
        // Dev server
        // this.socket = new ExtendedWebSocket("ws://192.168.0.101:8000", token, { reconnect: true }); //http://localhost:10002 ws://localhost:9050
        // Production server
        this.socket = new ExtendedWebSocket("wss://link1.nextflow.cloud", token, { reconnect: true }); //rtc.nextflow.cloud
        this.socket.on("message", m => {
            if (m.type === WebSocketCodes.NEW_PRODUCER) {
                const p = (m.data as Record<string, unknown>).producer as { id: string; kind: "audio" | "video"; };
                this.onNewProducer(p.id, p.kind);
            }
        });
        Object.assign(window, {
            device: this.device,
            socket: this.socket,
            call: this,
        });
        
    }
    protected async onNewProducer(id: string, type: "audio" | "video") {
        const transportData = await this.socket.request({ type: WebSocketCodes.TRANSPORT, data: { id: this.id } });
        const transportOptions = (transportData.data as Record<string, unknown>).transport as TransportOptions;
        const transport = this.device.createRecvTransport(transportOptions);
        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
            this.socket.request({ type: WebSocketCodes.DTLS, data: { dtlsParameters, transportId: transportOptions.id, id: this.id } })
                .then(() => callback())
                .catch(e => errback(e));
        });
        const consumerData = await this.socket.request({ type: WebSocketCodes.CONSUME, data: { rtpCapabilities: this.device.rtpCapabilities, producerId: id, id: this.id, transportId: (transportData.data!.transport as { id: string; }).id } });
        const consumer = await transport.consume((consumerData.data as Record<string, unknown>).consumer as ConsumerOptions);
        await this.socket.request({ type: WebSocketCodes.RESUME, data: { id: this.id, consumerId: consumer.id } });
        const stream = new MediaStream([consumer.track]);
        this.consumeTracks.push(stream);
        this.consumeTrackIds[consumer.id] = this.consumeTracks.length - 1;
        console.log(type)
        if (type === "audio") {
            const audio = document.getElementById("audio") as HTMLAudioElement;
            if (!audio.srcObject)
                audio.srcObject = stream;
            else 
                (audio.srcObject as MediaStream).addTrack(consumer.track);
            await audio.play();
        } else {
            const videoList = document.getElementById("video-list") as HTMLDivElement;
            const video = document.createElement("video");
            console.log(stream)
            video.srcObject = stream;
            video.playsInline = true;
            video.autoplay = true;
            videoList.appendChild(video);
            await video.play();
        }
    }
    async connect() {
        await this.socket.connect();
        const rtpCapabilities = await this.socket.request({ type: WebSocketCodes.CAPABILITIES, data: { id: this.id } });
        await this.device.load({ routerRtpCapabilities: (rtpCapabilities.data as Record<string, unknown>).rtpCapabilities as RtpCapabilities });
    }
    async produce(track: MediaStreamTrack) {
        const transportData = await this.socket.request({ type: WebSocketCodes.TRANSPORT, data: { id: this.id, produce: true } });
        const transportOptions = (transportData.data as Record<string, unknown>).transport as TransportOptions;
        const transport = this.device.createSendTransport(transportOptions);
        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
            this.socket.request({ type: WebSocketCodes.DTLS, data: { dtlsParameters, id: this.id, transportId: transportOptions.id } })
                .then(() => callback())
                .catch(e => errback(e));
        });
        transport.on("produce", (parameters, callback, errback) => {
            this.socket.request({ type: WebSocketCodes.PRODUCE, data: { parameters, id: this.id, transportId: transportOptions.id } })
                .then(data => callback(data.data!.producer as { id: string; }))
                .catch(e => errback(e));
        });
        const producer = await transport.produce({ track, encodings: [{ maxBitrate: 1000000 }] });
        return producer;
    }

}

export default Call;