import { ExtendedWebSocket } from "./lib/lib";
import { store } from "./redux/redux";

class Internals {
    ExtendedWebSocket = ExtendedWebSocket;
    protected flags: Record<string, boolean> = {};

    applyFlag(k: string, v: boolean) {
        this.flags[k] = v;
    }

    fetchFlag(k: string) {
        return this.flags[k];
    }

    getState() {
        return store.getState();
    }
}

export default Internals;
