import { render } from "preact";
import App from "./app";
import "./index.css";
import "./sidebar.css"

import Internals from "./utilities/Internals";
const internals = new Internals();

Object.defineProperty(window, "internals", {
    value: internals,
    writable: false,
    configurable: false
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById("app")!);
