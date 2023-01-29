import { FunctionComponent, RenderableProps } from "preact";
import { useEffect, useState } from "preact/hooks";

export type ObservableObject<T> = {
    [v in keyof T]: T[v];
} & Observable;

export class ObservableObjectInternal<T extends object> implements Observable {
    private _object: T;
    private _listeners: (() => void)[] = [];
    constructor(object: T) {
        this._object = object;
    }

    observe(handler: () => void) {
        this._listeners.push(handler);
    }
    unobserve(handler: () => void) {
        this._listeners = this._listeners.filter((l) => l !== handler);
    }

    static create<T extends object>(object: T) {
        const observable = new this(object);

        return new Proxy(observable, {
            set: (obj, prop, value) => {
                if (
                    ["observe", "unobserve", "_listeners", "_object"].includes(
                        prop as string,
                    )
                ) {
                    (obj as unknown as { [key: string | symbol]: unknown })[
                        prop
                    ] = value;
                    return true;
                }
                (obj._object as { [key: string | symbol]: unknown })[prop] =
                    value;
                obj._listeners.forEach((l) => l());
                return true;
            },
            get: (obj, prop) => {
                if (
                    !["observe", "unobserve", "_listeners", "_object"].includes(
                        prop as string,
                    )
                )
                    return (obj._object as { [key: string | symbol]: unknown })[
                        prop
                    ];
                return (obj as unknown as { [key: string | symbol]: unknown })[
                    prop
                ];
            },
        });
    }
}

interface Observable {
    observe: (handler: () => void) => void;
    unobserve: (handler: () => void) => void;
}

export class ObservableMap<K, V> extends Map<K, V> implements Observable {
    private _listeners: (() => void)[] = [];
    clear(): void {
        this._listeners.forEach((l) => l());
        super.clear();
    }

    delete(key: K): boolean {
        let result = super.delete(key);
        if (result) {
            this._listeners.forEach((l) => l());
        }
        return result;
    }

    set(key: K, value: V): this {
        super.set(key, value);
        this._listeners.forEach((l) => l());
        return this;
    }

    observe(listener: () => void) {
        this._listeners.push(listener);
    }

    unobserve(listener: () => void) {
        this._listeners = this._listeners.filter((l) => l !== listener);
    }
}

export const intoObservable = <T extends object>(
    object: T,
): ObservableObject<T> => {
    return ObservableObjectInternal.create(
        object,
    ) as unknown as ObservableObject<T>;
};

export const observe = <T = {}>(
    f: FunctionComponent<T>,
    store?: Observable | Observable[],
) => {
    return (props: RenderableProps<T>) => {
        const [_, setState] = useState(0);
        useEffect(() => {
            const handler = () => setState(Math.random());
            if (Array.isArray(store)) {
                store.forEach((s) => s.observe(handler));
                return () => store.forEach((s) => s.unobserve(handler));
            } else {
                store?.observe(handler);
                return () => store?.unobserve(handler);
            }
        }, [store]);
        return f(props);
    };
};

export const observeHook = <X, Y>(
    h: (...args: X[]) => Y,
    store?: Observable,
) => {
    return (...args: X[]) => {
        const [_, setState] = useState(0);
        useEffect(() => {
            const handler = () => setState(Math.random());
            store?.observe(handler);
            return () => store?.unobserve(handler);
        }, [store]);
        return h(...args);
    };
};
