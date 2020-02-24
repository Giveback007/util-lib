/**
 * @param dt instance of Date obj
 * @returns `hh:mm:ss:ms` eg: `23:27:56:150`
 */
export function timeString(dt = new Date()) {
    const h = ('0' + dt.getHours()).slice(-2);
    const m = ('0' + dt.getMinutes()).slice(-2);
    const s = ('0' + dt.getSeconds()).slice(-2);
    const ms = ('00' + dt.getMilliseconds()).slice(-3);
    return `${h}:${m}:${s}:${ms}`;
}

/** Gives time in milliseconds */
export const seconds = (s: number) => s * 1000;

/** Gives time in milliseconds */
export const minutes = (m: number) => m * 60000;

/** Gives time in milliseconds */
export const hours = (h: number) => h * 3600000;

/** Gives time in milliseconds */
export const days = (d: number) => d * hours(24);
