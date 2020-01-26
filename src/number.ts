import { arrToIdxDict, isType } from '.';

/** Generate a random number between min and max, min and max are inclusive */
export const rand = (min: number, max: number) => Math.floor(Math.random() * ((max + 1) - min)) + min;

/** Takes a number || number[] and maxIdx, will generate a new random idx */
export function newRandIdx(prevIdx: number | number[], maxIdx: number) {
    const dict = isType(prevIdx, 'array') ? arrToIdxDict(prevIdx) : null;
    let num = -1;
    let loop = 0;

    do {
        num = rand(0, maxIdx);
        loop++;
        if (loop > 10000) {
            console.error('Check for infinite loop');
            throw new Error('Looped 10k times');
        }
    } while (prevIdx === num || dict && dict[num]);

    return num;
}

/** Takes a number || number[] and min & max, will generate a new random number */
export function newNumFromRange(prevNum: number | number[], min: number, max: number) {
    const dict = isType(prevNum, 'array') ? arrToIdxDict(prevNum) : null;
    let num = -1;
    let loop = 0;

    do {
        num = rand(min, max);
        loop++;
        if (loop > 10000) {
            console.error('Check for infinite loop');
            throw new Error('Looped 10k times');
        }
    } while (prevNum === num || dict && dict[num]);

    return num;
}
