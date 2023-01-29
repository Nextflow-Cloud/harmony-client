import { useEffect } from "preact/hooks";
import Loading from "../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";

const Authenticate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        let token = searchParams.get("token");
        if (token) {
            localStorage.setItem("token", token);
            const next = searchParams.get("next");
            if (next) navigate(new URL(next).pathname);
            else navigate("/app");
        } else {
            const url = new URL("http://sso.nextflow.local/login");
            const current = new URL("http://chat.nextflow.local/authenticate");
            current.searchParams.set(
                "next",
                searchParams.get("next") ?? "https://chat.nextflow.cloud/app",
            );
            url.searchParams.set("continue", current.toString());

            location.href = url.toString();
        }
    }, []);

    return (
        <>
            <Loading />
        </>
    );
};

export default Authenticate;
