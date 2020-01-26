import { objMap, rand } from "../src";

const tests = {
    rand: () => test('rand(-2, 6) => (n >= -2 && n <= 6)', () => {
        const n = rand(-2, 6);
        expect(n).toBeGreaterThanOrEqual(-2);
        expect(n).toBeLessThanOrEqual(6);
    })
}

objMap(tests, ({ val: funct }) => funct());
