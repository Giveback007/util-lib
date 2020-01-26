import { wait, objMap } from '../src'

const tests = {
    wait: ()=> test('wait() waits the appropriate amount of time', () => {
        const waitTime = 50;
        const time1 = new Date().getTime();

        return wait(waitTime).then(() => {
            const time2 = new Date().getTime();

            // time waited should be greater than initial time
            expect(time2 - waitTime).toBeGreaterThanOrEqual(time1);
            // time waited should not exceed above given time
            expect(time2).toBeLessThan(time1 + waitTime + 20);
        })
    })
}

objMap(tests, ({ val: funct }) => funct());
