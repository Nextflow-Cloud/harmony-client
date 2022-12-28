import { Client as SocketClient } from "../lib/Client";

export interface Client {
    client?: SocketClient;
}

export type ClientAction = { type: undefined } | { type: "SET_CLIENT", client: SocketClient };

export const client = (state: Client = {}, action: ClientAction): Client => {
    switch (action.type) {
        case "SET_CLIENT": {
            state.client = action.client;
            return state;
        }
        default: {
            return state;
        }
    }
};
