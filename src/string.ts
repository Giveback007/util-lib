/** Checks if string includes a substring */
export const strIncludes = (str: string, subStr: string) => str.indexOf(subStr) !== -1;

export const strRemove = (str: string, remove: string) => str.replace(new RegExp(remove, 'g'), '');
