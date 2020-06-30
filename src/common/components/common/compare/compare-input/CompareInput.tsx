import React, {useState} from 'react';
import InputField from "./input-field/InputField";
import {useDispatch} from 'react-redux';
import {setComparisonResult, setUsersResults} from '../../../../actions/actionCreator';

// import Loader from "../../loaders/loader/Loader";

import {getAndDecodeData, validateDecodedData} from 'encoded-data-parser';
import Button from "../../buttons/button/Button";
import {GoRocket} from "react-icons/go";

import style from './compare-input.module.scss';

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

}

const CompareInput: React.FC<ICompareInputProps> = () => {

    const dispatch = useDispatch()

    const userDataFromURL = getAndDecodeData().encoded;

    const userData1 = userDataFromURL ? userDataFromURL : '';

    const [localState, setLocalState] = useState<IUsersLocalState>({
        user1: {
            data: userData1,
            isError: false
        },
        user2: {
            data: '',
            isError: false
        }
    })


    return (
        <form onSubmit={submitCompare}>
            <div className={`row between-xs ${style.fields}`}>
                <InputField
                    label={'User 1'}
                    name={'user1'}
                    id={'user1'}
                    value={localState.user1.data}
                    placeholder={'Put data for user 1 here'}
                />
                <InputField
                    label={'User 2'}
                    name={'user2'}
                    id={'user2'}
                    value={localState.user2.data}
                    placeholder={'Put data for user 2 here'}
                />
            </div>
            <div className="row center-xs">
                <Button
                    title={'Compare'}
                    startIcon={<GoRocket/>}
                    handle={() => {}}
                    btnClass={'btn-outlined'}
                />
            </div>
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
            return;
        } else if (!user1.isValid && user2.isValid) {
            dispatch(setUsersResults([], []))
            return;
        } else if (user1.isValid && !user2.isValid) {
            dispatch(setUsersResults([], []))
            return;
        }

        dispatch(setComparisonResult(false))
    }

    function decodeAndValidateUsersData(value1: string, value2: string): any {

        const userDataArr1: [] | null = getAndDecodeData('', value1).data
        const userDataArr2: [] | null = getAndDecodeData('', value2).data

        return {
            user1: {
                data: userDataArr1,
                isValid: userDataArr1 !== null
            },
            user2: {
                data: userDataArr2,
                isValid: userDataArr2 !== null
            }
        }
    }
}

export default CompareInput;