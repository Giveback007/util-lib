import { AnyDate, isType, MsTime, num, PartialTimeObj, str, TimeArr, TimeObj } from '.';

export const msTime: MsTime = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
}

export const weekTuple = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

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

/** Gives the 'start' and 'end' of a day.
 *
 * Start of day is the first ms of the day
 *
 * End of day is the last ms of the day
 */
 export function getDayStartEnd(t: number | Date, type: 'unix' | 'local' = 'local') {
    if (isType(t, 'number')) t = new Date(t);

    const y = t.getFullYear();
    const m = t.getMonth();
    const d = t.getDate();

    let start = new Date(y, m, d);
    let end = new Date(y, m, d, 23, 59, 59, 999);

    if (type === 'unix') {
        const tzOffset = time.min(start.getTimezoneOffset());

        start = new Date(start.getTime() + tzOffset);
        end = new Date(end.getTime() + tzOffset);
    }

    return { start, end };
}

export function weekStartEnd(t: number | Date, weekStart: 'sun' | 'mon' = 'sun', type: 'unix' | 'local' = 'local') {
    if (isType(t, 'number')) t = new Date(t);

    const wd = t.getDay();

    const startOffset = wd * -1 + (weekStart === 'mon' ? 1 : 0);
    const endOffset = 6 + startOffset;

    const s = new Date(t.getTime() + time.dys(startOffset));
    const e = new Date(t.getTime() + time.dys(endOffset));

    let start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
    let end = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999);

    if (type === 'unix') {
        const tzOffset = time.min(start.getTimezoneOffset());

        start = new Date(start.getTime() + tzOffset);
        end = new Date(end.getTime() + tzOffset);
    }

    return { start, end };
}

export function monthStartEnd(t: number | Date, type: 'unix' | 'local' = 'local') {
    if (isType(t, 'number')) t = new Date(t);

    const y = t.getFullYear();
    const m = t.getMonth();

    let start = new Date(y, m, 1);
    let end = new Date(y, m, 0, 23, 59, 59, 999);

    if (type === 'unix') {
        const tzOffset = time.min(start.getTimezoneOffset());

        start = new Date(start.getTime() + tzOffset);
        end = new Date(end.getTime() + tzOffset);
    }

    return { start, end };
}

export function yearStartEnd(t: number | Date, type: 'unix' | 'local' = 'local') {
    if (isType(t, 'number')) t = new Date(t);

    const y = t.getFullYear();

    let start = new Date(y, 0, 1);
    let end = new Date(y, 12, 0, 23, 59, 59, 999);

    if (type === 'unix') {
        const tzOffset = time.min(start.getTimezoneOffset());

        start = new Date(start.getTime() + tzOffset);
        end = new Date(end.getTime() + tzOffset);
    }

    return { start, end };
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

// Intl.supportedValuesOf('timeZone');
/** A Date substitute, to make working with time easier and more versatile */
export function getTime(
    date: TimeObj | PartialTimeObj | TimeArr,
    ianaTimeZone?: str
) {
    const dt = parseDate(date);
    if (!dt) throw new Error('Invalid Date');

    ianaTimeZone = ianaTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzOffsetMin = timeZoneOffsetMin(ianaTimeZone, dt);

    const localISO = toLocalISOString(dt, tzOffsetMin);
    const finalDateObj = new Date(localISO);

    return {
        tzOffsetMin, // this flips from the JS output, to align with the ISO output (- when js would be +)
        localISO,
        isoStr: finalDateObj.toISOString(),
        Date: finalDateObj,
        epochMs: finalDateObj.getTime(),
        ianaTZ: ianaTimeZone,
        timeObj: timeObj(dt),
    }
}

export function timeZoneOffsetMin(
    ianaTimeZone: string,
    date = new Date(),
) {
    const local = new Date(date);
    local.setMilliseconds(0);
    local.setSeconds(0);
    const tzTime = local.toLocaleString('US-en', { timeZone: ianaTimeZone });
    const tzDt = new Date(tzTime);

    const offsetMs = -local.getTimezoneOffset() * 60_000;
    const utcTime = tzDt.getTime() + offsetMs;

    return (utcTime - local.getTime()) / 60_000
}

export const timeObj = (dt: Date): TimeObj => ({
    y: dt.getFullYear(),
    m: dt.getMonth() + 1,
    d: dt.getDate(),
    h: dt.getHours(),
    min: dt.getMinutes(),
    sec: dt.getSeconds(),
    ms: dt.getMilliseconds(),
    wDay: weekTuple[dt.getDay()]!
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

export function toLocalISOString(
    date: Date,
    tzOffsetMin = -date.getTimezoneOffset()
) {
    const sign = tzOffsetMin >= 0 ? '+' : '-';
    const diffHours = String(Math.floor(Math.abs(tzOffsetMin) / 60)).padStart(2, '0');
    const diffMinutes = String(Math.abs(tzOffsetMin) % 60).padStart(2, '0');

    return date.toLocaleString('lt').replace(' ', 'T') // or use: "sv-SE" (same effect)
    + '.' + (date.getMilliseconds() + '').padStart(3, '0')
    + sign + diffHours + ':' + diffMinutes;
}