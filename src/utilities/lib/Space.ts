import { Client } from "./Client";

export interface SpaceData {
    id: string;
    name: string;
    description: string;
}

class Space {
    client: Client;
    id: string;
    name: string;
    description: string;
    constructor(client: Client, data: SpaceData) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }
}

export default Space;
