import { equal, JsType } from '.';
import { JsTypeFind, objVals, type } from '.';

/** Check if `x` is equal to any of the values in the array. */
export const equalAny = (x: any, equals: any[]) => !!equals.find((y) => equal(x, y));

/**
 * Checks if object has the key, made as a function for type transfer.
 *
 * Uses `obj.hasOwnProperty(key)` instead of `key in obj`
 *
 * https://stackoverflow.com/questions/13632999/if-key-in-object-or-ifobject-hasownpropertykey
 */
export const hasKey = <
    K extends (string | number)
>(obj: any, key: K): obj is { [P in K]: any } =>
  isType(obj, 'object') && obj.hasOwnProperty(key);

/** Checks if object has keys from an array of keys, made as a function for type transfer */
export function hasKeys<
  K extends (string | number)
>(obj: any, keys: K[]): obj is { [P in K]: any } {
  if (!isType(obj, 'object')) return false;

  for (const key of keys)
    if (!obj.hasOwnProperty(key)) return false;

  return true;
}

/**
 * The function will test if the type of the first
 * argument equals testType. Argument testType is a string
 * representing a javascript type.
 *
 * @param val value to be tested
 * @param testType to check if typeof val === testType
 * @example
 * ```js
 * isType([], 'array') //=> true
 * isType(null, 'undefined') //=> false
 * ```
 */
export const isType = <T extends JsType> (
  val: any, testType: T
): val is JsTypeFind<T> => type(val) === testType;

/** any of the values in the first "example" return `true`
 * @example
 * ```js
 * nullOrEmpty(null | undefined | '' | [ ] | { }) //=> true
 * nullOrEmpty([1, 2] | { key: 'value' } | true) //=> false
 * ```
 */
export function nullOrEmpty(x: any): boolean
{
  // null || undefined
  if (nonValue(x)) return true;

  // (string || array).length === 0
  if (isType(x, 'string') || isType(x, 'array')) return !x.length;

  // object // { key: 'val' } => false, { } => true
  if (isType(x, 'object')) return !objVals(x).length;

  return false;
}

/** val `is` (null || undefined) */
export const nonValue = (val: any): val is (null | undefined) =>
  val === null || val === undefined;

export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
