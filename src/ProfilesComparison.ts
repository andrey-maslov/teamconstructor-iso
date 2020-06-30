// import {SchemeType, UserResult} from "./UserResult";
//
// import {useTranslation} from "react-i18next";
//
// export type PersonalInfoType = Array<number>
// export type TestResultType = Array<number[]>
// export type FullResultType = [PersonalInfoType, TestResultType]
//
// export class ProfilesComparison {
//
//     readonly scheme: SchemeType;
//     readonly userData1: FullResultType;
//     readonly userData2: FullResultType;
//     readonly userProfile1: any;
//     readonly userProfile2: any;
//
//     constructor(scheme: SchemeType, userData1: FullResultType, userData2: FullResultType, ...rest: FullResultType[]) {
//         this.scheme = scheme
//         this.userData1 = userData1
//         this.userData2 = userData2
//         this.userProfile1 = new UserResult(this.userData1[1], this.scheme)
//         this.userProfile2 = new UserResult(this.userData2[1], this.scheme)
//     }
//
//
//     getComparisonData() {
//
//         const {t} = useTranslation()
//
//         const complexData1 = this.userProfile1.getComplexData()
//         const complexData2 = this.userProfile1.getComplexData()
//
//         //Получаем вывод о соотношении интенсивностей
//         const intensityRatio: any = this.getIntensityRatio()
//         console.log(intensityRatio)
//
//         const commonComplexData: string[][] = [
//             [t('main_page.pretitle'), intensityRatio],
//             [complexData1[3][0], `${complexData1[3][0]} Профиль 1 - ${complexData1[3][1]},</br> ${complexData1[3][0]} Профиль 2 - ${complexData2[3][1]}`],
//             [complexData1[4][0], `${complexData1[4][0]} Профиль 1 - ${complexData1[4][1]},</br> ${complexData1[4][0]} Профиль 2 - ${complexData2[4][1]}`],
//             [complexData1[6][0], `${complexData1[6][0]} Профиль 1 - ${complexData1[6][1]},</br> ${complexData1[6][0]} Профиль 2 - ${complexData2[6][1]}`],
//         ]
//
//
//
//
//         return [...commonComplexData]
//     }
//
//     //Получаем вывод о соотношении интенсивности ведущих тенденций (у каждого профиля по одной). Разница в процентах
//     getIntensityRatio(): string {
//         const checkValues: number[] = [25,40];
//         const conclusions: string[] = ['Характеры совместимы', 'Совместимость затруднена', 'Совместимость характеров проходит очень сложно']
//
//         const sortedProfile1 = [...this.userProfile1.profile].sort((a, b) => b[1] - a[1]);
//         const sortedProfile2 = [...this.userProfile2.profile].sort((a, b) => b[1] - a[1]);
//
//         const maxValue1 = sortedProfile1[0][1]
//         const maxValue2 = sortedProfile2[0][1]
//
//         let diff: number | null = null;
//         let users: string[] = ['Пользователь 1', 'Пользователь 2'];
//
//         if ((maxValue1 - maxValue2) >= 0) {
//             diff = Math.round((1 - maxValue2 / maxValue1) * 100)
//         } else {
//             diff = Math.round((1 - maxValue1 / maxValue2) * 100);
//             users = ['Пользователь 2', 'Пользователь 1']
//         }
//
//         if (diff < checkValues[0]) {
//             return `У ${users[0]} свойства характера проявляется более интенсивно,чем у ${users[1]}, на ${diff}%. ${conclusions[0]}`
//         }
//         if (diff > checkValues[2]) {
//             return `У ${users[0]} свойства характера проявляется более интенсивно,чем у ${users[1]}, на ${diff}%. ${conclusions[2]}`
//         }
//
//         return `У ${users[0]} свойства характера проявляется более интенсивно,чем у ${users[1]}, на ${diff}%. ${conclusions[1]}`
//     }
// }