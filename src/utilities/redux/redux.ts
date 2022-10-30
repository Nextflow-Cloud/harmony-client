import { CombinedState, combineReducers, legacy_createStore as createStore } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { Preferences, preferences, PreferencesAction } from "./preferences";
import { Socket, socket, SocketAction } from "./socket";
import { Users, users, UsersAction } from "./users";

export const all = combineReducers({
    preferences,
    socket,
    users,
});

export type State = {
    preferences: Preferences;
    socket: Socket;
    users: Users;
};

export type Action = PreferencesAction | SocketAction | UsersAction | { type: "INITIAL"; state: State };

export const store = createStore((state: CombinedState<State> | undefined, action: Action) => {
    if (import.meta.env.DEV) {
        console.debug("State Update:", action);
    }

    if (action.type === "INITIAL") {
        return action.state;
    }

    return all(state, action);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
