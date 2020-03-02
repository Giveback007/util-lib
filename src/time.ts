import * as moment from 'moment-timezone';

/**
 * Converts Date to time of day.
 * Good for use in loging.
 *
 * If no parameter `dt = new Date()`.
 * @param dt instance of Date obj
 * @returns `hh:mm:ss:ms`
 * @example "15:07:56:150"
 */
export function timeString(dt = new Date())
{
    const h = ('0' + dt.getHours()).slice(-2);
    const m = ('0' + dt.getMinutes()).slice(-2);
    const s = ('0' + dt.getSeconds()).slice(-2);
    const ms = ('00' + dt.getMilliseconds()).slice(-3);
    return `${h}:${m}:${s}:${ms}`;
}

type timeObj = { d: string; h: string; m: string; s: string; ms: string; }
export function msToTime<T extends boolean>(msT: number, toObj?: boolean): string | timeObj;
export function msToTime<T extends boolean>(msT: number, toObj: true): timeObj;
export function msToTime<T extends boolean>(msT: number, toObj?: false): string;
/**
 * Takes milliseconds and outputs to human readable time
 * @returns `ddd:hh:mm:ss:ms` | `{ d: string; h: string; m: string; s: string; ms: string; }`
 * @example msToTime(86400005) => '001:00:00:00:005'
 * ||
 * msToTime(86400005, true) =>
 *  { d: '001'; h: '00'; m: '00'; s: '00'; ms: '005'; }
 */
export function msToTime(msT: number, toObj = false)
{
    // N - number;
    const msN = (msT % 1000);
    let sN = Math.floor(msT / 1000);
    let mN = Math.floor(sN / 60);
    sN = sN % 60;

    let hN = Math.floor(mN / 60);
    mN = mN % 60;

    const dN = Math.floor(hN / 24);
    hN = hN % 24;

    const d = ('00' + dN).slice(-3);
    const h = (('0' + hN).slice(-2));
    const m = (('0' + mN).slice(-2));
    const s = (('0' + sN)).slice(-2);
    const ms = (('00' + msN).slice(-3));

    if (toObj) return { d, h, m, s, ms };
    return `${dN ? d + ':' : ''}${h}:${m}:${s}:${ms}`;
}

/** Gives seconds in milliseconds | sec(s) => s * 1000 */
export const sec = (s: number) => s * 1000;

/** Gives minutes in milliseconds | min(m) => m * 60000 */
export const min = (m: number) => m * 60000;

/** Gives hours in milliseconds | hrs(h) => h * 3600000 */
export const hrs = (h: number) => h * 3600000;

/** Gives days in milliseconds | dys(d) => d * 86400000 */
export const dys = (d: number) => d * 86400000;

/** Gives weeks in milliseconds | wks(w) => w * 604800000 */
export const wks = (w: number) => w * 604800000;

/** Gives the 'start' and 'end' milliseconds of a unix day */
export const dayStartEnd = (unixMs: number) =>
{
    const t = moment(unixMs).utc();

    t.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const start = t.valueOf();

    t.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
    const end = t.valueOf();

	return { start, end };
}
