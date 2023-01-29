import { useParams } from "react-router-dom";
import { Channel } from "../utilities/lib/Channel";
import useClient from "./useClient";

const useChannel = () => {
    const { channel } = useParams();
    const client = useClient();

    // FIXME: remove this
    return channel ? client.channels.get(channel) : client.channels.get("1") as Channel;
};

export default useChannel;
