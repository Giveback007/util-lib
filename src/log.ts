import 'source-map-support/register';
// -- SOURCE MAP SUPPORT FOR STACK TRACES -- //

import colors = require('colors/safe');
import { parse as parseStack } from 'stack-trace';
import { type } from './general';

/**
 * @param dt instance of Date obj
 * @returns `hh:mm:ss:ms` eg: `23:27:56:150`
 */
export function timeString(dt = new Date()) {
    const h = ('0' + dt.getHours()).slice(-2);
    const m = ('0' + dt.getMinutes()).slice(-2);
    const s = ('0' + dt.getSeconds()).slice(-2);
    const ms = ('00' + dt.getMilliseconds()).slice(-3);
    return `${h}:${m}:${s}:${ms}`;
}

/**
 * Make sure to escape the slashes
 * @param srcFolder - eg: '/src/'
 */
export const logNodeErrInit = (srcFolder: string) => (e: any) => {
    const src = srcFolder.replace(/[/]/g, '\\');
    const stack = parseStack(Error()); stack.shift();

    console.log(
        colors.red('Err: ' + timeString() + ' || '),
        type(e) === 'object' && e.stack ? e.message : e,
    );

    console.group();

    // *** console.groupCollapsed(); ***
    // *** console.group(); ***
    // -- Stack Trace -- //
    stack.forEach((x, i) => {
        const name = x.getFileName();
        const col = x.getColumnNumber();
        const line = x.getLineNumber();

        if (!name) return console.log(
            colors.red((`   ${i}:`).slice(-4)),
            colors.grey(x.getFunctionName()),
        );

        let isSrc = false;
        let idx = name.indexOf('\\node_modules');

        if (idx === -1) {
            const srcIdx = name.indexOf(src);
            isSrc = srcIdx !== -1;
            idx = isSrc ? srcIdx + 1 : 0;
        } else idx++;

        console.log(
            colors[isSrc ? 'cyan' : 'red']((`   ${i}:`).slice(-4)),
            colors[isSrc ? 'white' : 'grey'](name.substr(idx)) + ':' + colors.blue(line + ':' + col),
        );
    });

    console.groupEnd();
};

export const logNoteUtil: Console['log'] = (() => {
    const context = colors.cyan('Log: ' + timeString() + ' ||');
    return Function.prototype.bind.call(console.log, console, context);
})();
