import React, {useState} from "react"
import InputField from "./input-field/InputField"
import {useDispatch, useSelector} from "react-redux"
import {setComparisonResult, setPairData,} from "../../../../actions/actionCreator"
import {getAndDecodeData} from "encoded-data-parser"
import Button from "../../buttons/button/Button"
import {FaReact} from "react-icons/fa"
import {GoRocket} from "react-icons/go"
import ProfileGenerator from "./profile-generator/ProfileGenerator"
import style from './pair-coop-input.module.scss'
import {GlobalStateType} from "../../../../../constants/types";

//EXAMPLE SEE HERE https://www.carlrippon.com/building-super-simple-react-form-component-typescript-basics/


interface IPairLocalState {
    partner1: {
        data: string
        isError: boolean
    }
    partner2: {
        data: string
        isError: boolean
    },
    isGenerator: boolean
}


const PairCoopInput: React.FC = () => {
    const dispatch = useDispatch();
    const encData1 = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner1.encData);
    const encData2 = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner2.encData);

    const encDataFromURL = getAndDecodeData().encoded;

    const [localState, setLocalState] = useState<IPairLocalState>({
        partner1: {
            data: encDataFromURL ? encDataFromURL : encData1,
            isError: false,
        },
        partner2: {
            data: encData2,
            isError: false
        },
        isGenerator: false
    })


    const onChangeHandler1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalState({
            ...localState,
            partner1: {...localState.partner1, data: e.target.value, isError: false},
        })
    }

    const onChangeHandler2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalState({
            ...localState,
            partner2: {...localState.partner2, data: e.target.value, isError: false},
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
                            name={'partner1'}
                            value={localState.partner1.data}
                            placeholder={'Внесите в это поле зашифрованный результат для пользователя 1'}
                            hasErrored={localState.partner1.isError}
                            onChangeHandler={onChangeHandler1}
                        />
                    </div>
                    <div className="col-lg-6 mb-md">
                        <InputField
                            label={'Профиль 2'}
                            name={'partner2'}
                            value={localState.partner2.data}
                            placeholder={'Внесите в это поле зашифрованный результат для пользователя 2'}
                            hasErrored={localState.partner2.isError}
                            onChangeHandler={onChangeHandler2}
                        />
                    </div>
                </div>
                <div className={style.buttons}>
                    <Button
                        title={'Сравнить'}
                        startIcon={<GoRocket/>}
                        handle={() => void (0)}
                        btnClass={'btn-outlined'}
                    />
                </div>
            </form>

            <button
                className={style.floatBtn}
                onClick={() => {
                    setLocalState({...localState, isGenerator: !localState.isGenerator})
                }}
            >
                <FaReact/>
            </button>
        </>
    );

    function submitCompare(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const encValue1 = e.target['partner1'].value;
        const encValue2 = e.target['partner2'].value;
        const name1 = e.target['name_partner1'].value;
        const name2 = e.target['name_partner2'].value;

        const {partner1, partner2} = decodeAndValidatePairData(encValue1, encValue2)

        // decodeAndValidatePairData(partnerValue1, partnerValue2)

        setLocalState({
            ...localState,
            partner1: {...localState.partner1, data: encValue1, isError: !partner1.isValid},
            partner2: {...localState.partner2, data: encValue2, isError: !partner2.isValid}
        })

        // console.log(localState)

        if (partner1.isValid && partner2.isValid) {
            dispatch(setComparisonResult(true))
            dispatch(setPairData(partner1.data, partner2.data, name1, name2))
            return;
        } else if (!partner1.isValid && !partner2.isValid) {
            dispatch(setPairData([], [], '', ''))
            return;
        } else if (!partner1.isValid && partner2.isValid) {
            dispatch(setPairData([], [], '', ''))
            return;
        } else if (partner1.isValid && !partner2.isValid) {
            dispatch(setPairData([], [], '', ''))
            return;
        }

        dispatch(setComparisonResult(false))
    }


    function decodeAndValidatePairData(value1: string, value2: string): any {

        const partnerDataArr1: [] | null = getAndDecodeData('', value1).data
        const partnerDataArr2: [] | null = getAndDecodeData('', value2).data

        return {
            partner1: {
                data: partnerDataArr1,
                isValid: partnerDataArr1 !== null
            },
            partner2: {
                data: partnerDataArr2,
                isValid: partnerDataArr2 !== null
            }
        }
    }

    //Profiles generator handlers
    function generateAndSet1(data: string) {
        setLocalState({
            ...localState,
            partner1: {...localState.partner1, data: data},
        })
    }

    function generateAndSet2 (data: string) {
        setLocalState({
            ...localState,
            partner2: {...localState.partner2, data: data},
        })
    }
}

export default PairCoopInput;