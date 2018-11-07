import { objVals, JsType, JsTypeFind } from ".";

/** A promise that waits n amount of milliseconds to execute */
export const wait = (ms: number) => new Promise(res => setTimeout(() => res(), ms));

/** Iterates n times over a function */
export const iterate = (num: number) => ({
    for: (funct: (i: number) => any) => {
        for (let i = 0; i < num; i++) { funct(i) };
    },
    map: <T>(funct: (i: number) => T) => {
        const arr: T[] = [];
        for (let i = 0; i < num; i++) { arr.push(funct(i)) };
        return arr;
    }
});

/** Fast check for {} || [] types */
export const isObjOrArr = (val: any): val is ({} | any[]) => val && typeof val === 'object';

/** An improved version of native `typeof` */
export function getType(val: any): JsType {
    if (typeof val === 'object') {
        if (Array.isArray(val)) return 'array';
        else if (val === null)  return 'null';
        else                    return 'object';
    } else {
        if (val !== val)        return 'NaN';
        else                    return typeof val;
    }
}

/**
 * The function will test if the type of the first
 * argument equals testType. Argument testType is a string
 * representing a javascript type.
 * 
 * @param val value to be tested
 * @param testType to check if typeof val === testType
 */
export const typeOf = <T extends JsType> (val: any, testType: T): val is JsTypeFind<T> => getType(val) === testType;

/** if value is ( null || undefined ) */
export const nonValue = (val): val is (null | undefined) => val === null || val === undefined;

/** if value is ( null || undefined || '' || [ ] || { } ) */
export function nullOrEmpty(x: any): boolean {
    // null || undefined
    if (nonValue(x)) return true;

    // (string || array).length === 0
    if (typeOf(x, 'string') || typeOf(x, 'array')) return !x.length;

    // object // { key: 'val' } => false, { } => true
    if (typeOf(x, 'object')) return !objVals(x).length;

    return false;
}

// /** recursively goes over all nested values in an object and array */
// export const recurse = (obj: {} | any[]) => ({
//     for: (funct: (key: string) => any) => {
//         for (let val of (obj as any)) {
//             funct(val);
//             if (isObjOrArr(val))
//                 recurse(val).for(funct)
//         }
//     }
// })
