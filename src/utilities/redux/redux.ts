import { CombinedState, combineReducers, legacy_createStore as createStore } from "redux";

import { Users, users, UsersAction } from "./users";

export const all = combineReducers({
    users
});

export type State = {
    users: Users;
};

export type Action = UsersAction | { type: "INITIAL"; state: State };

export const store = createStore((state: CombinedState<State> | undefined, action: Action) => {
    if (import.meta.env.DEV) {
        console.debug("State Update:", action);
    }

    if (action.type === "INITIAL") {
        return action.state;
    }

    return all(state, action);
});
