import { render } from "preact";
import App from "./app";
import "./index.css";

import Internals from "./utilities/Internals";
const internals = new Internals();

Object.defineProperty(window, "internals", {
    value: internals,
    writable: false,
    configurable: false
});

render(<App />, document.getElementById("app") as HTMLElement);
