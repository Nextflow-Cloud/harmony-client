import ExtendedWebSocket from "./ExtendedWebSocket";

interface User {
    id: string;
    username: string;
    avatar: string;
}

class Internals {
    ExtendedWebSocket = ExtendedWebSocket;
    protected flags: Record<string, boolean> = {};
    // protected store: Record<string, Map<string>> = {};
    public userStore: Map<string, User> = new Map();

    applyFlag(k: string, v: boolean) {
        this.flags[k] = v;
    }

    fetchFlag(k: string) {
        return this.flags[k];
    }
}

export default Internals;
