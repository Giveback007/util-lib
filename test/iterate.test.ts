import { objMap } from '../src';

const tests = {
    iterate: () => test('', () => {
        // x, y, z
        throw 'not implemneted';
    })
}

objMap(tests, ({ val: funct }) => funct());
