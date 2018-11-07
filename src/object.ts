import { anyObj, dictionary } from ".";

/** Checks if object has the key, made as a function for type transfer */
export const hasKey = <K extends string>(obj: any, key: K): obj is { [P in K]: any } => key in obj;

export const objKeys = <T extends {}, K extends keyof T>(obj: T): K[] => Object.keys(obj) as any;

export const objVals = <T = any>(obj: { [key: string]: T }): T[] => objKeys(obj).map((key) => obj[key]);

export function genDictionary<T extends anyObj>(arr: T[], idKey: string) {
    const dictionary: dictionary<T> = { };
    arr.forEach((obj) => dictionary[obj[idKey]] = obj);

    return dictionary;
}

export function genIdxDictionary(arr: (number | string)[]) {
    const dictionary: dictionary<string> = { };
    arr.forEach((x, idx) => dictionary[x] = idx + '');

    return dictionary;
}

/** Removes all keys from object in the `filterOut` array */
export function removeObjKeys(obj: anyObj, filterOut: string[]): anyObj {
    const newObj = { ...obj };
    filterOut.forEach((key) => delete newObj[key]);

    return newObj;
}

/** Creates a new object from `extract` object and an array of `keys` to transfer */
export function objExtract<
    T extends object,
    K extends keyof T,
    U extends { [P in K]: T[P] }
>(extract: T, keys: K[]) {
    const newObj = { } as U;
    keys.forEach((key) => newObj[key] = extract[key]);

    return newObj;
}

/**
 * @param obj the object that is to be resolved
 * @param path path to the desired value eg: "lvl1.stuff" => obj.lvl1.stuff
 */
export const resolveObj = (obj: anyObj, path: string) =>
    path.split('.').reduce((prev, key) => prev[key], obj);
