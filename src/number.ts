import { typeOf, genIdxDictionary } from ".";

/** Generate a random number between min and max, min and max are inclusive */
export const rand = (min: number, max: number) => Math.floor(Math.random() * ((max + 1) - min)) + min;

/** Takes a number || number[] and maxIdx, will generate a new random */
export function newRandIdx(prevIdx: number | number[], maxIdx: number) {
    let dict = typeOf(prevIdx, 'array') ? genIdxDictionary(prevIdx) : null;
    let num = -1;
    let loop = 0;

    do {
        num = rand(0, maxIdx);
        loop++;
        if (loop > 10000) {
            console.error('Check for infinite loop');
            throw 'Looped 10k times';
        }
    } while (prevIdx === num && dict && dict[num]);
    
    return num;
}
