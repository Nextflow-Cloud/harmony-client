import ExtendedWebSocket from "../ExtendedWebSocket";

export interface Socket {
    socket?: ExtendedWebSocket
}

export type SocketAction = { type: undefined } | { type: "SET_SOCKET", socket: ExtendedWebSocket };

export const socket = (state: Socket = {}, action: SocketAction): Socket => {
    switch (action.type) {
        case "SET_SOCKET": {
            state.socket = action.socket;
            return state;
        }
        default: {
            return state;
        }
    }
};
