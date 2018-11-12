import { anyObj, type, isType } from ".";

export function Obj<
    O extends { [key: string]: V } | { [key: number]: V },
    V extends O[keyof O],
    K extends keyof O
>(o: O) {
    if (!isType(o, 'object')) {
        console.error(o, `typeOf ${type(o)}, can't be taken as a parameter`);
        throw "Parameter is not an 'object'"
    }

    let keys: (keyof O)[];
    let vals: (O[keyof O])[];
    let keyVals: { key: keyof O; val: O[keyof O]; }[];
    
    return {
        get keys() {
            if (!keys) keys = objKeys(o);
            return keys;
        },

        get keyVals() {
            if (!keyVals) keyVals = objKeyVals(o) as any;
            return keyVals;
        },

        get vals() {
            if (!vals) vals = objVals(o);
            return vals;
        },

        extract: (keys: K[]): { [P in K]: O[P]; } => objExtract(o, keys),

        removeKeys: (filterOut: K[]): { [L in Exclude<keyof O, K>]: O[L]; } => objRemoveKeys(o, filterOut),

        map: <T>(funct: (keyVal: { key: keyof O, val: O[keyof O] }) => T) => objMap(o, funct),

        resolveObj: (path: string): any => objResolve(o, path),
    };
};

/** Maps over an object just as a [].map would */
export function objMap<
    T, O extends {}
>(o: O, funct: (keyVal: { key: keyof O, val: O[keyof O] }) => T) {
    const newObj = {} as { [P in (keyof O)]: T };
    objKeyVals(o).forEach((keyVal) => newObj[keyVal.key] = funct(keyVal));

    return newObj;
}

/** Removes all keys from object in the `filterOut` array */
export function objRemoveKeys<T extends {}, K extends keyof T>(obj: T, filterOut: K[]) {
    const newObj: T = { ...obj as any };
    filterOut.forEach((key) => delete newObj[key]);

    return newObj as { [L in Exclude<keyof T, K>]: T[L] };
}

export function objKeys<T extends {}, K extends keyof T>(o: T): K[] {
    if (Object.keys) return Object.keys(o) as K[];

    const keys: K[] = [];
    for (let k in o) {
        keys.push(k as any);
    }
    
    return keys;
}
    
export const objVals = <T = any>(o: { [key: string]: T }): T[] => 
    Object.values ? Object.values(o) : objKeys(o).map((key) => o[key]);

export const objKeyVals = <T extends {}>(o: T) => objKeys(o).map((key) => ({ key, val: o[key] }));

/** Creates a new object from `extract` object and an array of `keys` to transfer */
export function objExtract<
    T extends {},
    K extends keyof T,
    U extends { [P in K]: T[P] }
>(extract: T, keys: K[]) {
    const newObj = { } as U;
    keys.forEach((key) => newObj[key] = extract[key]);

    return newObj;
}

/**
 * @param o the object that is to be resolved
 * @param path path to the desired value eg: "lvl1.stuff" => obj.lvl1.stuff
 */
export const objResolve = (o: anyObj, path: string) => path.split('.').reduce((prev, key) => prev[key], o);
