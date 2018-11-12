import { 
    objRemoveKeys, objVals, isType, nonValue, type, dictionary, anyObj
} from ".";

export function Arr<T>(a: T[]) {
    if (!isType(a, 'array')) {
        console.error(a, `typeOf ${type(a)}, can't be taken as a parameter`);
        throw "Parameter is not an 'array'"
    }

    return {
        get replace() { return arrReplace(a) },
        removeById: (idKey: string, idArr: string[]) => arrRemoveById(a, idKey, idArr),
        divide: (maxRowLength: number) => arrDivide(a, maxRowLength),
        flatten: <U = any>({ deep } = { deep: true }): U[] => deep ? arrDeepFlatten(a) : arrFlatten(a),
        dictionary: (idKey) => arrToDictionary(a, idKey),
    }
}

/** Generates an array of null values */
export const arrGen = <T = any>(length: number): T[] => Array(length).fill(null);

export function arrToIdxDictionary(arr: (number | string)[]) {
    const dictionary: dictionary<string> = { };
    arr.forEach((x, idx) => dictionary[x] = idx + '');

    return dictionary;
}

/**
 * @param idArr Array of ids to remove. Eg: ['1']
 * @param idKey Key to the obj id prop. Eg: 'id'
 * @param arr Array of objects. Eg: [{ id: '1' }, { id: '2' }]
 *
 * => [{ id: '2' }]
 * Removes objects from array by obj[idKey]: 'stringId'
 */
export function arrRemoveById<T extends {}>(arr: T[], idKey: string, idArr: string[]) {
    const objDict = arrToDictionary(arr, idKey);
    const keep: dictionary<T> = objRemoveKeys(objDict, idArr);

    return objVals(keep);
}

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
    arr.reduce((newArr: any[], x) => newArr.concat(isType(x, 'array') ? arrDeepFlatten(x) : x), []);

export function arrReplace<T>(arr: T[]) {
    const newArr = [ ...arr ];
    return {
        first: (item: T) => {
            const idx = arr.findIndex((match) => item === match);
            return {
                with: (newItem: T) => {
                    if (nonValue(idx)) return arr;
                    
                    newArr[idx] = newItem;
                    return newArr;
                }
            }
        },
        all: (item: T) => {
            const idxs: number[] = [];
            arr.forEach((match, i) => item === match ? idxs.push(i) : null);

            return {
                with: (newItem: T) => {
                    if (!idxs.length) return arr;

                    idxs.forEach(i => newArr[i] = item);
                    return newArr;
                }
            }
        }
    };
}

export function arrToDictionary<T extends anyObj>(arr: T[], idKey: string) {
    const dictionary: dictionary<T> = { };
    arr.forEach((obj) => dictionary[obj[idKey]] = obj);

    return dictionary;
}
