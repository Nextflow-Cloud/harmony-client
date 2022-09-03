import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

const getCookie = (name: string) => document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2];

const Authenticate = (props: { children: ComponentChildren; }) => {
    const [timedOut, setTimedOut] = useState(false);
    const [failed, setFailed] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const checkToken = async () => {
        if (getCookie("token") !== null) {
            const token = getCookie("token");
            const request = await Promise.race([fetch("https://sso.nextflow.cloud/api/validate", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({ token: token ?? "" })
            }), new Promise(r => setTimeout(r, 5000))]);
            if (!(request instanceof Response)) return setTimedOut(true);
            if (!request.ok) return setFailed(true);
            await (request as Response).json().catch(() => setFailed(true));
            setSucceeded(true);
        } else {
            setFailed(true);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    if (failed) {
        location.href = `https://sso.nextflow.cloud/login?continue=${encodeURIComponent(location.href)}`;
        return <></>;
    } 
    return (
        <>
            {timedOut && <div>Error: The authentication server timed out. Check service status <a href="https://status.nextflow.cloud">here</a>. If services are fully operational, please consult your network administrator.</div>}
            {succeeded && props.children}
        </>
    );
    
};

export default Authenticate;
