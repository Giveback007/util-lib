import type { AnyFnc, AnyObj, Dict, JsType, num, str } from '.';
import { isType, objMap, hasKey, clone } from '.';

/**
 * @example
 * ```js
 * interval((i) => console.log('idx: ' + i), 1000, 2))
 * // (log =>) "idx: 0"
 * // (log =>) "idx: 1"
 * // only ran twice because maxTimes was set to: `2` (third parameter)
 *
 * interval((i, stop) => i === 10 && stop());
 * // when i is 10 will stop the interval
 * ```
 */
export const interval = (
    func: (i: number, stop: () => void) => any,
    ms: number = 0,

    /** n times to run the interval */
    maxTimes: number = Infinity
) => {
    maxTimes = Math.floor(maxTimes);
    if (maxTimes < 1) return { stop: () => void(0) };

    let i = 0;

    const stop = () => clearInterval(itv);
    const itv = setInterval(() => {
        func(i, stop);
        i++;

        if (maxTimes && i >= maxTimes) stop();
    }, ms);

    return {
        /** Stop the interval */
        stop
    };
}

const usubAllFunct = (x: any, unsubName = 'unsubscribe') =>
    isType(x, 'object')
    &&
    hasKey(x, unsubName) ? x[unsubName]() : null;

export function unsubAll(objOrArr: AnyObj | any[], unsubName = 'unsubscribe') {
    if (isType(objOrArr, 'array'))
        objOrArr.forEach(x => usubAllFunct(x, unsubName));
    else if (isType(objOrArr, 'object'))
        objMap(objOrArr, ({ val }) => usubAllFunct(val, unsubName));
    else
        throw Error('argument "objOrArr" must be of type "object" or "array"');
}

/**
 * Alternative to console.log in that it will clone the obj.
 *
 * Useful for when it is need to see the object in a specific
 * state instance.
 */
export const cloneLog = (x: any) => console.log(clone(x));

/** An improved version of native `typeof` */
export function type(val: any): JsType
{
    if (typeof val === 'object') {
        if (Array.isArray(val)) return 'array';
        else if (val === null)  return 'null';
        else                    return 'object';
    } else {
        if (val !== val)        return 'NaN';
        else                    return typeof val;
    }
}

// https://httptoolkit.tech/blog/5-big-features-of-typescript-3.7#assert-signatures
export function assertType<T extends JsType>(
    val: any,
    types: T | T[]
): asserts val is T {
    if (!isType(types, 'array')) types = [types];
    for (const t of types) if (isType(val, t)) return;

    throw Error(`value needs to be of type: ${types.join(' || ')}`)
}

export const uuid = () =>
{
    let d = new Date().getTime();
    let d2 = (
        performance
        &&
        performance.now
        &&
        (performance.now() * 1000)
    ) || 0;

    const str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return str.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }

        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const randomColorHex = () =>
    '#' + ((1<<24)*Math.random() | 0).toString(16);

export const debounce = (fn: AnyFnc, ms: num) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

export function debounceTimeOut() {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (fct: Function | 'cancel', ms?: number) => {
        if (timeoutId) clearTimeout(timeoutId);

        if (fct !== 'cancel')
            timeoutId = setTimeout(fct, ms || 0) as any;
    }
}

export const debounceById = (() => {
    const debounceDict: Dict<num> = {};
    return (fn: AnyFnc, ms: num, id: str | num) => {
        const dId = debounceDict[id];
        if (dId) clearTimeout(dId);

        debounceDict[id] = setTimeout(fn, ms) as any;
    }
})();

export function promiseOut<T = any>() {
    let resolve: any;
    let error: any;

    const promise: Promise<T> = new Promise((res, err) => {
        resolve = res;
        error = err;
    });

    return {
        error: error as (reason?: any) => void,
        resolve: resolve as (value: T) => void,
        promise,
    };
}

export async function concurrentTasks<T, Res = any>(
    arr: T[],
    fn: (x: T, idx: number) => Promise<Res> | Res,
    nOfConcurrentTasks = 8
): Promise<Res[]> {
    let idx = -1;
    const result: Res[] = [];

    await Promise.all(Array(nOfConcurrentTasks).fill(0).map(async () => {
        let data: T | undefined;
        while (data = arr[++idx]) {
            const i = idx;
            result[i] = await fn(data, idx)
        }
    }));

    return result;
}

export function hash(str: string) {
    let hash = 0n;
    for (let i = 0; i < str.length; i++)
        hash = (hash * 31n + BigInt(str.charCodeAt(i))) & 0xFFFFFFFFFFFFFFFFn;

    return hash.toString(36);
}