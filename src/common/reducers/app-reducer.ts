// import {
//     SET_COMPARISON_READY, SET_USERS_RESULTS
// } from "../actions/actionTypes";
//
// const APP_STATE = {
//     type: '',
//     isComparisonResultReady: false,
//     user1: {
//         data: [],
//     },
//     user2: {
//         data: [],
//     },
// };
//
// type AppReducerType = typeof APP_STATE;
//
// export const appReducer = (state = APP_STATE, {
//     type,
//     isComparisonResultReady,
//     userData1,
//     userData2,user
// }: any) => {
//     switch (type) {
//         case SET_COMPARISON_READY :
//             return {
//                 ...state,
//                 isComparisonResultReady,
//             };
//         case SET_USERS_RESULTS :
//             return {
//                 ...state,
//                 user1: {
//                     data: userData1
//                 },
//                 user2: {
//                     data: userData2
//                 },
//             };
//         default:
//             return state;
//     }
// };