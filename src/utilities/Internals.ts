import { ExtendedWebSocket } from "./lib/lib";
import { client, intoObservable, preferences } from "./state";

class Internals {
    ExtendedWebSocket = ExtendedWebSocket;
    intoObservable = intoObservable;

    protected flags: Record<string, boolean> = {};

    applyFlag(k: string, v: boolean) {
        this.flags[k] = v;
    }

    fetchFlag(k: string) {
        return this.flags[k];
    }

    getState() {
        return { client, preferences };
    }
}

export default Internals;
