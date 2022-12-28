import { Client } from "./Client";

export interface SpaceData {
    id: string;
    description: string;
}

class Space {
    client: Client;
    id: string;
    description: string;
    constructor(client: Client, data: SpaceData) {
        this.client = client;
        this.id = data.id;
        this.description = data.description;
    }
}

export default Space;
