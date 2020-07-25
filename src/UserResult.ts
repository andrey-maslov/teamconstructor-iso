

export interface SchemeType {
    axes: { mainAxis: string[], subAxes: string[][], correctionFactors: number[] }[]
    octants: { psychotypes: string[], octants: string[] }[]
    additionalParameters: { title: string, desc: string }[]
    fullProfile: { title: string, values: string[], checkValues: number[] }[]
    descriptions: {
        axis: string[],
        psychoTypes: string[][][],
        famous: string[][],
        complex: string[][][]
    }
}

// type resultType = [
//     [number, number, number, number, number],
//     [number, number, number, number, number],
//     [number, number, number, number, number],
//     [number, number, number, number, number],
//     [number, number, number, number, number],
// ]

export type resultType = number[][];

export class UserResult {

    readonly result: resultType;
    readonly correctedResult: resultType;
    readonly scheme: SchemeType;
    readonly letterIndexes: string[];
    readonly octantsTitles: string[];
    readonly sortedOctants: { title: string, value: number, index: string }[];
    readonly profile: [string, number][];
    readonly mainOctantTitle: string;

    constructor(result: resultType, scheme: SchemeType) {
        this.result = result;
        this.scheme = scheme;
        this.correctedResult = this.getCorrectedResult();
        this.letterIndexes = ['A1', 'A2', 'B1', 'B2', 'a1', 'a2', 'b1', 'b2'];
        this.octantsTitles = this.getOctantsTitles();
        this.sortedOctants = this.getSortedProfiles();
        this.profile = this.getPsyProfileData();
        this.mainOctantTitle = this.sortedOctants[0].title;
    }

    private getOctantsTitles(): string[] {
        const titles: string[] = [];
        for (let i = 0; i < 4; i++) {
            titles.push(...this.scheme.octants[i].octants);
        }
        return titles;
    }

    // Get the correcting values from the scheme
    // and multiply pure results by them depending on the sign
    private getCorrectedResult(): resultType {
        const allCorrectionFactors: number[][] = [...this.scheme.axes].map(axis => axis.correctionFactors);
        const correctedResult: resultType = [...this.result].map((resultBlock, index) => {
            return resultBlock.map(item => item < 0 ? item * allCorrectionFactors[index][0] : item * allCorrectionFactors[index][1]);
        });

        return correctedResult;
    }

    getPsyProfileData(): [string, number][] {
        let data = this.correctedResult.map(item => {
            let pos: number = 0;
            let neg: number = 0;
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
            [this.scheme.axes[1].mainAxis[0], data[1][0]],
            [this.scheme.axes[4].mainAxis[0], data[4][0]],
            [this.scheme.axes[0].mainAxis[0], data[0][0]],
            [this.scheme.axes[2].mainAxis[1], data[2][1]],
            [this.scheme.axes[1].mainAxis[1], data[1][1]],
            [this.scheme.axes[4].mainAxis[1], data[4][1]],
            [this.scheme.axes[0].mainAxis[1], data[0][1]],
            [this.scheme.axes[2].mainAxis[0], data[2][0]],
        ];

    }

    getManagementData(): (string | number)[][] {
        return [
            [this.scheme.axes[0].subAxes[0][0], (this.correctedResult[0][0] * -1), 3],
            [this.scheme.axes[1].subAxes[3][1], (this.correctedResult[1][3]), 3],
            [this.scheme.axes[2].subAxes[3][0], (this.correctedResult[2][3] * -1), 3],
            [this.scheme.axes[3].subAxes[0][1], (this.correctedResult[3][0]), 4],
            [this.scheme.axes[2].subAxes[1][0], (this.correctedResult[2][1] * -1), 4],
        ];
    }

    getLeaderData(): [string, number][] {
        const data = [...this.getPsyProfileData()];
        return [
            data[4],
            data[3],
            data[2],
            data[1],
            data[0],
            data[7],
            data[6],
            data[5],
        ];
    }

    getTeamSurvivalData(): (string | number)[][] {
        return [
            [this.scheme.axes[1].subAxes[1][0], (this.correctedResult[1][1] * -1), -1],
            [this.scheme.axes[1].subAxes[2][0], (this.correctedResult[1][2] * -1), 1],
            [this.scheme.axes[3].subAxes[3][1], (this.correctedResult[3][3]), 1],
            [this.scheme.axes[3].subAxes[4][0], (this.correctedResult[3][4] * -1), 1],
            [this.scheme.axes[4].subAxes[4][0], (this.correctedResult[4][4] * -1), 1],
        ];
    }

    getSelfOrganizationData(): (string | number)[][] {
        return [
            [this.scheme.axes[3].subAxes[2][1], (this.correctedResult[3][2]), 1],
            [this.scheme.axes[2].subAxes[0][0], (this.correctedResult[2][0] * -1), 1],
            [this.scheme.axes[2].subAxes[1][0], (this.correctedResult[2][1] * -1), 1],
            [this.scheme.axes[2].subAxes[3][0], (this.correctedResult[2][3] * -1), 1],
            [this.scheme.axes[2].subAxes[4][0], (this.correctedResult[2][4] * -1), 1],
        ];
    }

    getLoyaltyData(): (string | number)[][] {
        return [
            [this.scheme.axes[3].subAxes[1][0], (this.correctedResult[3][1] * -1), 1],
            [this.scheme.axes[0].subAxes[3][1], (this.correctedResult[0][3]), 0],
            [this.scheme.axes[1].subAxes[1][0], (this.correctedResult[1][1] * -1), 1],
            [this.scheme.axes[4].subAxes[3][1], (this.correctedResult[4][3]), 0],
            [this.scheme.axes[1].subAxes[0][0], (this.correctedResult[1][0] * -1), 1],
        ];
    }

    getInitiativeData(): (string | number)[][] {
        return [
            [this.scheme.axes[0].subAxes[0][0], (this.correctedResult[0][0] * -1), 1],
            [this.scheme.axes[2].subAxes[1][1], (this.correctedResult[2][1]), 1],
            [this.scheme.axes[4].subAxes[4][0], (this.correctedResult[4][4] * -1), 1],
            [this.scheme.axes[1].subAxes[1][1], (this.correctedResult[1][1]), 1],
            [this.scheme.axes[1].subAxes[4][1], (this.correctedResult[1][4]), 1],
        ];
    }

    getLearnabilityData(): (string | number)[][] {
        return [
            [this.scheme.axes[0].subAxes[0][0], (this.correctedResult[0][0] * -1), 1],
            [this.scheme.axes[2].subAxes[1][0], (this.correctedResult[2][1] * -1), 1],
            [this.scheme.axes[4].subAxes[4][0], (this.correctedResult[4][4] * -1), 1],
            [this.scheme.axes[4].subAxes[0][0], (this.correctedResult[4][0] * -1), 1],
            [this.scheme.axes[0].subAxes[3][0], (this.correctedResult[0][3] * -1), 1],
        ];
    }

    getConformismData(): (string | number)[][] {
        return [
            [this.scheme.axes[1].subAxes[3][0], (this.correctedResult[1][3] * -1), 1],
            [this.scheme.axes[2].subAxes[4][0], (this.correctedResult[2][4] * -1), 1],
            [this.scheme.axes[2].subAxes[2][0], (this.correctedResult[2][2] * -1), 1],
            [this.scheme.axes[0].subAxes[0][1], (this.correctedResult[0][0]), 1],
            [this.scheme.axes[0].subAxes[3][1], (this.correctedResult[0][3]), 1],
        ];
    }

    getSelfEsteemData(): (string | number)[][] {
        return [
            [this.scheme.axes[1].subAxes[0][1], (this.correctedResult[1][0]), 1],
            [this.scheme.axes[1].subAxes[4][1], (this.correctedResult[1][4]), 1],
            [this.scheme.axes[3].subAxes[2][1], (this.correctedResult[3][2]), 1],
            [this.scheme.axes[4].subAxes[3][1], (this.correctedResult[4][3]), 1],
            [this.scheme.axes[1].subAxes[2][1], (this.correctedResult[1][2]), 1],
        ];
    }

    getConflictData(): (string | number)[][] {
        return [
            [this.scheme.axes[0].subAxes[4][0], (this.correctedResult[0][4] * -1), 2],
            [this.scheme.axes[2].subAxes[3][1], (this.correctedResult[2][3]), 1],
            [this.scheme.axes[3].subAxes[1][1], (this.correctedResult[3][1]), 1],
            [this.scheme.axes[3].subAxes[2][0], (this.correctedResult[3][2] * -1), -1],
            [this.scheme.axes[1].subAxes[1][1], (this.correctedResult[1][1]), 1],
        ];
    }

    getDepressionData(): (string | number)[][] {
        return [
            [this.scheme.axes[1].subAxes[4][0], (this.correctedResult[1][4] * -1), 1],
            [this.scheme.axes[1].subAxes[0][0], (this.correctedResult[1][0] * -1), 1],
            [this.scheme.axes[3].subAxes[2][0], (this.correctedResult[3][2] * -1), 1],
            [this.scheme.axes[0].subAxes[0][1], (this.correctedResult[0][0]), 1],
            [this.scheme.axes[0].subAxes[2][1], (this.correctedResult[0][2]), 1],
        ];
    }

    getAdditionalArr(): { data: (string | number)[][]; title: string; desc: string }[] {
        const params = [...this.scheme.additionalParameters];
        const methods = [
            this.getManagementData(),
            this.getSelfOrganizationData(),
            this.getLoyaltyData(),
            this.getInitiativeData(),
            this.getLearnabilityData(),
            this.getConformismData(),
            this.getSelfEsteemData(),
            this.getConflictData(),
            this.getDepressionData(),
        ];
        return params.map((param, i) => ({data: methods[i], title: param.title, desc: param.desc}));
    }

    getCalculatedOctants(): { title: string, value: number, index: string }[] {

        const axisValues = this.getPsyProfileData().map(item => item[1]);
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

        return [...this.octantsTitles].map((title, i) => {
            return {title: title, value: (+swappedValues[i].toFixed(2)), index: this.letterIndexes[i]};
        });
    }

    private getSortedProfiles(): { title: string, value: number, index: string }[] {
        const profiles = [...this.getCalculatedOctants()];

        return [...profiles].sort((a, b) => (b.value - a.value));
    }

    getMainProfiles(): string[] {

        const data = {...this.scheme.fullProfile[0]};
        const checkValue: number = data.checkValues ? data.checkValues[0] / 100 : 0.2; //%

        if (this.sortedOctants[0].value === 0) {
            return [data.title, 'тест не пройден'];
        }
        if (this.sortedOctants[0].value - this.sortedOctants[1].value < checkValue * this.sortedOctants[0].value) {
            return [data.title, `${this.sortedOctants[0].title}-${this.sortedOctants[1].title}`];
        }
        return [data.title, this.sortedOctants[0].title];
    }

    private getTermByRange(value: number, dataNumber: number): string[] {

        const data = {...this.scheme.fullProfile[dataNumber]};
        const checkValues: number[] = data.checkValues;

        if (value <= checkValues[0]) {
            return [data.title, data.values[0]];
        }
        if (value > checkValues[0] && value < checkValues[1]) {
            return [data.title, data.values[1]];
        }
        return [data.title, data.values[2]];
    }

    getSeverity(): string[] {
        const value = this.sortedOctants[0].value;
        return this.getTermByRange(value, 1);
    }

    getRelBuilding(): string[] {
        const value: number = this.correctedResult[3][4];
        return this.getTermByRange(value, 2);
    }

    getRelAccept(): string[] {
        const value: number = this.correctedResult[3][3];
        return this.getTermByRange(value, 3);
    }

    getNeuroticismValue(): string[] {
        const value: number = this.correctedResult[3][2];
        return this.getTermByRange(value, 4);
    }

    getStressAdaptability(): string[] {
        const value = this.profile[0][1] + this.profile[1][1] + this.profile[7][1];
        return this.getTermByRange(value, 5);
    }

    getMotivation(): string[] {
        const data = {...this.scheme.fullProfile[6]};
        for (let i = 0; i < 8; i++) {
            if (this.mainOctantTitle === this.octantsTitles[i]) {
                return [data.title, data.values[i]];
            }
        }
        return [data.title, 'not detected'];
    }

    private getTermByIncluding(dataNumber: number): string[] {
        const data = {...this.scheme.fullProfile[dataNumber]};
        for (let i = 0; i < 4; i++) {
            if (this.scheme.octants[i].octants.includes(this.mainOctantTitle)) {
                return [data.title, data.values[i]];
            }
        }
        return [data.title, 'not detected'];
    }

    getThinkingStyle(): string[] {
        return this.getTermByIncluding(7);
    }

    getTendencies(): string[] {
        const data = {...this.scheme.fullProfile[8]};
        const checkValue: number = data.checkValues ? data.checkValues[0] / 100 : 0.2; //%

        const sortedProfile = [...this.profile].sort((a, b) => b[1] - a[1]);
        if (sortedProfile[0][1] === 0) {
            return [data.title, 'тест не пройден'];
        }
        if (sortedProfile[0][1] - sortedProfile[1][1] < checkValue * sortedProfile[0][1]) {
            return [data.title, `${sortedProfile[0][0]}, ${sortedProfile[1][0]}`];
        }
        return [data.title, sortedProfile[0][0]];
    }

    getLeadingEmotion(): string[] {
        return this.getTermByIncluding(9);
    }

    getReactionType(): string[] {
        return this.getTermByIncluding(10);
    }

    private getTermByTable(tableData: (string | number)[][], dataNumber: number): string[] {
        const data = {...this.scheme.fullProfile[dataNumber]};
        const valuesArr: number[] = tableData.map(item => +item[1]);
        const checkValues: number[] = data.checkValues;
        const accumulator = valuesArr.reduce((a, b) => a + b);

        // console.log(this.profile)

        if (checkValues.length < 1 || checkValues.length > 2) {
            console.error('check number of your values and check values. Must be 3/2 or 2/1');
            return [data.title, 'error'];
        }

        if (checkValues.length === 2) {
            if (accumulator < checkValues[0]) {
                return [data.title, data.values[0]];
            }
            if (accumulator >= checkValues[0] && accumulator <= checkValues[1]) {
                return [data.title, data.values[1]];
            }
            return [data.title, data.values[2]];
        }

        if (accumulator < checkValues[0]) {
            return [data.title, data.values[0]];
        }
        return [data.title, data.values[1]];

    }

    getEfficiency(): string[] {
        return this.getTermByTable(this.getManagementData(), 11);
    }

    getLeadershipSkills(): string[] {

        const data = {...this.scheme.fullProfile[12]},
            profile = [...this.profile],
            as = profile[3][1] + profile[4][1], // aggressiveness + spontaneity
            ee = profile[1][1] + profile[2][1], // extraversion + emotiveness
            value = as + ee,
            probably = (profile[3][1] < 5 || profile[4][1] < 5 || profile[1][1] < 5 || profile[2][1] < 5) ? `${data.values[5]}, ` : '';
        let text: string = '';

        if (value < data.checkValues[0]) {
            text = `${probably}${data.values[0]}`;
            return [data.title, text];
        }
        if (value > data.checkValues[1]) {
            text = (as >= ee) ?
                `${probably}${data.values[2]} ${data.values[1]}-${data.values[3]}` :
                `${probably}${data.values[2]} ${data.values[1]}-${data.values[4]}`;
            return [data.title, text];
        }
        text = (as >= ee) ?
            `${probably}${data.values[1]}-${data.values[3]}` :
            `${probably}${data.values[1]}-${data.values[4]}`;
        return [data.title, text];
    }

    getTeamSurvival(): string[] {
        return this.getTermByTable(this.getTeamSurvivalData(), 13);
    }

    getSelfOrganization(): string[] {
        return this.getTermByTable(this.getSelfOrganizationData(), 14);
    }

    getLoyalty(): string[] {
        return this.getTermByTable(this.getLoyaltyData(), 15);
    }

    getInitiative(): string[] {
        return this.getTermByTable(this.getInitiativeData(), 16);
    }

    getLearnability(): string[] {
        return this.getTermByTable(this.getLearnabilityData(), 17);
    }

    getConformism(): string[] {
        return this.getTermByTable(this.getConformismData(), 18);
    }

    getSelfEsteem(): string[] {
        return this.getTermByTable(this.getSelfEsteemData(), 19);
    }

    getConflict(): string[] {
        return this.getTermByTable(this.getConflictData(), 20);
    }

    getDepression(): string[] {
        return this.getTermByTable(this.getDepressionData(), 21);
    }

    getPsychoDescription(): string {

        const sortedOctants = [...this.sortedOctants];
        const data = this.scheme.descriptions.psychoTypes;

        // percent of difference of 1st and 2nd max values
        const checkValue: number = 0.1;
        let range = [20, 35];

        const psychoTypeIndex = [...this.letterIndexes].indexOf(sortedOctants[0].index); // get psycho type group index
        const descIndex = this.getIndexByRange(sortedOctants[0].value, range); // get psycho type sub group index

        //proper mono profile
        if (sortedOctants[0].value - sortedOctants[1].value > checkValue * sortedOctants[0].value) {
            return data[psychoTypeIndex][descIndex][0] + ' ' + data[psychoTypeIndex][descIndex][1];
        }

        //proper combined profile
        if (sortedOctants[1].index === sortedOctants[0].index.toUpperCase()) {
            return data[psychoTypeIndex][descIndex][0] + ' ' + data[psychoTypeIndex][3][1];
        }

        //mono profile without pair
        return data[psychoTypeIndex][descIndex][0] + ' ' + data[psychoTypeIndex][descIndex][1];
    }

    //get number of psycho type sub group by range from scheme descriptions psycho types
    private getIndexByRange(value: number, range: number[]): number {
        if (value < range[0]) {
            return 0;
        } else if (value >= range[0] && value <= range[1]) {
            return 1;
        }
        return 2;
    }

    //sex: 0 - male, 1 - female, 2 - some else
    getFamous(sex: number = 0): string | null {
        const sortedOctants = [...this.sortedOctants];
        const data = this.scheme.descriptions.famous;
        const value = sortedOctants[0].value;
        const range = [8.75, 42.35, 140, 218.57];
        let famousNameIndex;

        const famousGroupIndex = [...this.letterIndexes].indexOf(sortedOctants[0].index); // get famous group index

        if (value < range[0] || value > range[range.length - 1]) {
            return null
        }

        if (value >= range[0] && value < range[1]) {
            famousNameIndex = 0;
        } else if (value >= range[1] && value < range[2]) {
            famousNameIndex = 1;
        } else {
            famousNameIndex = 2;
        }

        return data[famousGroupIndex][famousNameIndex].split('/')[sex];
    }

    getComplexData(): string[][] {
        const sortedOctants = [...this.sortedOctants];
        const typesList = this.scheme.descriptions.complex; //psycho types list
        const complexTypeIndex = [...this.letterIndexes].indexOf(sortedOctants[0].index); // complex description index

        return typesList[complexTypeIndex];
    }

}