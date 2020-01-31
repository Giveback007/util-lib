import {
    dictionary, Optional, objKeyVals,
    uiid, wait, objVals, objKeys,
    strRemove, equal
} from '.';

// local storage feature
//  * 'state.key'
//  * update local storage if object is new on key
// subscribe to individual keys
// ensure that code only fires after all sync code ran

const LS_KEY = '-utilStateManager.';

const stateFromLocalStorage = (lsId: string) => {
    const stateFromLS: any = { };

    const lsKeys = objKeys(localStorage);

    lsKeys.forEach((lsKey) => {
        if (lsKey.indexOf(lsId) !== 0) return;

        const item  = localStorage.getItem(lsKey);
        const objKey = strRemove(lsKey, lsId);
        stateFromLS[objKey] = item ? JSON.parse(item) : item;
    })

    return stateFromLS;
}

export class StateManager<
    State,
    Key extends keyof State = keyof State
> {
    // oldState is used to check if an emit is necessary
    private oldState: State = {} as State;
    private state: State = {} as State;

    private readonly useLocalStorage: boolean = false;
    private readonly lsId: string = '';

    private subscriptions: dictionary<(s: State) => any> = { };

    /**
     * The local storage takes an id, this id should be unique
     * in order to ensure that the storage is unique to the given state object
     */
    constructor(initialState: State, useLocalStorage?: { id: string }) {
        let state = {} as State;

        if (useLocalStorage) {
            this.useLocalStorage = true;
            this.lsId = useLocalStorage.id + LS_KEY;
            state = { ...initialState, ...stateFromLocalStorage(this.lsId) };

            addEventListener('storage', (e: StorageEvent) => {
                if (e.type !== 'storage') return;

                const stateFromLS = stateFromLocalStorage(this.lsId);
                if (equal(this.state, stateFromLS)) return;

                if (!e.key || !e.newValue)
                    throw Error(`key: ${e.key}; newValue: ${e.newValue}`);

                const objKey = strRemove(e.key, this.lsId);
                const update: any = { [objKey]: JSON.parse(e.newValue) };
                this.setState(update);

            });
        } else {
            state = initialState;
        }

        this.setState(state);
    }

    getState = () => this.state;

    setState = (updateState: Optional<State>): State => {
        const newState = { ...this.state };
        objKeyVals(updateState).forEach(({ key, val }) => newState[key] = val as any);

        this.state = newState;
        this.stateChanged();

        return newState;
    }

    /** Will execute the given function on state change, can subscribe to a particular key in the state */
    subscribe(funct: (s: State) => any): { unsubscribe: () => boolean; }
    subscribe<K extends Key = Key>(funct: (s: State[K]) => any, key: K): { unsubscribe: () => boolean; }
    subscribe<K extends Key = Key>(funct: ((s: State[K]) => any) | ((s: State) => any), key?: K) {
        const id = uiid();
        let f: (s: State) => any;

        if (key) {
            f = (s: State) => {
                // ensuring the function only fires only on a state change on a given key
                if (equal(this.oldState[key], this.state[key])) return;

                funct((s as any)[key]);
            }
        } else {
            f = funct as any;
        }

        this.subscriptions[id] = f;

        return {
            unsubscribe: () => delete this.subscriptions[id],
        }
    }

    private stateChanged = async () => {
        // makes sure to run only after all sync code updates the state
        await wait(0);

        if (equal(this.oldState, this.state)) return;

        this.updateLocalStorage();
        this.stateEmit();

        this.oldState = this.state;
    }

    private stateEmit = () =>
        objVals(this.subscriptions).forEach((f) => f(this.state));

    private updateLocalStorage = () => {
        if (!this.useLocalStorage) return;

        const id = this.lsId;
        objKeyVals(this.state).forEach(({ key, val }) => {
            if (equal(this.oldState[key], this.state[key])) return;

            localStorage.setItem(id + key, JSON.stringify(val));
        });
    }
}
