import { JsType, isType } from '.';

/**
 * @example interval((i) => console.log('The index is: ' + i), 1000, 2) =>
 * // 'The index is: 0' // 'The index is: 2'
 */
export const interval = (
    funct: (i: number) => any,
    time: number,
    times?: number
) =>
{
    if (isType(times, 'number') && times < 1)
        throw Error('argument "times" can\'t be less than 1');

    let i = 0;
    const intv = setInterval(() => {
        funct(i);

        if (isType(times, 'number')) {
            i += 1;
            if (i >= times) clearInterval(intv);
        }
    }, time)

    return {
        stop: () => clearInterval(intv),
    }
}

/** A promise that waits `ms` amount of milliseconds to execute */
export const wait = (ms: number): Promise<void> =>
    new Promise((res) => setTimeout(() => res(), ms));

/**
 * An alternative to console.log in that it will clone the obj.
 *
 * Useful for when need to see the object in a specific state instance.
 */
export const cloneLog = (x: any) => console.log(clone(x));

/** Creates a copy of the object trough JSON stringify and parse */
export const clone = <T>(item: T) => JSON.parse(JSON.stringify(item));

/** An improved version of native `typeof` */
export function type(val: any): JsType
{
    if (typeof val === 'object') {
        if (Array.isArray(val)) return 'array';
        else if (val === null)  return 'null';
        else                    return 'object';
    } else {
        if (val !== val)        return 'NaN';
        else                    return typeof val;
    }
}

export const viewSize = ({
    innerWidth, innerHeight
} = window) => ({ width: innerWidth, height: innerHeight });

export const uiid = () =>
{
    let d = new Date().getTime();
    let d2 = (
        performance
        &&
        performance.now
        &&
        (performance.now() * 1000)
    ) || 0;

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }

        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const randomColoHex = () =>
    '#' + ((1<<24)*Math.random()|0).toString(16);
