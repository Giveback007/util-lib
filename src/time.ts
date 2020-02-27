/**
 * Converts Date to time of day.
 * Good for use in loging.
 *
 * If no parameter `dt = new Date()`.
 * @param dt instance of Date obj
 * @returns `hh:mm:ss:ms`
 * @example "15:07:56:150"
 */
export function timeString(dt = new Date()) {
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
export function msToTime(msT: number, toObj = false) {
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

/** Gives time in milliseconds | sec(s) => s * 1000 */
export const sec = (s: number) => s * 1000;

/** Gives time in milliseconds | min(m) => m * 60000 */
export const min = (m: number) => m * 60000;

/** Gives time in milliseconds | hrs(h) => h * 3600000 */
export const hrs = (h: number) => h * 3600000;

/** Gives time in milliseconds | dys(d) => d * 86400000 */
export const dys = (d: number) => d * 86400000;

/** Gives time in milliseconds | wks(w) => w * 604800000 */
export const wks = (w: number) => w * 604800000;
