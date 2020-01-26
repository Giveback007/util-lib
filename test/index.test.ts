import { readdirSync } from 'fs';
import { arrRemoveValues, arrToBoolDict } from '../src';

const testFiles = arrToBoolDict((readdirSync('./test')));
const srcFiles = arrRemoveValues(readdirSync('./src'), ['@types.ts']);

test.each(srcFiles)(
    'Each "./src" file has a corresponding "./test" file',
    (x) => {
        const name = x.replace(/.ts/, '') + '.test.ts';
        expect(testFiles).toHaveProperty([name]);
});
