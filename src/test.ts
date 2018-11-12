import { JsType, JsTypeFind, type, objVals, TestParams, objKeys } from ".";

const testsInit = (val: any) => ({
    objOrArr: (bool: boolean) => isObjOrArr(val) === bool,
    hesKey: (key: string) => hasKey(val, key),
    isType: (tesType: JsType) => isType(val, tesType),
    nonValue: (bool: boolean) => nonValue(val) === bool,
    nullOrEmpty: (bool: boolean) => nullOrEmpty(val) === bool,
});

/** Must pass all tests to to return true */
export function test(params: TestParams) {
    const testsKeys = objKeys(params);

    return (val) => {
        const tests = testsInit(val);

        for (let t in testsKeys)
            if (tests[t](params[t])) return false;

        return true;
    }
}

/** Checks if object has the key, made as a function for type transfer */
export const hasKey = <
    K extends (string | number)
>(obj: any, key: K): obj is { [P in K]: any } => isType(obj, 'object') && key in obj;

/**
 * The function will test if the type of the first
 * argument equals testType. Argument testType is a string
 * representing a javascript type.
 * 
 * @param val value to be tested
 * @param testType to check if typeof val === testType
 */
export const isType = <
    T extends JsType
> (val: any, testType: T): val is JsTypeFind<T> => type(val) === testType;

/** `
     * (val 'is' {} || val 'is' []) */
export const isObjOrArr = (val: any): val is ({} | any[]) => val && typeof val === 'object';

/** `
    * value 'is' (null || undefined || '' || [ ] || { }) */
export function nullOrEmpty(x: any): boolean {
    // null || undefined
    if (nonValue(x)) return true;

    // (string || array).length === 0
    if (isType(x, 'string') || isType(x, 'array')) return !x.length;

    // object // { key: 'val' } => false, { } => true
    if (isType(x, 'object')) return !objVals(x).length;

    return false;
}

/** `
    * val 'is' (null || undefined) */
export const nonValue = (val): val is (null | undefined) => val === null || val === undefined;
