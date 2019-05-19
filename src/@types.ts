export type anyObj = { [key: string]: any };

export type dictionary<T> = { [id: string]: T };

/** string type keyof T */
export type sKeys<T> = Extract<keyof T, string>;

export type omit<T, K> = Pick<T, Exclude<keyof T, K>>;

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

export interface TestParams {
    hesKey?: string;
    isType?: JsType;
    /** `
     * true  -> (val 'is' type 'object' || val 'is' type 'array')
     * false -> (val 'is_not' type 'object' && val 'is_not' type 'array')
     */
    objOrArr?: boolean;
    /** `
     * true  -> val 'is' (null || undefined)
     * false -> val 'is_not' (null || undefined)
     */
    nonValue?: boolean;
    /** `
     * true  -> value 'is' (null || undefined || '' || [ ] || { })
     * false -> value 'is not' (null || undefined || '' || [ ] || { })
     */
    nullOrEmpty?: boolean;
}
