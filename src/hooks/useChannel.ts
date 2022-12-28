import { useParams } from "react-router-dom";
import useClient from "./useClient";

const useChannel = () => {
    const { channel } = useParams();
    const client = useClient();

    return channel ? client?.channels.get(channel) : client?.channels.get("1");
};

export default useChannel;
