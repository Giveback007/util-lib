import { arrGen } from "./array";

/** Iterates n times over a function */
const iterateOLD = (num: number) => ({
    for: (funct: (i: number) => any) => {
        for (let i = 0; i < num; i++) { funct(i) };
    },
    map: <T>(funct: (i: number) => T) => {
        const arr: T[] = [];
        for (let i = 0; i < num; i++) { arr.push(funct(i)) };
        return arr;
    }
});

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
 * Starting index is always 0
 * */
export function iterate(xLength: number, yLength?: number, zLength?: number) : {
    for: (funct: ({ x, y, z }: xyz) => any) => void;
    map: <T>(funct: ({ x, y, z }: xyz) => T) => T[];
    nestedMap: <T>(funct: ({ x, y, z }: xyz) => T) => T[][][];
}

export function iterate(xLength: number, yLength?: number) : {
    for: (funct: ({ x, y }: xy) => any) => void;
    map: <T>(funct: ({ x, y }: xy) => T) => T[];
    nestedMap: <T>(funct: ({ x, y }: xy) => T) => T[][];
}

export function iterate(xLength: number) : {
    for: (funct: ({ x }: x) => any) => void;
    map: <T>(funct: ({ x }: x) => T) => T[];
    nestedMap: <T>(funct: ({ x }: x) => T) => T[];
}

export function iterate(xLength: number, yLength?: number, zLength?: number) {

    const iterator = <T>(funct: ({ x, y, z }: xyz) => T) => {
        const arr1: T[]     = arrGen(xLength);
        const arr2: T[][]   = yLength ? arr1.map(() => arrGen(yLength)) : null;
        const arr3: T[][][] = zLength ? arr2.map(() => arrGen(zLength)) : null;

        // xLength ->
        for (let x = 0; x < xLength; x++) {
            if (!yLength) arr1.push(funct({ x } as any));
            // yLength ->
            else for (let y = 0; y < yLength; y++) {
                if (!zLength) arr2[x].push(funct({ x, y } as any));
                // zLength ->
                else for (let z = 0; z < zLength; z++) {
                    arr3[x][y].push(funct({ x, y, z }))
                }
            }
        }

        return zLength ? arr3 : yLength ? arr2 : arr1;
    }

    return {
        for: (funct: (idxs: any) => any) => { iterator(funct); },
        map: <T>(funct: (idxs: any) => T) => iterator(funct),
        nestedMap: <T>(funct: (idxs: any) => T) => iterator(funct),
    }
}
