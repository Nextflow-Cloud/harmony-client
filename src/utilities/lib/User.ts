interface UserData {
    id: string;
    username: string;
    avatar: string;
}

class User {
    id: string;
    username: string;
    avatar: string;
    constructor(data: UserData) {
        this.id = data.id;
        this.username = data.username;
        this.avatar = data.avatar;
    }
}

export { User };
