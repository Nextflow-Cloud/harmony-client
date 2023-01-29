import { client, observeHook } from "../utilities/state";

const useClient = observeHook(() => client.client, client);

export default useClient;
