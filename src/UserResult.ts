export type baseTestResultType = number[][];
export interface IDescWithRange {desc: string, range: [number, number]}
export interface IOctant {code: string, index: number, value: number}
export interface ITendency {index: number, value: number}

export interface IUserResult {
    testResult: baseTestResultType
    octantCodeList: string[]
    sortedOctants: IOctant[]
    profile: ITendency[]
    portrait: IOctant[]
    mainOctant: IOctant
    mainPsychoTypeList: number[]
    mainTendencyList: number[]
    // getDescByRange: (value: number, descList: IDescWithRange[]) => string
    // getIndexByRange: (value: number, descList: IDescWithRange[]) => number
}

export class UserResult {

    readonly testResult: baseTestResultType
    readonly octantCodeList: string[]
    readonly sortedOctants: IOctant[]
    readonly profile: ITendency[]
    readonly portrait: IOctant[]
    readonly mainOctant: IOctant
    readonly mainPsychoTypeList: number[]
    readonly mainTendencyList: number[]

    constructor(testResult: baseTestResultType) {
        this.testResult = testResult
        this.octantCodeList = ['A1', 'A2', 'B1', 'B2', 'a1', 'a2', 'b1', 'b2']
        this.profile = UserResult.getProfile(this.testResult)
        this.portrait = UserResult.getPortrait(this.profile)
        this.sortedOctants = [...this.portrait].sort((a, b) => (b.value - a.value))
        this.mainOctant = this.sortedOctants[0]
        this.mainPsychoTypeList = this.getMainPsychoType()
        this.mainTendencyList = this.getMainTendency()
    }

    static getProfile = (testResult: baseTestResultType): ITendency[] => {
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

    static getPortrait = (profile: ITendency[]): IOctant[] => {

       const codeList = ['A1', 'A2', 'B1', 'B2', 'a1', 'a2', 'b1', 'b2']

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

    getMainPsychoType(): number[] {

        if (this.sortedOctants[0].value - this.sortedOctants[1].value < .2 * this.sortedOctants[0].value) {
            return [this.sortedOctants[0].index, this.sortedOctants[1].index];
        }
        return [this.sortedOctants[0].index];
    }

    getMainTendency(): number[] {

        const sortedProfile = [...this.profile].sort((a, b) => b.value - a.value);
        const value1 = sortedProfile[0].value;
        const value2 = sortedProfile[1].value;
        const diff: number = value1 * 0.2; // difference between 1st and 2nd max values

        if (value1 - value2 < diff) {
            return [sortedProfile[0].index, sortedProfile[1].index];
        }
        return [sortedProfile[0].index];
    }

    static getDescByRange = (value: number, descList: IDescWithRange[]): string => {

        let desc = '';

        for (const item of descList) {
            if (value > (item.range[0]) && value <= (item.range[1])) {
                desc = item.desc
            }
        }
        return desc
    }

    static getIndexByRange = (value: number, descList: IDescWithRange[]): number => {

        for (let i = 0; i < descList.length; i++) {
            if (value > (descList[i].range[0]) && value <= (descList[i].range[1])) {
                return i;
            }
        }
        return -1
    }
}