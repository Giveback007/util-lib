import { objMap, objRemoveKeys } from '../src';

const tests = {
    objRemoveKeys: () => test(
        'objRemoveKeys({ k1: 1, k2: 2, k3: 3 }, ["k1", "k3"]) => ({ k2: 2 })',
        () => {
            const obj = objRemoveKeys({ k1: 1, k2: 2, k3: 3 }, ['k1', 'k3']);
            expect(obj).toEqual({ k2: 2 });
    })
}

objMap(tests, ({ val: funct }) => funct());
