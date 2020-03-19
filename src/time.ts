import moment = require('moment-timezone');

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

type timeObj = { d: number; h: number; m: number; s: number; ms: number; }
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

    if (toObj) return { d: dN, h: hN, m: mN, s: sN, ms: msN };
    return `${dN ? d + ':' : ''}${h}:${m}:${s}:${ms}`;
}

/** Gives seconds in milliseconds | sec(s) => s * 1000 */
export const seconds = (s: number) => s * 1000;

/** Analog of seconds() */
export const sec = seconds;

/** Gives minutes in milliseconds | min(m) => m * 60000 */
export const minutes = (m: number) => m * 60000;

/** Analog of minutes() */
export const min = minutes;

/** Gives hours in milliseconds | hrs(h) => h * 3600000 */
export const hours = (h: number) => h * 3600000;

/** Analog of hours */
export const hrs = hours;

/** Gives days in milliseconds | dys(d) => d * 86400000 */
export const days = (d: number) => d * 86400000;

/** Analog of days */
export const dys = days;

/** Gives weeks in milliseconds | wks(w) => w * 604800000 */
export const weeks = (w: number) => w * 604800000;

/** Analog of weeks */
export const wks = weeks;

/**
 * Get unixMs for a given date/time, input time is in UTC
 * @example unixMs('2015-01-02') => 1420128000000
 */
export const unixMs = (time: string) => moment(time).utc().valueOf();

/** Gives the 'start' and 'end' milliseconds of a unix day */
export const dayStartEnd = (unixMsTime: number) =>
{
    const t = moment(unixMsTime).utc();

    t.set({ h: 0, m: 0, s: 0, ms: 0 });
    const start = t.valueOf();

    t.set({ h: 23, m: 59, s: 59, ms: 999 });
    const end = t.valueOf();

	return { start, end };
}

/** Gives the 'start' and 'end' milliseconds of a unix month */
export const monthStartEnd = (unixMsTime: number): {
    start: number;
    end: number;
} =>
{
    const year = moment(unixMsTime).utc().year();
    const month = ('0' + (moment(unixMsTime).utc().month() + 1)).slice(-2);

    const s = moment(`${year}-${month}-01`).set({ h: 0, m: 0, s: 0, ms: 0 });
    const start = s.valueOf() + min(s.utcOffset());

    const e = moment(`${year}-${month}-31`).set({ h: 23, m: 59, s: 59, ms: 999 });
    const end = e.valueOf() + min(e.utcOffset());

    return { start, end };
}

/** Gives the 'start' and 'end' milliseconds of a unix year */
export const yearStartEnd = (unixMsTime: number) =>
{
    const year = moment(unixMsTime).utc().year();

    const s = moment(`${year}-01-01`).set({ h: 0, m: 0, s: 0, ms: 0 });
    const start = s.valueOf() + min(s.utcOffset());

    const e = moment(`${year}-12-31`).set({ h: 23, m: 59, s: 59, ms: 999 });
    const end = e.valueOf() + min(e.utcOffset());

    return { start, end };
}
