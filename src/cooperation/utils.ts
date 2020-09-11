import {IDescWithRange, IDescWithStatus} from "./types";

export const getDescByRange = (value: number, descList: { title: string, variants: IDescWithRange[] }): IDescWithStatus => {

    let desc = ''
    let index = null

    for (let i = 0; i < descList.variants.length; i++) {
        if (value > (descList.variants[i].range[0]) && value <= (descList.variants[i].range[1])) {
            desc = descList.variants[i].desc
            index = i
            break
        }
    }
    const status = index === 0 ? 0 : (index === descList.variants.length ? 2 : 1)
    return {title: descList.title, desc, status}
}

export const getIndexByRange = (value: number, descList: IDescWithRange[]): number => {

    for (let i = 0; i < descList.length; i++) {
        if (value > (descList[i].range[0]) && value <= (descList[i].range[1])) {
            return i;
        }
    }
    return -1
}


export function getKeyResult(value: number, results: string[]): string {
    if (value < .2) {
        return results[0]
    } else if (value >= .2 && value < .5) {
        return results[1]
    } else if (value >= .5 && value < .8) {
        return results[2]
    } else {
        return results[3]
    }
}