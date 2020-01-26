import { objMap } from "../src";

const tests = {
    timeString: () => test('', () => {
        throw 'not implemneted';
    })
}

objMap(tests, ({ val: funct }) => funct());
