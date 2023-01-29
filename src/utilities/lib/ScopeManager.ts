import { LRU } from "./helpers/LRU";
import Scope from "./Scope";

class ScopeManager {
    cache: LRU<Scope>;

    constructor() {
        this.cache = new LRU(5);
    }
}

export default ScopeManager;
