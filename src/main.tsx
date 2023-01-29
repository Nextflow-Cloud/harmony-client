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

const warn = () => console.error("%cAttention!\n%cPasting arbitrary code here could allow your authentication token and therefore your account to be stolen by a malicious attacker. This type of attack is called Self-XSS. Please make sure you know what you are doing. Do not execute code that you do not understand.\n%cThis is not an error and is intended behaviour. Learn more at https://nextflow.cloud/developers/self-xss", "font-size: 48px; color: red;", "font-size: 24px; color: black;", "font-size: 18px;");

setTimeout(() => warn(), 10000);

setInterval(() => {
    // Warn the user about Self-XSS
    warn();
}, 120000);


render(<App />, document.getElementById("app") as HTMLElement);
