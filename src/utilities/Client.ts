import ExtendedWebSocket from "./ExtendedWebSocket";
import LRU from "./LRU";

class Client {
    // cache: LRU<Entity> = new LRU(100);
    socket?: ExtendedWebSocket;
    constructor(public authenticateServer: string, public apiSocket: string, protected token: string) {}

    async connect() {
        const request = await Promise.race([fetch(`${this.authenticateServer}/api/v1/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: this.token })
        }), new Promise(r => setTimeout(r, 5000))]);
        if (!(request instanceof Response)) throw new Error("Authentication server is not responding");
        if (request.status !== 200) throw new Error(`Authentication server responded with ${request.status}`);
        const response = await request.json();
        if (!response.success) throw new Error(`Authentication server responded with error: ${response.error}`);
        this.socket = new ExtendedWebSocket(this.apiSocket, this.token);
        await this.socket.connect();        
    }
    // protected get token(): string {
        // return window.internals.fetchFlag("token");
    // }
}

export default Client;
