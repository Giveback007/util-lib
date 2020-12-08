/** Checks if string includes a substring */
export const strIncludes = (str: string, subStr: string) =>
    str.indexOf(subStr) !== -1;

export const strRemove = (str: string, remove: string | RegExp) =>
    str.replace(new RegExp(remove, 'g'), '');

export const minAppend = (
    item: string | number, length: number, append = '0'
) => {
    item = item + '';
    if (length < 1) throw Error('length can not be less than 1');
    if (item.length > length) throw Error('item can not exceed length');

    return (append.repeat(length - 1) + item).slice(-(length))
}
