import { dictionary, Optional, objKeyVals, uiid } from '.';
import { wait } from './general';
import { objVals, objKeys } from './object';

// local storage feature
//  * 'state.key'
//  * update local storage if object is new on key
// subscribe to individual keys
// ensure that code only fires after all sync code ran

const LS_KEY = '-utilStateManager.';

export class StateManager<
    S,
    Key extends keyof S = keyof S
> {
    private readonly toLocalStorage: boolean = false;
    private readonly localStorageId: string = '';

    // oldState is used to check if an emit is necessary
    private oldState: S = {} as S;
    private state: S;
    private subscriptions: dictionary<(s: S) => any> = { };

    /**
     * The local storage takes an id, this id should be unique
     * in order to ensure that the storage is unique to the given state object
     */
    constructor(initialState: S | 'local-storage', toLocalStorage?: { id: string }) {
        this.state = initialState === 'local-storage' ? this.fromLocalStorage() : initialState;

        if (toLocalStorage) {
            this.toLocalStorage = true;
            this.localStorageId = toLocalStorage.id + LS_KEY;
            this.updateLocalStorage();
        }

        this.stateEmit();
    }

    getState = <K extends Key | undefined>(key?: K): K extends Key ? S[K] : S =>
        (key ? this.state[key as keyof S] : this.state) as any

    // { [k in Key]?: S[k] }
    setState = (updateState: Optional<S>): S => {
        const newState = { ...this.state };
        objKeyVals(updateState).forEach(({ key, val }) => newState[key] = val as any);

        this.state = newState;

        // these two should be in this order
        // this ensures that LS can utilize the
        // oldState comparison before .stateEmit()
        // updates it
        this.updateLocalStorage();
        this.stateEmit();

        return newState;
    }

    /** Will execute the given function on state change, can subscribe to a particular key in the state */
    subscribe = <K extends Key | undefined>(funct: (s: K extends Key ? S[K] : S) => any, key?: K) => {
        const id = uiid();
        let f: (s: S) => any;

        if (key) {
            f = (s: S) => {
                // ensuring the function only fires only on a state change on a given key
                if (
                    this.oldState[key as keyof S]
                    ===
                    this.state[key as keyof S]
                ) return;

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

    fromLocalStorage = (): S => {
        const stateFromLS: any = { };

        const lsKeys = objKeys(localStorage)
            .filter((key) => key.indexOf(LS_KEY) === 0);

        lsKeys.forEach((key) => {
            const item  = localStorage.getItem(key);

            stateFromLS[key] = item ? JSON.parse(item) : undefined;
        })

        return stateFromLS;
    }

    private stateEmit = async () => {
        // by waiting to emit this allows all state changes to be made in sync
        // only then emitting to the subscriptions the new state change
        await wait(0);

        objVals(this.subscriptions).forEach((f) => f(this.state));
        this.oldState = this.state;
    }

    private updateLocalStorage = async () => {
        // to allow updating
        if (!this.toLocalStorage) return;

        // wait for all sync code to update the state object
        // only updating LS once per sync code cycle
        await wait(0);

        const id = this.localStorageId;

        objKeyVals(this.state).forEach(({ key, val }) => {
            if (this.oldState[key] === this.state[key]) return;

            localStorage.setItem(id + key, JSON.stringify(val))
        });
    }

    // allows for syncing states across browser windows
    // private onLocalStorageChange


}
