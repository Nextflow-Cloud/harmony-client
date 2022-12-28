import { shallowEqual } from "react-redux";
import { useAppSelector } from "../utilities/redux/redux";

const useClient = () => {
    const client = useAppSelector(state => state.client.client, shallowEqual);
    return client;
};

export default useClient;
