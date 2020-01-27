import { arrDivide } from './array';

type x = { x: number };
type xy = { x: number, y: number };
type xyz = { x: number, y: number, z: number };

/**
 * Iterate over a function like nested for loops
 * each cycle would return an object eg:
 *
 * xLength 3, yLength: 3, zLength: 3
 *
 * { 0, 0, 0 } ... { 0, 0, 1 } ... { 0, 0, 2 }
 *
 * { 0, 1, 0 } ... { 0, 1, 1 } ... { 0, 1, 2 }
 *
 * ...
 *
 * { 2, 2, 0 } ... { 2, 2, 1 } ... { 2, 2, 2 } <- last object
 *
 * Starting index is 0
 */
export function iterate(xLength: number): {
    for: (funct: ({ x }: x) => any) => void;
    map: <T>(funct: ({ x }: x) => T) => T[];
    nestedMap: <T>(funct: ({ x }: x) => T) => T[];
};

export function iterate(xLength: number, yLength?: number): {
    for: (funct: ({ x, y }: xy) => any) => void;
    map: <T>(funct: ({ x, y }: xy) => T) => T[];
    nestedMap: <T>(funct: ({ x, y }: xy) => T) => T[][];
};

export function iterate(xLength: number, yLength?: number, zLength?: number): {
    for: (funct: ({ x, y, z }: xyz) => any) => void;
    map: <T>(funct: ({ x, y, z }: xyz) => T) => T[];
    nestedMap: <T>(funct: ({ x, y, z }: xyz) => T) => T[][][];
};

export function iterate(xLength: number, yLength?: number, zLength?: number) {

    const iterator = <T>(funct: (idxs: x | xy | xyz) => T, nested = false) => {
        const arr: T[] = [];

        // xLength ->
        // tslint:disable-next-line: no-shadowed-variable
        for (let x = 0; x < xLength; x++) {
            if (!yLength) arr.push(funct({ x }));

            // yLength ->
            else for (let y = 0; y < yLength; y++) {
                if (!zLength) arr.push(funct({ x, y }));

                // zLength ->
                else for (let z = 0; z < zLength; z++) {
                    arr.push(funct({ x, y, z }));
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
        for: (funct: (idxs: any) => any) => { iterator(funct); },

        map: <T>(funct: (idxs: any) => T) => iterator(funct) as T[],

        nestedMap: <T>(funct: (idxs: any) => T) => iterator(funct, true),
    };
}
// console.log(iterate(3, 3, 3).nestedMap(({ x, y, z }) => `x${x} y${y} z${z}`));
