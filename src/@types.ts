export type AnyObj = { [key: string]: any };

/** string type keyof T */
export type StrKeys<T> = Extract<keyof T, string>;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Optional<
    T, K extends keyof T = keyof T
> = { [P in K]?: T[P] };

export type ResolvedValue<T> =
    T extends Promise <infer U> ? U : any;

export type JsType =
    | 'array'
    | 'bigint'
    | 'boolean'
    | 'function'
    | 'NaN'
    | 'null'
    | 'number'
    | 'object'
    | 'string'
    | 'symbol'
    | 'undefined';

export type JsTypeFind<S extends JsType> =
    S extends 'array'       ? any[] :
    S extends 'bigint'      ? bigint :
    S extends 'boolean'     ? boolean :
    S extends 'function'    ? Function :
    S extends 'NaN'         ? number :
    S extends 'null'        ? null :
    S extends 'number'      ? number :
    S extends 'object'      ? object :
    S extends 'string'      ? string :
    S extends 'symbol'      ? symbol :
    S extends 'undefined'   ? undefined : never;

export type MsTime = {
    /** second */
    s: 1000;
    /** minute */
    m: 60000;
    /** hour */
    h: 3600000;
    /** day */
    d: 86400000;
    /** week */
    w: 604800000;
}

/**
 * ```ts
 * const o = {
 *  k1: true,
 *  k2: 'string',
 *  k3: false
 * }
 *
 * type Y = KeysOfValueType<typeof o, boolean>
 * type Y => "k1" | "k3"
 * ```
 */
 export type KeysOfValueType<O, T> = {
    [I in keyof O]: O[I] extends T ? I : never
}[keyof O];

 export type AwaitReturn<
    T extends AnyFnc<any | Promise<any>>
> = Awaited<ReturnType<T>>;

export type num = number;
export type str = string;
export type bol = boolean;

export type AnyFnc<T = any> = (...args: any[]) => T;

export type DayOfWeek =
    | 'Sun'
    | 'Mon'
    | 'Tue'
    | 'Wed'
    | 'Thu'
    | 'Fri'
    | 'Sat';

export type TimeObj = {
    y:      num;
    m:      num;
    d:      num;
    h:      num;
    min:    num;
    sec:    num;
    ms:     num;
    wDay:   DayOfWeek;
};

export type TimeArr = [
    y: num,
    m?: num,
    d?: num,
    h?: num,
    min?: num,
    sec?: num,
    ms?: num
];

export type AnyDate = string | number | Date | TimeObj | TimeArr;

export type Dict<T> = { [id: string]: T };

export type GeoPoint = {
    lon: number;
    lat: number;
}