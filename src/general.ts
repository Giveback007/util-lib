import { JsType } from ".";

/** A promise that waits n amount of milliseconds to execute */
export const wait = (ms: number) => new Promise(res => setTimeout(() => res(), ms));

/**
 * An alternative to console.log in that it will clone the obj.
 * 
 * Useful for when need to see the object in a specific state instance.
 * */
export const cloneLog = (x) => window.console.log(clone(x));

/** Creates a copy of the object trough JSON stringify and parse */
export const clone = <T>(obj: T) => JSON.parse(JSON.stringify(obj));

/** An improved version of native `typeof` */
export function type(val: any): JsType {
    if (typeof val === 'object') {
        if (Array.isArray(val)) return 'array';
        else if (val === null)  return 'null';
        else                    return 'object';
    } else {
        if (val !== val)        return 'NaN';
        else                    return typeof val;
    }
}

export const viewSize = () => ({ width: window.innerWidth, height: window.innerHeight });
