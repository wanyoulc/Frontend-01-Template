import { isDate, isObject, isArray } from "./util";

export function buildURL(url: string, params?: any) {
    if (!params) {
        return url;
    }
    // 丢弃url中的hash#
    const hashIndex = url.indexOf("#");
    if (hashIndex !== -1) {
        url = url.substring(0, hashIndex);
    }

    const parts: string[] = [];

    function _buildURLWithKV(url: string, k: string, v: any) {
        if (isArray(v)) {
            for (let el of v) {
                _buildURLWithKV(url, k + "[]", el);
            }
        }
        k = encodeURIComponent(k);
        if (isObject(v)) {
            v = JSON.stringify(v);
        } else if (isDate(v)) {
            v = v.toISOString();
        }
        parts.push(k + "=" + encodeURIComponent(v));
    }
    Object.keys(params).forEach(key => {
        _buildURLWithKV(url, key, params[key]);
    });
    const serializedParams = parts.join("&");
    if (serializedParams) {
        const hashIndex = url.indexOf("#");
        if (hashIndex !== -1) {
            url = url.substring(0, hashIndex);
        }

        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}
