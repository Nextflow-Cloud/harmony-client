import { CombinedState, combineReducers, legacy_createStore as createStore } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { Client, client, ClientAction } from "./client";
import { Preferences, preferences, PreferencesAction } from "./preferences";

export const all = combineReducers({
    client,
    preferences,
});

export type State = {
    client: Client,
    preferences: Preferences;
};

export type Action = ClientAction | PreferencesAction | { type: "INITIAL"; state: State };

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
