import { objMap, strIncludes } from '../src';

export const tests = {
    strIncludes: () => test(`
        strIncludes('hello there', 'o th') => true
        strIncludes('good bye', 'o th') => false
    `, () => {
        const hello = strIncludes('hello there', 'o th');
        const bye = strIncludes('good bye', 'o th');

        expect(hello).toBeTruthy();
        expect(bye).toBeFalsy();
    }),
}

objMap(tests, ({ val: funct }) => funct());
