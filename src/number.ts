import { arrToBoolDict, Dict, isType } from '.';

/**
 * Returns a random whole number between `min` and `max`,
 * `min` and `max` are inclusive.
 * `min` & `max` must be whole numbers
 * @param min - whole number & `< max`
 * @param max - whole number & `> min`
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
 * @example
 * ```js
 * decPlaces(1.1276, 2) //=> 1.13
 * ```
 */
export const decPlace = (n: number, places: number) =>
    parseFloat(n.toFixed(places));

/**
 * @example
 * ```js
 * numberWithCommas(1000000) //=> '1,000,000'
 * ```
 */
export const numberWithCommas = (n: number | string) =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Takes a number || number[] and min & max, will generate a
 * new random number.
 */
export function newNumFromRange(
    prevNum: number | number[], min: number, max: number
) {
    let num;
    let loop = 0;
    const dict: Dict<boolean> = isType(prevNum, 'array') ?
        arrToBoolDict(prevNum) : { [prevNum]: true };

    do {
        num = rand(min, max);
        loop++;

        if (loop > 1_000_000) {
            console.error('Check for infinite loops');
            throw new Error('Looped 1 million times');
        }
    } while (dict[num]);

    return num;
}
