import React, {useState} from 'react';
import InputField from "./input-field/InputField";
import {useDispatch, useSelector} from 'react-redux';
import {setComparisonResult, setUsersResults} from '../../../../actions/actionCreator';

import {FaReact} from 'react-icons/fa'

// import Loader from "../../loaders/loader/Loader";

import {getAndDecodeData} from 'encoded-data-parser';
import Button from "../../buttons/button/Button";
import {GoRocket} from "react-icons/go";

import style from './compare-input.module.scss';
import ProfileGenerator from "./profile-generator/ProfileGenerator";

//EXAMPLE SEE HERE https://www.carlrippon.com/building-super-simple-react-form-component-typescript-basics/


interface IUsersLocalState {
    user1: {
        data: string
        isError: boolean
    }
    user2: {
        data: string
        isError: boolean
    },
    isGenerator: boolean
}

interface ICompareInputProps {

}

const CompareInput: React.FC<ICompareInputProps> = () => {

    const dispatch = useDispatch();
    const rowData1 = useSelector((state: any) => state.pairCoopReducer.user1.rowData);
    const rowData2 = useSelector((state: any) => state.pairCoopReducer.user2.rowData);

    const userDataFromURL = getAndDecodeData().encoded;

    const userData1 = userDataFromURL ? userDataFromURL : rowData1;

    const [localState, setLocalState] = useState<IUsersLocalState>({
        user1: {
            data: userData1,
            isError: false
        },
        user2: {
            data: rowData2,
            isError: false
        },
        isGenerator: false
    })

    const generateAndSet1 = (data: any) => {
        setLocalState({
            ...localState,
            user1: {...localState.user1, data: data},
        })
    }

    const onChangeHandler1 = (e: any) => {
        setLocalState({
            ...localState,
            user1: {...localState.user1, data: e.target.value, isError: false},
        })
    }

    const generateAndSet2 = (data: any) => {
        setLocalState({
            ...localState,
            user2: {...localState.user2, data: data},
        })
    }

    const onChangeHandler2 = (e: any) => {
        setLocalState({
            ...localState,
            user2: {...localState.user2, data: e.target.value, isError: false},
        })
    }

    return (
        <>
            {localState.isGenerator && <div className="row between-xs">
                <ProfileGenerator
                    label="Сгенерировать первый профиль"
                    id="profile_1"
                    getRowData={generateAndSet1}
                />
                <ProfileGenerator
                    label="Сгенерировать второй профиль"
                    id="profile_2"
                    getRowData={generateAndSet2}
                />
            </div>}
            <form onSubmit={submitCompare}>
                <div className={`row between-xs ${style.fields}`}>
                    <div className="col-lg-6 mb-md">
                        <InputField
                            label={'Профиль 1'}
                            name={'user1'}
                            value={localState.user1.data}
                            placeholder={'Внесите в это поле зашифрованный результат для пользователя 1'}
                            hasErrored={localState.user1.isError}
                            onChangeHandler={onChangeHandler1}
                            autoFocus={true}
                        />
                    </div>
                    <div className="col-lg-6 mb-md">
                        <InputField
                            label={'Профиль 2'}
                            name={'user2'}
                            value={localState.user2.data}
                            placeholder={'Внесите в это поле зашифрованный результат для пользователя 2'}
                            hasErrored={localState.user2.isError}
                            onChangeHandler={onChangeHandler2}
                        />
                    </div>
                </div>
                <div className={style.buttons}>
                    <Button
                        title={'Сравнить'}
                        startIcon={<GoRocket/>}
                        handle={() => {
                        }}
                        btnClass={'btn-outlined'}
                    />
                </div>
            </form>
            <button className={style.floatBtn} onClick={() => {
                setLocalState({...localState, isGenerator: !localState.isGenerator})
            }}>
                <FaReact/>
            </button>
        </>
    );

    function submitCompare(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const userValue1 = e.target['user1'].value;
        const userValue2 = e.target['user2'].value;
        const userName1 = e.target['name_user1'].value;
        const userName2 = e.target['name_user2'].value;

        const {user1, user2} = decodeAndValidateUsersData(userValue1, userValue2)

        decodeAndValidateUsersData(userValue1, userValue2)

        setLocalState({
            ...localState,
            user1: {...localState.user1, data: userValue1, isError: !user1.isValid},
            user2: {...localState.user2, data: userValue2, isError: !user2.isValid}
        })

        if (user1.isValid && user2.isValid) {
            dispatch(setComparisonResult(true))
            dispatch(setUsersResults(user1.data, user2.data, userName1, userName2))
            return;
        } else if (!user1.isValid && !user2.isValid) {
            dispatch(setUsersResults([], [], '', ''))
            return;
        } else if (!user1.isValid && user2.isValid) {
            dispatch(setUsersResults([], [], '', ''))
            return;
        } else if (user1.isValid && !user2.isValid) {
            dispatch(setUsersResults([], [], '', ''))
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