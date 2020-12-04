// import * as moment from 'moment-timezone';

export type MsTime = {
    /** second */
    s: 1000;
    /** minute */
    m: 60000;
    /** hour */
    h: 3600000;
    /** day */
    d: 86400000;
    /** week */
    w: 604800000;
}

export const msTime: MsTime = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
}

/**
 * Converts Date to time of day.
 * Good for use in loging.
 *
 * If no parameter `dt = new Date()`.
 * @param dt instance of Date obj
 * @returns `hh:mm:ss:ms`
 * @example "15:07:56:150"
 */
export function dateTimeToString(dt = new Date())
{
    const h = ('0' + dt.getHours()).slice(-2);
    const m = ('0' + dt.getMinutes()).slice(-2);
    const s = ('0' + dt.getSeconds()).slice(-2);
    const ms = ('00' + dt.getMilliseconds()).slice(-3);
    return `${h}:${m}:${s}:${ms}`;
}

export const msToSec = (ms: number) => ms / msTime.s;
export const msToMin = (ms: number) => ms / msTime.m;
export const msToHrs = (ms: number) => ms / msTime.h;
export const msToDys = (ms: number) => ms / msTime.d;
export const msToWks = (ms: number) => ms / msTime.w;

type timeObj = { d: number; h: number; m: number; s: number; ms: number; }
/**
 * Takes milliseconds and outputs to human readable time
 * @returns `'ddd:hh:mm:ss:ms'` | `{ d: number; h: number; m: number; s: number; ms: number; }`
 * @example 
 * ```js
 * msToTime(86400005) => '001:00:00:00:005'
 * msToTime(86400005, true) => { d: 1; h: 0; m: 0; s: 0; ms: 5; }
 * ```
 */
export function msToTime<T extends boolean>(msT: number, toObj?: boolean): string | timeObj;
export function msToTime<T extends boolean>(msT: number, toObj: true): timeObj;
export function msToTime<T extends boolean>(msT: number, toObj?: false): string;
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

    if (toObj) return { d: dN, h: hN, m: mN, s: sN, ms: msN };
    return `${dN ? d + ':' : ''}${h}:${m}:${s}:${ms}`;
}

/** Gives seconds in milliseconds | `sec(s) => s * 1000` */
export const seconds = (s: number) => s * msTime.s;

/** Analog of seconds() */
export const sec = seconds;

/** Gives minutes in milliseconds | `min(m) => m * 60000` */
export const minutes = (m: number) => m * msTime.m;

/** Analog of minutes() */
export const min = minutes;

/** Gives hours in milliseconds | `hrs(h) => h * 3600000` */
export const hours = (h: number) => h * msTime.h;

/** Analog of hours */
export const hrs = hours;

/** Gives days in milliseconds | `dys(d) => d * 86400000` */
export const days = (d: number) => d * msTime.d;

/** Analog of days */
export const dys = days;

/** Gives weeks in milliseconds | `wks(w) => w * 604800000` */
export const weeks = (w: number) => w * msTime.w;

/** Analog of weeks */
export const wks = weeks;

/**
 * Get unixMs for a given date/time, input time is in UTC
 * @example unixMs('2015-01-02') => 1420128000000
 */
export const unixMs = (time: string) =>
{
    const a = time.split('-').map((n) => parseFloat(n));
    return new Date(a[0], a[1], a[2]).getTime();
}

// /** Gives the 'start' and 'end' milliseconds of a unix day */
// export const dayStartEnd = (unixMsTime: number) =>
// {
//     const t = moment(unixMsTime).utc();

//     t.set({ h: 0, m: 0, s: 0, ms: 0 });
//     const start = t.valueOf();

//     t.set({ h: 23, m: 59, s: 59, ms: 999 });
//     const end = t.valueOf();

// 	return { start, end };
// }

// /** Gives the 'start' and 'end' milliseconds of a unix month */
// export const monthStartEnd = (unixMsTime: number): {
//     start: number;
//     end: number;
// } =>
// {
//     const year = moment(unixMsTime).utc().year();
//     const month = ('0' + (moment(unixMsTime).utc().month() + 1)).slice(-2);

//     const s = moment(`${year}-${month}-01`).set({ h: 0, m: 0, s: 0, ms: 0 });
//     const start = s.valueOf() + min(s.utcOffset());

//     const e = moment(`${year}-${month}-31`).set({ h: 23, m: 59, s: 59, ms: 999 });
//     const end = e.valueOf() + min(e.utcOffset());

//     return { start, end };
// }

// /** Gives the 'start' and 'end' milliseconds of a unix year */
// export const yearStartEnd = (unixMsTime: number) =>
// {
//     const year = moment(unixMsTime).utc().year();

//     const s = moment(`${year}-01-01`).set({ h: 0, m: 0, s: 0, ms: 0 });
//     const start = s.valueOf() + min(s.utcOffset());

//     const e = moment(`${year}-12-31`).set({ h: 23, m: 59, s: 59, ms: 999 });
//     const end = e.valueOf() + min(e.utcOffset());

//     return { start, end };
// }
