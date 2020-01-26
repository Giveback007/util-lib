import { objMap, JsType, arrRemoveValues, isType } from '../src';

const types: JsType[] = [
    'array',
    'bigint',
    'boolean',
    'function',
    'NaN',
    'null',
    'number',
    'object',
    'string',
    'symbol',
    'undefined',
]

const typeTests: [any, JsType][] = [
    [[], 'array'],
    [BigInt(5), 'bigint'],
    [false, 'boolean'],
    [() => false, 'function'],
    [NaN, 'NaN'],
    [null, 'null'],
    [42, 'number'],
    [{}, 'object'],
    ['str', 'string'],
    [Symbol(), 'symbol'],
    [undefined, 'undefined']
]

export const tests = {
    // test that each type is not any other type
    isType: () => test.each(typeTests)('isType(%s, "%s") => true', (val, type) => {
        arrRemoveValues(types, [type]).forEach((t) => {
            expect(isType(val, t)).toBeFalsy();
        });

        expect(isType(val, type)).toBeTruthy();
    }),
}

objMap(tests, ({ val: funct }) => funct());
