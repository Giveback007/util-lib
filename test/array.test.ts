import { arrGen, objMap } from '../src';

export const tests = {
    arrGen: () => test('arrGen(3) => [null, null, null]', () => {
        expect(arrGen(3)).toEqual([null, null, null]);
    }),
    // arrRemoveById: () => test('', () => {
    //     expect()
    // }),
}

objMap(tests, ({ val: funct }) => funct());
