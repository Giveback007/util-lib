import type { AnyObj, Dict } from '.';
import {
    isType, nonValue, objRemoveKeys, objVals, equal
} from '.';

/** Generates an array of null values */
export const arrGen = <T = any>(length: number): T[] =>
    Array(length).fill(null);

/**
 * Returns a new array without mutating the provided one.
 *
 * @example
 * ```js
 * const arr = [{ id: '1' }, { id: '2' }]
 * arrRemoveById(arr, ['1'], 'id') //=> [{ id: '2' }]
 * ```
 */
export function arrRemoveById<
    T extends AnyObj
>(arr: T[], idArr: string[], idKey: keyof T = 'id')
{
    const objDict = arrToDict(arr, idKey);
    const keep: Dict<T> = objRemoveKeys(objDict, idArr);

    return objVals(keep);
}

/**
 * Gets values out of `arr` that match the ids in `idArr`
 *
 * @example
 * ```js
 * const arr = [{ id: '1' }, { id: '2' }, { id: '3' }]
 * arrGetByIds(arr, ['1', '2'], 'id')
 * //=> [{ id: '1' }, { id: '2' }]
 * ```
 */
export function arrGetByIds<
    T extends AnyObj
>(arr: T[], idArr: string[], idKey: keyof T = 'id') {
    const dict = arrToBoolDict(idArr);
    return arr.filter((x) => dict[x[idKey]]);
}

/**
 * Divides the array in to multiple arrays
 * arr.length/rowLength
 */
export function arrDivide<T>(
    arr: T[],
    maxRowLength: number
): T[][] {
    const rows = Math.ceil(arr.length / maxRowLength);
    const newArr = arrGen(rows).map(() => ([] as T[]));

    arr.forEach((x, i) =>
        newArr[Math.floor(i / maxRowLength)].push(x));

    return newArr;
}

/**
 * @example
 * ```js
 * arrFlatten([[[1, [1.1]], 2, 3], [4, 5]])
 * //=> [[1, [1.1]], 2, 3, 4, 5]
 * ```
 */
export function arrFlatten<T>(arr: T[][]): T[];
export function arrFlatten(arr: any[]): any[];
export function arrFlatten(arr: any[]): any[] {
    return [].concat.apply([], arr);
}

/**
 * @example
 * ```js
 * arrDeepFlatten([[[1, [1.1]], 2, 3], [4, 5]])
 * //=> [1, 1.1, 2, 3, 4, 5]
 * ```
 */
export const arrDeepFlatten = <T = any>(arr: any[]): T[] =>
    arr.reduce((newArr: any[], x) => newArr.concat(
        isType(x, 'array') ? arrDeepFlatten(x) : x), []);

export function arrReplace<T>(arr: T[])
{
    const newArr = [ ...arr ];
    return {
        all: (item: T) => {
            const idxs: number[] = [];
            arr.forEach((match, i) =>
                equal(item, match) ? idxs[i] = (i) : null);

            return {
                with: (newItem: T) => {
                    if (!idxs.length) return arr;

                    idxs.forEach((i) => newArr[i] = newItem);
                    return newArr;
                },
            };
        },
        first: (item: T) => {
            const idx = arr.findIndex(
                (match) => equal(item, match));

            return {
                with: (newItem: T) => {
                    if (nonValue(idx)) return arr;

                    newArr[idx] = newItem;
                    return newArr;
                },
            };
        },
    };
}

export function arrRemoveValues<T>(
    arr: T[],
    valsToRemove: any[]
) {
    let newArr = [ ...arr ];
    valsToRemove.forEach(removeVal =>
        newArr = newArr.filter(x => !equal(x, removeVal))
    );

    return newArr;
}

export function arrToDict<T extends AnyObj>(
    arr: T[],
    idKey: keyof T
) {
    const dict: Dict<T> = { };
    arr.forEach((obj) => dict[obj[idKey]] = obj);

    return dict;
}

export function arrToIdxDict(arr: (number | string)[])
{
    const dict: Dict<string> = { };
    arr.forEach((x, idx) => dict[x] = idx + '');

    return dict;
}

export function arrToBoolDict(arr: (string | number)[])
{
    const dict: Dict<boolean> = { };
    arr.forEach((x) => dict[x] = true);

    return dict;
}

/** Gets the last item from the array */
export const arrLast = <T>(arr: T[]) => arr[arr.length - 1];

/**
 * Checks if arr has a given value. If equivalent = true the
 * value will be checked if it has an 'equivalent', meaning it
 * has an object or array that is an equivalent "clone like".
 */
export function arrHas<T>(
    arr: T[], find: T, equivalent = false
) {
    const fct = equivalent ?
        (x: T) => equal(x, find) : (x: T) => x === find;

    return arr.findIndex(fct) !== -1;
}
