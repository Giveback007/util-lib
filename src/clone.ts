/* tslint:disable */
// original source from:
// https://github.com/davidmarkclements/rfdc

/** Performances deep clone of a given object */
export function clone<T>(o: T): T {
    var c, x, l, i, k: any, a: any, q: any;
    if (typeof o !== 'object' || o === null) return o;
    if (o instanceof Date) return new Date(o) as any;

    x = Object.keys(o); l = x.length;

    if (Array.isArray(o)) {
        a = new Array(l)
        for (i = 0; i < l; i++) {
            k = x[i]; c = o[k];
            if (typeof c !== 'object' || c === null) a[k] = c;
            else if (c instanceof Date) a[k] = new Date(c);
            else a[k] = clone(c);
        }
        return a;
    }

    q = {};

    for (i = 0; i < l; i++) {
        k = x[i]; c = (o as any)[k];
        if (Object.hasOwnProperty.call(o, k) === false) continue;
        if (typeof c !== 'object' || c === null) q[k] = c;
        else if (c instanceof Date) q[k] = new Date(c);
        else q[k] = clone(c);
    }
    return q;
}
