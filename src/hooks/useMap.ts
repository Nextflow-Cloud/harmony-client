import { useMemo, useState } from "preact/hooks";

const useMap = (initialValue: Iterable<readonly [unknown, unknown]> | null | undefined) => {
    const [map, setMap] = useState(new Map(initialValue));
  
    const actions = useMemo(
        () => ({
            set: (key: unknown, value: unknown) =>
                setMap(prevMap => {
                    const nextMap = new Map(prevMap);
                    nextMap.set(key, value);
                    return nextMap;
                }),
            delete: (key: unknown) =>
                setMap(prevMap => {
                    const nextMap = new Map(prevMap);
                    nextMap.delete(key);
                    return nextMap;
                }),
            clear: () => setMap(new Map()),
        }),
        [setMap]
    );
    return [map, actions];
};

export default useMap;