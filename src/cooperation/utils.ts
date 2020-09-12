import {baseTestResultType, IDescWithRange, IDescWithStatus, IOctant, ITendency} from "./types";
import {octantCodeList} from "./UserResult";

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

export function getPersonProfile(testResult: baseTestResultType): ITendency[] {
    const values = testResult.map(item => {
        let pos = 0;
        let neg = 0;
        item.forEach(value => {
            if (value > 0) {
                pos += value;
            } else {
                neg += value * -1;
            }
        });
        return [neg, pos];
    });

    return [
        {index: 0, value: values[1][0]},
        {index: 1, value: values[4][0]},
        {index: 2, value: values[0][0]},
        {index: 3, value: values[2][1]},
        {index: 4, value: values[1][1]},
        {index: 5, value: values[4][1]},
        {index: 6, value: values[0][1]},
        {index: 7, value: values[2][0]},
    ];

}

export function getPersonPortrait(profile: ITendency[]): IOctant[] {

    const codeList = octantCodeList

    const axisValues = profile.map(item => item.value);
    const axisValuesReversed = [...axisValues.reverse()];

    const octantsValues: number[] = [];
    for (let i = 0; i < axisValuesReversed.length; i++) {
        if (i === axisValues.length - 1) {
            octantsValues.unshift(axisValuesReversed[i] * axisValuesReversed[0] * 0.7071 / 2);
            break;
        }
        octantsValues.push(axisValuesReversed[i] * axisValuesReversed[i + 1] * 0.7071 / 2);
    }

    //octant names begin with aggression and go in reverse order. So, change order values
    const swappedValues = [...octantsValues.slice(4), ...octantsValues.slice(0, 4)];

    return swappedValues.map((value, i) => {
        return {code: codeList[i], index: i, value: Number(value.toFixed(2))};
    });
}