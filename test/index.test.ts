import { readdirSync } from 'fs';
import { arrRemoveValues, arrToBoolDict } from '../src';

const testFiles = readdirSync('./test');
const srcFiles = arrRemoveValues(readdirSync('./src'), ['@types.ts']);

const testFileDict = arrToBoolDict(testFiles);

test.each(srcFiles)(
    'Each "./src" file has a corresponding "./test" file',
    (x) => {
        const name = x.replace(/.ts/, '') + '.test.ts';
        expect(testFileDict).toHaveProperty([name]);
});

console.log(testFiles);
console.log(srcFiles);

test('HELLO WORLD', () => {

});

// test.each(testFiles)(
//     'Each "./test" file tests each of corresponding "./src" file util functions',
//     (x) => {
//         const name = x.replace(/.test.ts/, '.ts');
//         const utilFuncts = import(`./src/${name}`);
//         const testFuncts = import(`./test/${x}`);
//         const testNames = objKeys(testFuncts);

//         expect(utilFuncts).toHaveProperty('', testNames);
//     }
// )

// *** check if each function has a corresponding test
