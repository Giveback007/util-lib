import { objMap } from "../src";

const tests = {
    iterate: () => test('', () => {
        throw 'not implemneted';
    })
}

objMap(tests, ({ val: funct }) => funct());
