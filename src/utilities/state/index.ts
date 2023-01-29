import { intoObservable, ObservableObject } from "./state";

import { Client } from "../lib/Client";

// interface ClientDataStores {

// }

interface ObservableClient {
    client: Client;
}

export interface Preferences {
    theme: "light" | "dark";
    language: "en" | "es" | "fr";
    themeSystem: boolean;
    languageSystem: boolean;
}

export * from "./state";

// wss://test.nextflow.cloud/api/rpc
// Production server
// wss://link1.nextflow.cloud
export const client: ObservableObject<ObservableClient> = intoObservable({
    client: new Client("ws://chat-api.nextflow.local"),
});
export const preferences: ObservableObject<Preferences> = intoObservable({
    theme: matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    language: "fr",
    themeSystem: true,
    languageSystem: true,
});

Object.defineProperty(window, "clientStore", {
    value: client,
});
