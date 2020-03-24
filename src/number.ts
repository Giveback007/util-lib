import { arrToIdxDict, isType } from '.';

/**
 * Generate a random number between min and max, min and max are inclusive.
 * min & max must be whole numbers
 * @param min - whole number
 * @param max - whole number & greater than min
 */
export const rand = (min: number, max: number) =>
    Math.floor(Math.random() * ((max + 1) - min)) + min;

/** Takes an array of numbers and finds and average */
export const average = (nArr: number[]) =>
    nArr.reduce((a = 0, b = 0) => a + b, 0) / nArr.length;

/**
 * Takes a number `n` & fixes to decimal places `places`
 * @param n - the number to fix decimal places of
 * @param places - number of decimal places to round to
 * @example decPlaces(1.1276, 2) => 1.13
 */
export const decPlace = (n: number, places: number) => Number(n.toFixed(places))

/** @example numberWithCommas(1000000) => '1,000,000' */
export const numberWithCommas = (n: number | string) =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Takes a number || number[] and maxIdx, will generate a new random idx */
export function newRandIdx(prevIdx: number | number[], maxIdx: number)
{
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

/**
 * Takes a number || number[] and min & max, will generate a new random
 * number
 */
export function newNumFromRange(
    prevNum: number | number[], min: number, max: number
)
{
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
