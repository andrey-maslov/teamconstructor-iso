// resource for handling cookies taken from here:
// https://github.com/carlos-peru/next-with-api/blob/master/lib/session.js

import cookie from 'js-cookie';
import { isBrowser } from "./helper";
import { AnyType } from "../constants/types";

export const setCookie = (key: string, value: string): void => {
    if (isBrowser) {
        cookie.set(key, value, {
            expires: 1,
            path: '/'
        })
    }
}

export const removeCookie = (key: string): void => {
    if (isBrowser) {
        cookie.remove(key, {
            expires: 1
        })
    }
}

export const getCookie = (key: string, req: AnyType): AnyType => {
    return isBrowser
        ? getCookieFromBrowser(key)
        : getCookieFromServer(key, req);
}

export const getCookieFromBrowser = (key: string): AnyType => {
    return cookie.get(key)
}

const getCookieFromServer = (key: string, req: AnyType): AnyType => {
    if (!req.headers.cookie) {
        return undefined
    }
    const rawCookie = req.headers.cookie
        .split(';')
        .find((c: string) => c.trim().startsWith(`${key}=`));
    if (!rawCookie) {
        return undefined;
    }
    return rawCookie.split('=')[1]
}