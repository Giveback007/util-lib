/** Checks if string includes a substring */
export const strIncludes = (str: string, subStr: string) =>
    str.indexOf(subStr) !== -1;

export const strRemove = (str: string, remove: string | RegExp) =>
    str.replace(new RegExp(remove, 'g'), '');

// export const minAppend = (
//     item: string | number, length: number, append = '0'
// ) => {
//     item = item + '';
//     if (length < 1) console.error(length, 'length can not be less than 1');
//     if (item.length > length) console.error(item, 'item can not exceed length');

//     return (append.repeat(length - 1) + item).slice(-(length))
// }

export const minAppend = (
    item: string | number, length: number, append = '0'
) => (append.repeat(length - 1) + item).slice(-(length));
