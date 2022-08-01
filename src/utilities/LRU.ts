class LRU<T> {
    constructor(private maxEntries = 20) {}
    private values: Map<string, T> = new Map<string, T>();
    public get(key: string): T | undefined {
        const hasKey = this.values.has(key);
        let entry: T | undefined;
        if (hasKey) {
            entry = this.values.get(key);
            this.values.delete(key);
            this.values.set(key, entry as T);
        }
        return entry;
    }
    public set(key: string, value: T) {
        if (this.values.size >= this.maxEntries) {
            const keyToDelete = this.values.keys().next().value;
            this.values.delete(keyToDelete);
        }
        this.values.set(key, value);
    }
}

export default LRU;
