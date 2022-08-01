/// <reference types="vite/client" />

import Internals from "./utilities/Internals";

declare global {
    interface Window {
        internals: Internals;
    }
}
