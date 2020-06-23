import React, {useState, useEffect} from 'react';
import InputField from "./input-field/InputField";
import {useDispatch} from 'react-redux';
import {setComparisonResult, setUsersResults} from '../../../../actions/actionCreator';
import {BrowserRouter} from "react-router-dom";
import qs from 'qs';

// import {SchemeType} from '../../../../../helper/UserResult'
// import Loader from "../../loaders/loader/Loader";
import {isBase64} from "../../../../../helper/helper";


//EXAMPLE SEE HERE https://www.carlrippon.com/building-super-simple-react-form-component-typescript-basics/


interface IUsersLocalState {
    user1: {
        data: string
        isError: boolean
    }
    user2: {
        data: string
        isError: boolean
    }
}

interface ICompareInputProps {
    location: any
    // schemeCurrent: SchemeType
}

const CompareInput: React.FC<ICompareInputProps> = ({...props}) => {

    // const userData1: any = useSelector((state: any) => state.compareReducer.user1.data)
    // const userData2: any = useSelector((state: any) => state.compareReducer.user2.data)
    const dispatch = useDispatch()

    const [localState, setLocalState] = useState<IUsersLocalState>({
        user1: {
            data: 'paste code for first user here',
            isError: false
        },
        user2: {
            data: 'paste code for second user here',
            isError: false
        }
    })

    console.log(localState)

    let userDataQS: string = '';
    useEffect(() => {
        if(typeof window !== 'undefined') {
            let query = qs.parse(window.location.search);
            if (query.encdata) {
                //@ts-ignore
                userDataQS = query.encdata;
                setLocalState({
                    ...localState,
                    user1: {
                        ...localState.user1,
                        data: userDataQS
                    }
                })
            }
        }
    },[localState.user1.data])



    return (
        <form onSubmit={submitCompare}>
            <div className={`row between-xs`}>
                <InputField
                    label={'User 1'}
                    name={'user1'}
                    id={'user1'}
                    value={localState.user1.data}
                />
                <InputField
                    label={'User 2'}
                    name={'user2'}
                    id={'user2'}
                    value={localState.user2.data}
                />
            </div>
            <button type='submit'>Compare!</button>
        </form>
    );

    function submitCompare(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const userValue1 = e.target['user1'].value;
        const userValue2 = e.target['user2'].value;

        const {user1, user2} = decodeAndValidateUsersData(userValue1, userValue2)

        decodeAndValidateUsersData(userValue1, userValue2)

        setLocalState({
            user1: {...localState.user1, data: userValue1, isError: !user1.isValid},
            user2: {...localState.user2, data: userValue2, isError: !user2.isValid}
        })

        if (user1.isValid && user2.isValid) {
            dispatch(setComparisonResult(true))
            dispatch(setUsersResults(user1.data, user2.data))
            return;
        } else if (!user1.isValid && !user2.isValid) {
            dispatch(setUsersResults([], []))
        } else if (!user1.isValid && user2.isValid) {
            dispatch(setUsersResults([], []))
        } else if (user1.isValid && !user2.isValid) {
            dispatch(setUsersResults([], []))
        }

        dispatch(setComparisonResult(false))
    }

    function decodeAndValidateUsersData(value1: string, value2: string): any {

        //TODO needs to better validation!!!
        const userDataString1: string = isBase64(value1) ? atob(value1) : '{}';
        const userDataString2: string = isBase64(value2) ? atob(value2) : '{}';
        const userDataArr1: [] = JSON.parse(userDataString1)
        const userDataArr2: [] = JSON.parse(userDataString2)

        return {
            user1: {
                data: userDataArr1,
                isValid: validateStringData(userDataString1)
            },
            user2: {
                data: userDataArr2,
                isValid: validateStringData(userDataString2)
            }
        }
    }

    function validateStringData(value: string): boolean {

        //TODO needs improvement
        const regex = /^\[\[([+-]?\d,?){3}],\[(\[([+-]?\d,?){5}],?){5}\]\]$/

        return value.search(regex) === 0
    }
}

export default CompareInput;