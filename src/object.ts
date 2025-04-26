import type { Omit, StrKeys, ResolvedValue, AnyObj, Dict } from '.';

/** Maps over an object just as a [ ].map would on an array */
export function objMap<
    T, O extends {}
>(o: O, funct: (keyVal: { key: StrKeys<O>, val: O[StrKeys<O>] }) => T)
{
    const newObj = { } as { [P in StrKeys<O>]: T };

    for (const key in o) {
        newObj[key] = funct({ key, val: o[key] });
    }

    return newObj;
}

/** Filters out keys based on bool value returned by function */
export function objFilter<O extends {}>(
    o: O, funct: (keyVal: {
        key: StrKeys<O>,
        val: O[StrKeys<O>]
    }) => boolean
)
{
    const newObj = { ...o };

    for (const key in o) {
        if (!funct({ key, val: o[key] })) delete newObj[key];
    }

    return newObj as { [P in StrKeys<O>]?: O[P] };
}

/**
 * Removes all keys from object in the `filterOut` array.
 * The original object is not mutated.
 */
export function objRemoveKeys<
    T extends {}, K extends keyof T
>(obj: T, filterOut: K[])
{
    const newObj: T = { ...obj as any };
    filterOut.forEach((key) => delete newObj[key]);

    return newObj as Omit<T, K>;
}

export function objKeys<T extends {}>(o: T): StrKeys<T>[]
{
    if (Object.keys) return Object.keys(o) as StrKeys<T>[];

    const keys: StrKeys<T>[] = [];
    for (const k in o) keys.push(k);

    return keys;
}

export const objVals = <T = any>(o: { [key: string]: T }): T[] =>
    Object.values(o)

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
 * ```ts
 *  "first.second.stuff" => obj.first.second.stuff
 * ```
 */
export const objResolve = (o: AnyObj, path: string): any =>
    path.split('.').reduce((prev, key) => prev[key], o);

/**
 * Takes a dictionary/object made of Promises and Observables and
 * extracts all values. This function will return resolved values from all
 * Observable/Promise on the obj when all promises on object resolve.
 */
export function objPromiseAll<T extends Dict<Promise<any>>>(obj: T) {
    const keyValues = objKeyVals(obj);
    const toEqual = keyValues.length;
    const values = { } as { [P in keyof T]: ResolvedValue<T[P]> };

    let total = 0;
    return new Promise<typeof values>((resolve) =>
        keyValues.forEach(({ key, val: x }) => x!.then((data) => {
            values[key] = data;
            total++;

            if (toEqual === total) resolve(values);
        }))
    );
}
