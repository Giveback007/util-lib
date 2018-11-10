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

type xyz = { x: number, y?: number, z?: number };
/**
 * Iterate over a function as nested for loops would
 * each cycle would return an object eg:
 * 
 * xLength 2, yLength: 2, zLength: 3
 * 
 * { 0, 0, 0 } ... { 0, 0, 1 } ... { 0, 0, 2 }
 * 
 * { 0, 1, 0 } ... { 0, 1, 1 } ... { 0, 1, 2 }
 * 
 * ... etc
 * 
 * Starting index is always 0
 * */
export const iterate = (xLength: number, yLength?: number, zLength?: number) => {

    const iterator = <T>(funct: ({ x, y, z }: xyz) => T) => {
        const arr: T[] = [];

        for (let x = 0; x < xLength; x++) {
            if (!yLength) arr.push(funct({ x }));
            else for (let y = 0; y < yLength; y++) {
                if (!zLength) arr.push(funct({ x, y }));
                else for (let z = 0; z < zLength; z++) {
                    arr.push(funct({ x, y, z }))
                }
            }
        }

        return arr;
    }

    return {
        for: (funct: ({ x, y, z }: xyz) => any) => { iterator(funct); },
        map: <T>(funct: ({ x, y, z }: xyz) => T) => iterator(funct)
    }
}
