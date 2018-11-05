import { genDictionary, removeObjKeys, objVals, typeOf } from ".";
import { dictionary } from "./@types";

/**
 * @param idArr Array of ids to remove. Eg: ['1']
 * @param idKey Key to the obj id prop. Eg: 'id'
 * @param objArr Array of objects. Eg: [{ id: '1' }, { id: '2' }]
 *
 * => [{ id: '2' }]
 * Removes objects from array by obj[idKey]: 'stringId'
 */
export function arrRemoveById<T extends {}>(objArr: T[], idArr: string[], idKey: string) {
    const objDict = genDictionary(objArr, idKey);
    const keep: dictionary<T> = removeObjKeys(objDict, idArr);

    return objVals(keep);
}

/** Generates an array of null values */
export const arrGen = <T = any>(length: number): T[] => Array(length).fill(null);

/** Divides the array in to multiple arrays arr.length/rowLength */
export function arrDivide<T>(arr: T[], maxRowLength: number): T[][] {
    const rows = Math.ceil(arr.length / maxRowLength);
    const newArr = arrGen(rows).map(() => []);

    arr.forEach((x, i) => newArr[Math.floor(i / maxRowLength)].push(x));

    return newArr;
}

/** [[[1, [1.1]], 2, 3], [4, 5]] => [[1, [1.1]], 2, 3, 4, 5] */
export const arrFlatten = (arr: any[]): any[] => [].concat.apply([], arr);

/** [[[1, [1.1]], 2, 3], [4, 5]] => [1, 1.1, 2, 3, 4, 5] */
export const arrDeepFlatten = (arr: any[]): any[] =>
    arr.reduce((newArr: any[], x) => newArr.concat(typeOf(x, 'array') ? arrDeepFlatten(x) : x), []);
