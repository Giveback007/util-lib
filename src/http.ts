import { Dict, str } from "./@types";
import { nonVal } from "./test";

export function joinParamsToUrl(
    url: string,
    searchParams: Dict<string | number | undefined | null>,
) {
    const u = new URL(url);

    Object.entries(searchParams).forEach(([key, value]) =>
        !nonVal(value)
        &&
        u.searchParams.append(key, value as string)
    );

    return u.href;
}

export function queryParamsFromUrl<T = Dict<str>>(
    url: str | URL
) {
    if (typeof url === 'string') url = new URL(url);
    const queryParams = {} as T;
    url.searchParams.forEach((val, key) => {
        (queryParams as any)[key] = val
    });

    return queryParams;
}

export async function fetchJSON<T = any, ErrData = any>(
    url: string,
    options: {
        method?: 'GET',
        searchParams?: Dict<string | number | undefined | null>,
        headers?: Dict<string>
    } = {}
) {
    const _url = joinParamsToUrl(url, options.searchParams || {});
    delete options.searchParams;

    if (!options.method) options.method = 'GET';
    if (!options.headers) options.headers = {};
    options.headers['Accept'] = 'application/json';

    type Opt = Omit<typeof options, 'searchParams'>
    let res: Response | undefined = undefined;
    try {
        res = await fetch(_url, options as Opt);
        if (res.ok && res.status === 200) {
            return {
                ok: true as true,
                data: await res.json() as T,
                err: undefined, res
            };
        } else {
            let data: ErrData | undefined;
            try {
                data = await res.json()
            } catch {
                data = undefined;
            }

            return {
                ok: false as false,
                data: data as ErrData | undefined,
                err: new Error(res.statusText),
                res
            };
        }
    } catch(err) {
        console.log(err)
        return {
            ok: false as false,
            data: undefined,
            err: err instanceof Error ? err : new Error(err as any),
            res
        }
    }
}