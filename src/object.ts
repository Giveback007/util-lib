import { anyObj } from '.';
import { Omit, sKeys } from './@types';

/** Maps over an object just as a [].map would */
export function objMap<
    T, O extends {}
>(o: O, funct: (keyVal: { key: sKeys<O>, val: O[sKeys<O>] }) => T)
{
    const newObj = {} as { [P in sKeys<O>]: T };

    for (const key in o) {
        newObj[key] = funct({ key, val: o[key] });
    }

    return newObj;
}

/** Filters out keys based on bool value returned by function */
export function objFilter<O extends {}>(
    o: O, funct: (keyVal: { key: sKeys<O>, val: O[sKeys<O>] }) => boolean
) 
{
    const newObj = { ...o as any } as { [P in sKeys<O>]?: O[P] };

    for (const key in o) {
        if (!funct({ key, val: o[key] })) delete newObj[key];
    }

    return newObj;
}

/** Removes all keys from object in the `filterOut` array */
export function objRemoveKeys<T extends {}, K extends keyof T>(
    obj: T, filterOut: K[]
) 
{
    const newObj: T = { ...obj as any };
    filterOut.forEach((key) => delete newObj[key]);

    return newObj as Omit<T, K>;
}

export function objKeys<T extends {}>(o: T): sKeys<T>[] 
{
    if (Object.keys) return Object.keys(o) as sKeys<T>[];

    const keys: sKeys<T>[] = [];
    for (const k in o) keys.push(k);

    return keys;
}

export const objVals = <T = any>(o: { [key: string]: T }): T[] =>
    Object.values ? Object.values(o) : objKeys(o).map((key) => o[key]);

export const objKeyVals = <T extends {}>(o: T) =>
    objKeys(o).map((key) => ({ key, val: o[key] }));

/**
 * Creates a new object from `extract` object and an array of `keys` to
 * transfer
 */
export function objExtract<
    T extends {},
    K extends keyof T,
    U extends { [P in K]: T[P] }
>(extract: T, keys: K[]): U 
{
    const newObj = { } as U;
    keys.forEach((key) => (newObj[key] as any as T[K]) = extract[key]);

    return newObj;
}

/**
 * @param o the object that is to be resolved
 * @param path path to the desired value eg:
 *  "first.second.stuff" => obj.first.second.stuff
 */
export const objResolve = (o: anyObj, path: string) =>
    path.split('.').reduce((prev, key) => prev[key], o);
