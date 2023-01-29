import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

const Authenticate = (props: { children: ComponentChildren }) => {
    const [timedOut, setTimedOut] = useState(false);
    const [failed, setFailed] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (token !== null) {
            const request = await Promise.race([
                fetch("http://sso.nextflow.local/api/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: token ?? "" }),
                }),
                new Promise((r) => setTimeout(r, 5000)),
            ]);
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
        const url = new URL("http://chat.nextflow.local/authenticate");
        url.searchParams.set("next", location.href);
        location.href = `http://sso.nextflow.local/login?continue=${encodeURIComponent(
            url.toString(),
        )}`;
        return <></>;
    }
    return (
        <>
            {timedOut && (
                <div>
                    Error: The authentication server timed out. Check service
                    status <a href="https://status.nextflow.cloud">here</a>. If
                    services are fully operational, please consult your network
                    administrator.
                </div>
            )}
            {succeeded && props.children}
        </>
    );
};

export default Authenticate;
