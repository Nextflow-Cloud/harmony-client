import { Interweave } from "interweave";

const StyleParser = ({ raw, showModalDialog, hideModalDialog }: { 
    raw: string,
    showModalDialog: (title: string, message: string, buttons: { text: string; id: string; primary?: boolean }[], callback: (button: string) => void) => void,
    hideModalDialog: () => void,
}) => {
    const handleLink = (e: MouseEvent, url?: string) => {
        e.preventDefault();
        if (url) {
            if (new URL(url).host.endsWith("nextflow.cloud")) {
                open(url, "_blank");
                return;
            }
            showModalDialog(
                "Attention", 
                "You are about to visit an external webpage. Please be cautious for deceptive or malicious links. Proceed to suspicious links only if you know what you are doing. Are you sure you would like to continue?", 
                [{
                    text: "Yes, continue",
                    id: "yes",
                    primary: true
                }, {
                    text: "No, go back",
                    id: "no"
                }], 
                button => {
                    if (button === "yes") {
                        open(url, "_blank");
                    }
                    hideModalDialog();
                }
            );
        }
    };
    const transform = (node: HTMLElement, children: Node[]) => {
        if (node.tagName === "A") {
            return <a href={node.getAttribute("href") ?? undefined} target="_blank" style={{
                color: "#5995ed",
            }} onClick={e => handleLink(e, node.getAttribute("href") ?? undefined)}>{children}</a>;
        }
    }

    const parse = (raw: string): string => {
        raw = raw
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        
        const bold = (match: string, s: string) => typeof s === "number" ? "" : `<b>${s}</b>`;
        const boldRegex = /\*\*(.*?)\*\*/gs;
        const italic = (match: string, s: string) => typeof s === "number" ? "" : `<i>${s}</i>`;
        const italicRegex = /\*(.*?)\*/gs;
        const code = (match: string, s: string) => typeof s === "number" ? "" : `<code class="bg-gray-700">${s}</code>`;
        const codeRegex = /`(.*?)`/gs;
        const underline = (match: string, s: string) => typeof s === "number" ? "" : `<u>${s}</u>`;
        const underlineRegex = /__(.*?)__/gs;
        const strikethrough = (match: string, s: string) => typeof s === "number" ? "" : `<s>${s}</s>`;
        const strikethroughRegex = /~~(.*?)~~/gs;
        const multilineCode = (match: string, s: string) => typeof s === "number" ? "" : `<pre>${s}</pre>`;
        const multilineCodeRegex = /```(.*?)```/gs;
        const emphasis = (match: string, s: string) => typeof s === "number" ? "" : `<em>${s}</em>`;
        const emphasisRegex = /_(.*?)_/gs;
        const spoiler = (match: string, s: string) => typeof s === "number" ? "" : `<span class="spoiler">${s}</span>`;
        const spoilerRegex = /\|\|(.*?)\|\|/gs;

        const link = (match: string, s: string) => typeof s === "number" ? "" : `<a href="${encodeURI(s)}">${s}</a>`;
        const linkRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/g;

        raw = raw.replace(boldRegex, bold);
        raw = raw.replace(italicRegex, italic);
        raw = raw.replace(codeRegex, code);
        raw = raw.replace(underlineRegex, underline);
        raw = raw.replace(strikethroughRegex, strikethrough);
        raw = raw.replace(multilineCodeRegex, multilineCode);
        raw = raw.replace(emphasisRegex, emphasis);
        raw = raw.replace(spoilerRegex, spoiler);
        raw = raw.replace(linkRegex, link);

        raw = raw.replaceAll("\n", "<br />");

        return raw;
    };

    return (
        <>
            <Interweave content={parse(raw)} transform={transform} />
        </>
    );

};

export default StyleParser;
