/** Checks if string includes a substring */
export const strIncludes = (str: string, subStr: string) =>
    str.indexOf(subStr) !== -1;

export const strRemoveAll = (str: string, remove: string | RegExp) =>
    str.replace(new RegExp(remove, 'g'), '');
