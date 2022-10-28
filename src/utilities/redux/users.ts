export interface User {
    id: string;
    username: string;
    avatar: string;
}

export interface Users {
    [key: string]: User;
}

export type UsersAction = { type: undefined } | { type: "LOAD_USER", user: User };

export const users = (state: Users = {}, action: UsersAction): Users => {
    switch (action.type) {
        case "LOAD_USER": {
            state[action.user.id] = action.user;
            return state;
        }
        default: {
            return state;
        }
    }
};
