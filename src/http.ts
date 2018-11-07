// https://github.com/camsong/fetch-jsonp
import * as fetchJsonp from 'fetch-jsonp';

// TODO: create this to be useable w/o 'fetch-jsonp'
export const jsonp = async <T = any>(url: string): Promise<T> => (await fetchJsonp(url)).json();
