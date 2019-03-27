import 'source-map-support/register';
// -- SOURCE MAP SUPPORT FOR STACK TRACES -- //

import colors = require('colors/safe');
import { parse as parseStack } from 'stack-trace';

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

export function logNodeErr(e: any) {
    const err = e instanceof Error ? e : new Error(e);

    console.log(
        colors.red('Err: ' + timeString() + ' || '),
        e.stack ? e.message : e,
    );

    // -- Stack Trace -- //
    parseStack(err).forEach((x, i) => {
        const name = x.getFileName();
        const col = x.getColumnNumber();
        const line = x.getLineNumber();

        let srcIdx = name.indexOf('\\src');
        srcIdx = srcIdx !== -1 ? srcIdx + 1 : 0;

        console.log(
            colors[srcIdx ? 'cyan' : 'red']((`   ${i}:`).slice(-4)),
            colors[srcIdx ? 'white' : 'grey'](name.substr(srcIdx)) + ':' + colors.blue(line + ':' + col),
        );
    });
}

export const logNoteUtil = (x: any) => {
    const isString = x instanceof String;

    const message = colors.cyan('Log: ' + timeString() + ' || ' + isString ? x : '');
    const arr = isString ? [message] : [message, x];

    console.log(...arr);
};
