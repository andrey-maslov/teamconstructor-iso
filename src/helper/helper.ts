import { IDescWithRange } from "../constants/types";
import axios from "axios";
import { getAndDecodeData } from "psychology";

export const stringToBoolean = (string: string) => {
    switch (string.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true;
        case 'false':
        case 'no':
        case '0':
        case null:
            return false;
        default:
            return Boolean(string);
    }
};

// @ts-ignore
export const checkAnswers = (answers: any, callback: any) => {

    for (let i = 0; i < answers.length; i++) {

        if (!answers[i].value) {
            const targetElem: any = document.querySelector(`.visible [data-item-index="${i + 1}"]`);
            targetElem.scrollIntoView({ block: 'center', behavior: 'smooth' });
            console.log('not validated');
            return false;
        }
    }
    console.log('all OK');
    callback();
};

export const parseQueryString = (queryString: string) => {
    let params: any = {},
        temp,
        i,
        l;

    // Split into key/value pairs
    const queries = queryString.replace(/%20/g, ' ').replace('  ', ' ').split('&');

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};

export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Max and Min includes
}

export const getChartLabels = (result: (string | number)[][]): string[] => {
    return result.map(item => item[0].toString());
};

export const getRealData = (result: (string | number)[][]): number[] => {
    return result.map(item => +item[1]);
};

export const getDesiredData = (result: (string | number)[][]): number[] | boolean => {
    if (result[0][2]) {
        return result.map(item => +item[2]);
    } else {
        return false;
    }
};

// export const getMinAndMax = (values: number[]) => {
//     const med = [];
//
//
//     let minVal = Math.min.apply(null, med);
//     let maxVal = Math.max.apply(null, med);
//
//     return [minVal, maxVal]
//
// };

export class Helper {

    static addSpace(nStr: string) {
        nStr += '';
        const x = nStr.split('.');
        let x1 = x[0];
        const x2 = x.length > 1 ? '.' + x[1] : '';
        const rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, `$1\u00A0$2`);
        }
        return x1 + x2;
    }

    static getConvertedSize = (bytes: number, precision = 2) => {
        const units = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];

        if (bytes < 500) {
            return `${bytes} ${units[0]}`;
        }
        let pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
        pow = Math.min(pow, units.length - 1);

        bytes /= Math.pow(1024, pow);

        return `${bytes.toFixed(precision)} ${units[pow]}`;
    };
}

export const stripCountry = (lang: string): string => {
    return lang
        .trim()
        .replace("_", "-")
        .split("-")[0];
}

export const isBase64 = (str: string) => {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

export const toPercent = (value: number, digits?: number): { num: number, str: string } => {
    const val = Number((value * 100).toFixed(digits))
    return {
        num: val,
        str: `${val}%`
    }
}

export const isBrowser: boolean = typeof window !== 'undefined'

export function exitConfirmation() {
    if (isBrowser && location.pathname === '/team') {
        window.onunload = function () {
            return confirm('Вы хотите покинуть сайт?')
        }
        window.onbeforeunload = function () {
            return confirm('Точно хотите выйти?');
        }
    }
}

export function getQueryFromURL(searchStr: string, key: string): string {
    if (!searchStr) return ''
    const queries = searchStr.replace('?', '').split('&')
    const needList = queries.filter(item => item.match(new RegExp(key))).join()
    if (!needList) return ''
    return needList.replace(`${key}=`, '')
}

export function extractEncData(data: string): {
    encoded: string | null, decoded: string | null, data: any | null
} {
    if (!data) {
        return {
            encoded: null,
            decoded: null,
            data: null
        }
    }

    if (getAndDecodeData('', data).data) {
        return getAndDecodeData('', data)
    }
    const query = data.split('?'). slice(1).join()
    const params = parseQueryString(query)
    return getAndDecodeData('', decodeURIComponent(params.encdata))
}

export function isElementInViewport(el: any) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document. documentElement.clientWidth)
    )
}

export function trimEmailInObj(object: any) {
    if (typeof object !== 'object') {
        return object
    }
    const regex = /^(?!['`])\s*[-+.'\w]+@[-.\w]+\.[-.\w]+\s*$/i
    for(const key in object) {
        if (typeof object[key] === 'string' && object[key].match(regex)) {
            object[key] = object[key].trim();
        }
    }
    return object
}