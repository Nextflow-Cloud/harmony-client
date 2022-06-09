interface User {
    id: string;
    username: string;
    avatar: string;
}

interface Core {
    encode: (data: Uint8Array) => Uint8Array;
    decode: (data: Uint8Array) => Uint8Array;
}

class Internals {
    constructor() {
        const flags = localStorage.getItem("flags") ?? "";
        try {
            this.flags = JSON.parse(flags);
        } catch {
            localStorage.setItem("flags", JSON.stringify({}));
        }
    }
    protected flags: Record<string, boolean> = {};
    // store: Record<string, unknown>
    // userStore: Record<string, User>

    applyFlag(k: string, v: boolean) {
        this.flags[k] = v;
    }

    fetchFlag(k: string) {
        return this.flags[k];
    }
    
    async loadModules() {
        const response = await fetch("core.wasm");
        const module = await WebAssembly.instantiateStreaming(response, );
        return module.instance.exports as unknown as Core;
    }
}

export default Internals;
