import {
  dictionary, Optional, objKeyVals,
  uiid, wait, objVals, equal
} from '.';
import { objExtract } from './object';

type lsOptions<P> = {
  id: string, useKeys?: P[], ignoreKeys?: P[]
};

const LS_KEY = '-utilStateManager';

const stateFromLS = (id: string) => {
  const strState = localStorage.getItem(id);
  if (!strState) return { };

  return JSON.parse(strState);
}

export class StateManager<
  State, Key extends keyof State = keyof State
> {
  /**
   * emittedState is used to check if an emit is
   * necessary it is not the same as prevState.
   */
  private emittedState: State = {} as State;
  private prevState: State = {} as State;
  private state: State = {} as State;

  private readonly useLS:
    lsOptions<Key> | false = false;

  private subscriptions: dictionary<
    (s: State, prev: State) => any
  > = { };

  /**
   * The local storage takes an id, this id
   * should be unique in order to ensure that the
   * storage is unique to the given state object
   */
  constructor(
    initialState: State,
    useLocalStorage?: lsOptions<Key>
  ) {
    let state = { } as State;

    if (useLocalStorage) {
      const {
        useKeys, ignoreKeys, id
      } = useLocalStorage;

      if (useKeys && ignoreKeys) throw Error(
        '\'useKeys\' & \'ignoreKeys\' are'
        + ' mutually exclusive, only use one'
        + ' or the other.'
      );

      this.useLS = useLocalStorage;
      const lsId = this.useLS.id = id + LS_KEY;

      state = {
        ...initialState,
        ...stateFromLS(lsId)
      };

      addEventListener('storage', (e) => {
        if (e.key !== lsId) return;

        let fromLS = stateFromLS(lsId);

        if (useKeys)
          fromLS = objExtract(fromLS, useKeys)
        if (ignoreKeys) ignoreKeys
          .forEach((key) => delete fromLS[key])

        const lsState = {
          ...this.state,
          ...fromLS
        };

        if (equal(this.state, lsState)) return;

        this.setState(fromLS);
      });
    } else state = initialState;

    this.setState(state);
  }

  getState = () => this.state;

  setState = (
    updateState: Optional<State>
  ): State => {
    const newState = { ...this.state };

    objKeyVals(updateState).forEach((o) =>
      newState[o.key] = o.val as any);

    this.prevState = this.state;
    this.state = newState;
    this.stateChanged();

    return newState;
  }

  /**
   * Will execute the given function on state
   * change, can subscribe to a particular key
   * in the state
   */
  // -- //
  subscribe(
    funct: (s: State, prev: State) => any
  ): { unsubscribe: () => boolean; }
  // -- //
  subscribe<K extends Key = Key>(
    funct: (s: State[K], prev: State[K]) => any,
    key: K
  ): { unsubscribe: () => boolean; }
  // -- //
  subscribe<K extends Key = Key>(
    funct:
      ((s: State[K], prev: State[K]) => any)
      |
      ((s: State, prev: State) => any),
    key?: K
  ) {
    const id = uiid();
    let f: (s: State, prev: State) => any;

    if (key) {
      f = (s: State, prev: State) => {
        // ensuring the function only fires only
        // on a state change on a given key
        if (equal(
          this.emittedState[key],
          this.state[key]
        )) return;

        funct(
          (s as any)[key],
          (prev as any)[key]
        );
      }
    } else f = funct as any;

    this.subscriptions[id] = f;

    return {
      unsubscribe: () =>
        delete this.subscriptions[id]
    };
  }

  private stateChanged = async () => {
    // makes sure to run only after all sync
    // code updates the state
    await wait(0);

    if (equal(
      this.emittedState,
      this.state
    )) return;

    this.updateLocalStorage();
    this.stateEmit();

    this.emittedState = this.state;
  }

  private stateEmit = () =>
    objVals(this.subscriptions).forEach((f) =>
      f(this.state, this.prevState));

  private updateLocalStorage = () => {
    if (!this.useLS) return;

    const {
      id,
      ignoreKeys,
      useKeys
    } = this.useLS;

    let state: State = { ...this.state };

    if (ignoreKeys) ignoreKeys
      .forEach((key) => delete state[key]);
    else if (useKeys)
      state = objExtract(state, useKeys);

    localStorage
      .setItem(id, JSON.stringify(state));
  }
}
