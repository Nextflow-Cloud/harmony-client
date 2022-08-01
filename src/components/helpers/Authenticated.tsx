import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) return match[2];
    return null;
};

const Authenticate = (props: { children: ComponentChildren; }) => {
    const [timedOut, setTimedOut] = useState(false);
    const [failed, setFailed] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const checkToken = async () => {
        if (getCookie("token") !== null) {
            const token = getCookie("token");
            const request = await Promise.race([fetch("https://secure.nextflow.cloud/api/validate", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({ token })
            }), new Promise(r => setTimeout(r, 5000))]);
            if (!(request instanceof Response)) setTimedOut(true);
            else if (!request.ok) setFailed(true);
            else setSucceeded(true);
        } else {
            setFailed(true);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);
    if (failed) {
        location.href = `https://secure.nextflow.cloud/?continue=${encodeURIComponent(location.href)}`;
        return <></>;
    } 
    return (
        <>
            {timedOut && <div>Warning: SSO authentication server timed out. Check service status <a href="https://status.nextflow.cloud">here</a>.</div>}
            {succeeded && props.children}
        </>
    );
    
};

export default Authenticate;
