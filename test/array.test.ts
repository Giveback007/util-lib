import * as utils from '../src/array';
// import { type } from '../src';
const { arrGen } = utils;

// check if each function has a corresponding test

describe('array.test', () => {
    test('arrGen(3) => [null, null, null]', () => {
        expect(arrGen(3)).toEqual([null, null, null]);
    });
})

