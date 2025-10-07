import { Temporal } from '@js-temporal/polyfill';
import { AnyDate, isType, MsTime, num, str, TimeArr, TimeObj } from '.';

/** A promise that waits `ms` amount of milliseconds to execute */
export const wait = (ms: number): Promise<void> =>
    new Promise((res) => setTimeout(() => res(), ms));

/** Resolves after a given msEpoch passes. `msEpoch - Date.now()` */
export const waitUntil = (msEpoch: number): Promise<void> =>
    new Promise(res => setTimeout(res, msEpoch - Date.now()))

export const msTime: MsTime = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
}

/**
 * Converts Date to time of day.
 * Good for use in logging.
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

export const time = {
    /** Seconds(n) -> to ms */
    sec: (n: num) => 1_000 * n,
    /** Minutes(n) -> to ms */
    min: (n: num) => 60_000 * n,
    /** Hours(n)   -> to ms */
    hrs: (n: num) => 3_600_000 * n,
    /** Days(n)    -> to ms */
    dys: (n: num) => 86_400_000 * n,
    /** Weeks(n)   -> to ms */
    wks: (n: num) => 604_800_000 * n,

    /** Count time elapsed since: `from` until `to`, `to` def to `Date.now()` */
    since: (from: num, to: num = Date.now()) => to - from,
    /** Count down to: `target` time from `from`, `from` def to `Date.now()` */
    until: (target: num, from: num = Date.now()) => target - from,

    future: {
        /** fnc(n)  -> add ms to now */
        ms: (n: num) => Date.now() + n,
        /** fnc(n)  -> add sec to now */
        sec: (n: num) => Date.now() + n * msTime.s,
        /** fnc(n)  -> add min to now */
        min: (n: num) => Date.now() + n * msTime.m,
    },

    /** Convert ms into: */
    msTo: {
        /** fnc(n)  -> from ms to num of seconds */
        sec: (ms: num) => ms / msTime.s,
        /** fnc(n)  -> from ms to num of minutes */
        min: (ms: num) => ms / msTime.m,
        /** fnc(n)  -> from ms to num of hours */
        hrs: (ms: num) => ms / msTime.h,
        /** fnc(n)  -> from ms to num of days */
        dys: (ms: num) => ms / msTime.d,
        /** fnc(n)  -> from ms to num of weeks */
        wks: (ms: num) => ms / msTime.w,
    },

    get now() { return Date.now(); }
} as const;

export const humanizedTime = (date: AnyDate) => {
    const dt = parseDate(date);
    if (!dt) return null;
    const dif = time.since(dt.getTime());

    /** p for plural */
    const p = (n: num) => n > 1 ? 's' : '';

    if (dif < 0) {
        return dt.toLocaleString();
    } else if (dif < time.min(1)) {
        const s = Math.ceil(time.msTo.sec(dif)) || 1;
        return `${s} second${p(s)} ago`
    } else if (dif < time.hrs(1)) {
        const m = Math.floor(time.msTo.min(dif));
        return `${m} minute${p(m)} ago`
    } else if (dif < time.hrs(24) && dt.getDate() === new Date().getDate()) {
        const h = Math.floor(time.msTo.hrs(dif));
        const m = Math.floor(time.msTo.min(dif - time.hrs(h)))
        return `${h} hour${p(h)} ${m > 1 ? `${m} minute${p(m)} ` : ''}ago`
    } else {
        return dt.toLocaleString();
    }
}

/** A Date substitute, to make working with time easier and more versatile */
export function getTime(
    t?: Temporal.ZonedDateTime | TimeArr | num | str | 'now',
    /** For a list of available timeZone values run:
     * `Intl.supportedValuesOf('timeZone');` */
    timeZone?: str
) {
    if (t === undefined || t === 'now') t = Date.now();
    if (!timeZone) timeZone = t instanceof Temporal.ZonedDateTime ?
        t.timeZoneId : Intl.DateTimeFormat().resolvedOptions().timeZone;

    let zonedTemporal: Temporal.ZonedDateTime;
    let date: Date;
    let isoStr: str;

    if (isType(t, 'number')) {
        date = new Date(t);
        isoStr = date.toISOString();
        zonedTemporal = Temporal.ZonedDateTime.from(isoStr + `[${timeZone}]`);
    } else if (isType(t, 'string')) {
        zonedTemporal = Temporal.ZonedDateTime.from(t + `[${timeZone}]`)
    } else if (t instanceof Temporal.ZonedDateTime) {
        zonedTemporal = t.withTimeZone(timeZone)
    } else {
        zonedTemporal = Temporal.ZonedDateTime.from({
            year: t[0],
            month: t[1] || 1,
            day: t[2] || 1,
            hour: t[3] || 0,
            minute: t[4] || 0,
            second: t[5] || 0,
            millisecond: t[6] || 0,
            timeZone
        });
    }

    date = date! || new Date(zonedTemporal.epochMilliseconds);

    return {
        zonedTemporal,
        date,
        tzOffsetMin: zonedTemporal.offsetNanoseconds / 60_000_000_000,
        localISO: zonedTemporal.toJSON(),
        obj: timeObj(zonedTemporal),
        isoStr: isoStr! || date.toISOString(),
        timeZone: timeZone,
        epochMs: zonedTemporal.epochMilliseconds,
        startOf: {
            day: () => getTime(zonedTemporal.startOfDay(), timeZone),

            week: (
                weekStartsOn: "sun" | "mon" = "sun"
            ) => {
                const zT = zonedTemporal;
                // dayOfWeek: 1 = Monday, 7 = Sunday
                const currentDay = zT.dayOfWeek;
                
                // Calculate days to subtract to get to week start
                let daysToSubtract: number;
                if (weekStartsOn === "sun") {
                    // Week starts on Sunday
                    daysToSubtract = currentDay === 7 ? 0 : currentDay;
                } else {
                    // Week starts on Monday
                    daysToSubtract = currentDay - 1;
                }
                
                const weekStart = zT.subtract({ days: daysToSubtract }).startOfDay();
                return getTime(weekStart, timeZone);
            },

            month: () => {
                const zT = zonedTemporal;
                return getTime([zT.year, zT.month, 1, 0, 0, 0, 0], timeZone)
            },

            year: () => {
                const zT = zonedTemporal;
                return getTime([zT.year, 1, 1, 0, 0, 0, 0], timeZone)
            }
        },
        endOf: {
            day: () => {
                const zT = zonedTemporal;
                return getTime([zT.year, zT.month, zT.day, 23, 59, 59, 999], timeZone)
            },

            week: (
                weekStartsOn: "sun" | "mon" = "sun"
            ) => {
                const zT = zonedTemporal;
                // dayOfWeek: 1 = Monday, 7 = Sunday
                const currentDay = zT.dayOfWeek;
                
                // Calculate days to add to get to week end
                let daysToAdd: number;
                if (weekStartsOn === "sun") {
                    // Week ends on Saturday (day 6)
                    daysToAdd = currentDay === 7 ? 6 : 6 - currentDay;
                } else {
                    // Week ends on Sunday (day 7)
                    daysToAdd = 7 - currentDay;
                }
                
                const weekEnd = zT.add({ days: daysToAdd });
                return getTime([weekEnd.year, weekEnd.month, weekEnd.day, 23, 59, 59, 999], timeZone);
            },

            month: () => {
                const zT = zonedTemporal;
                return getTime([zT.year, zT.month, zT.daysInMonth, 23, 59, 59, 999], timeZone)
            },

            year: () => {
                const zT = zonedTemporal;
                return getTime([zT.year, 12, 31, 23, 59, 59, 999], timeZone)
            }
        }
    }
}

export const timeObj = (dt: Date | Temporal.ZonedDateTime): TimeObj => dt instanceof Date ? ({
    y: dt.getFullYear(),
    m: dt.getMonth() + 1,
    d: dt.getDate(),
    h: dt.getHours(),
    min: dt.getMinutes(),
    sec: dt.getSeconds(),
    ms: dt.getMilliseconds(),
    wDay: (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const)[dt.getDay()]!
}) : ({
    y: dt.year,
    m: dt.month,
    d: dt.day,
    h: dt.hour,
    min: dt.minute,
    sec: dt.second,
    ms: dt.millisecond,
    wDay: (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const)[dt.dayOfWeek - 1]!
});

export function parseDate(d: AnyDate) {
    const dt =
        Array.isArray(d) ?
            new Date(d[0], (d[1] || 1) - 1, d[2] || 1, d[3] || 0, d[4] || 0, d[5] || 0, d[6] || 0)
            :
        isType(d, 'object') && !(d instanceof Date) ?
            new Date(d.y, (d?.m || 1) - 1, d.d || 1, d.h || 0, d.min || 0, d.sec || 0, d.ms || 0)
            :
            new Date(d);

    if (isNaN(dt as any)) {
        console.error(new Error(`Invalid Date: ${isType(d, 'string') ? `"${d}"` : JSON.stringify(d)}`));
        return null
    }

    return dt;
}