import { arrDivide } from './array';

type x = { x: number };
type xy = { x: number, y: number };
type xyz = { x: number, y: number, z: number };

/**
 * Iterate over a function like nested for loops
 * each cycle would return an object eg:
 *
 * xLength 3, yLength: 3, zLength: 3
 * ```ts
 * { 0, 0, 0 } ... { 0, 0, 1 } ... { 0, 0, 2 }
 *
 * { 0, 1, 0 } ... { 0, 1, 1 } ... { 0, 1, 2 }
 * ```
 * ...
 * ```ts
 * { 2, 2, 0 } ... { 2, 2, 1 } ... { 2, 2, 2 } <- last object
 * ```
 * Starting index is 0
 */
export function iterate(xLength: number): {
    for: (fct: ({ x }: x) => any) => void;
    map: <T>(fct: ({ x }: x) => T) => T[];
    nestedMap: <T>(fct: ({ x }: x) => T) => T[];
};

export function iterate(xLength: number, yLength?: number): {
    for: (fct: ({ x, y }: xy) => any) => void;
    map: <T>(fct: ({ x, y }: xy) => T) => T[];
    nestedMap: <T>(fct: ({ x, y }: xy) => T) => T[][];
};

export function iterate(
    xLength: number, yLength?: number, zLength?: number
): {
    for: (fct: ({ x, y, z }: xyz) => any) => void;
    map: <T>(fct: ({ x, y, z }: xyz) => T) => T[];
    nestedMap: <T>(fct: ({ x, y, z }: xyz) => T) => T[][][];
};

export function iterate(
    xLength: number, yLength?: number, zLength?: number
) {
    const iterator = <T>(fct: (
        idxs: x | xy | xyz) => T, nested = false
    ) => {
        const arr: T[] = [];

        // xLength ->
        // tslint:disable-next-line: no-shadowed-variable
        for (let x = 0; x < xLength; x++) {
            if (!yLength) arr.push(fct({ x }));

            // yLength ->
            else for (let y = 0; y < yLength; y++) {
                if (!zLength) arr.push(fct({ x, y }));

                // zLength ->
                else for (let z = 0; z < zLength; z++) {
                    arr.push(fct({ x, y, z }));
                }
            }
        }

        if (!nested) return arr;

        if (zLength && yLength) {
            const newArr =  arrDivide(arr, yLength * zLength);
            return newArr.map((yArr) => arrDivide(yArr, zLength))
        } else if (yLength) {
            return arrDivide(arr, yLength);
        } else {
            return arr;
        }
    };

    return {
        for: (fct: (idxs: any) => any) => { iterator(fct); },

        map: <T>(fct: (idxs: any) => T) => iterator(fct) as T[],

        nestedMap: <T>(fct: (idxs: any) => T) => iterator(fct, true),
    };
}
