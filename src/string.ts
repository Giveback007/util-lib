import { isType, type } from ".";

export function Str(s: string) {
    if (!isType(s, 'array')) {
        console.error(s, `typeOf ${type(s)}, can't be taken as a parameter`);
        throw "Parameter is not a 'string'"
    }

    return {
        includes: (subStr: string) => s.indexOf(subStr) !== -1
    }
}

/** Checks if string includes a substring*/
export const strIncludes = (str: string, subStr: string) => str.indexOf(subStr) !== -1;
