import { StackFrame } from 'stack-trace';
// -- SOURCE MAP SUPPORT FOR STACK TRACES -- //

import colors = require('colors/safe');

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

let logNodeErrInitExportable: (srcFolder: string) => (e: any) => void =
    (_x) => (_y) => undefined;

if (typeof window === 'undefined') {
    // tslint:disable-next-line: no-var-requires
    require('source-map-support').install({ environment: 'node' });
    // tslint:disable-next-line: no-var-requires
    const { parse: parseStack } = require('stack-trace');

/**
 * Make sure to escape the slashes
 * @param srcFolder - eg: '/src/'
 */
    logNodeErrInitExportable = (srcFolder: string) => (e: any) => {
        const src = srcFolder.replace(/[/]/g, '\\');

        const { stack, message } = (() => {
            let m: any;
            let s: StackFrame[];

            if (e instanceof Error) {
                m = e.message;
                s = parseStack(e);
            } else {
                m = e;
                s = parseStack(Error());
                s.shift();
            }

            return { stack: s, message: m };
        })();

        console.log(colors.red('Err: ' + timeString() + ' || '), message);

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
    };
}

export const logNodeErrInit = logNodeErrInitExportable;

export const logNoteUtil: Console['log'] = (() => {
    const context = colors.cyan('Log: ' + timeString() + ' ||');
    return Function.prototype.bind.call(console.log, console, context);
})();
