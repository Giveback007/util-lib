import { objMap, seconds, minutes, hours, days } from '../src';

export const tests = {
    seconds: () => test('', () => {
        const s = 1000;
        expect(seconds(s)).toEqual(s * 1000)
    }),
    minutes: () => test('', () => {
        const m = 68;
        expect(minutes(m)).toEqual(m * 60000)
    }),
    hours: () => test('', () => {
        const h = 25;
        expect(hours(h)).toEqual(h * 3600000);
    }),
    days: () => test('', () => {
        const d = 42;
        expect(days(42)).toEqual(d * hours(24));
    }),
}

objMap(tests, ({ val: funct }) => funct());
