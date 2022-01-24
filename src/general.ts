// import * as fetchJsonp from 'fetch-jsonp';
import type { AnyObj, JsType } from '.';
import { isType, objMap, hasKey, clone } from '.';

/**
 * @example
 * ```js
 * interval((i) => console.log('The index is: ' + i), 1000, 2) =>
 * //=> 'The index is: 0' //=> 'The index is: 1'
 * ```
 */
export const interval = (
    funct: (i: number) => any,
    ms: number,
    times?: number
) => {
    if (isType(times, 'number') && times < 1)
        throw Error('argument "times" can\'t be less than 1');

    let i = 0;
    const intv = setInterval(() => {
        funct(i);
        i++;

        if (times && i >= times) clearInterval(intv);
    }, ms);

    return { stop: () => clearInterval(intv) };
}

/** A promise that waits `ms` amount of milliseconds to execute */
export const wait = (ms: number): Promise<void> =>
    new Promise((res) => setTimeout(() => res(), ms));

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

    throw Error(`value needs to be of type ${types.join(' || ')}`)
}

export const uiid = () =>
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

// export const jsonp = async <T = any>(
//     url: string,
//     options?: fetchJsonp.Options
// ) => (await fetchJsonp(url, options)).json<T>();

// // TODO: include async functions
// export function strToFnt(fStr: string) {
//     const x = fStr.slice(fStr.indexOf('('));
//     const start = x.slice(0, x.indexOf(')') + 1);
//     const end = x.slice(x.indexOf(')') + 1);

//     // tslint:disable-next-line: no-eval
//     return eval(start + ' =>' + end);
// }

export function debounceTimeOut() {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (fct: Function | 'cancel', ms?: number) => {
        if (timeoutId) clearTimeout(timeoutId);

        if (fct !== 'cancel')
            timeoutId = setTimeout(fct, ms || 0) as any;
    }
}

export function promiseOut<T = any>() {
    let resolve: any;
    const promise = new Promise((res) => resolve = res);
    return { resolve: resolve as (value: T) => void, promise };
}
