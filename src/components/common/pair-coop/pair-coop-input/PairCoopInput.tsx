import React, { useEffect, useState } from 'react'
import InputField from './input-field/InputField'
import { useDispatch, useSelector } from 'react-redux'
import { setComparisonResult, setPairData, } from '../../../../actions/actionCreator'
import { getAndDecodeData } from 'psychology'
import { FaReact } from 'react-icons/fa'
import { GoRocket } from 'react-icons/go'
import ProfileGenerator from './profile-generator/ProfileGenerator'
import style from './pair-input.module.scss'
import { anyType, globalStoreType, IOneFieldForm } from '../../../../constants/types'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { extractEncData } from '../../../../helper/helper'
import Search from "../../Inputs/search/Search";
import { fetchUser } from "../../../../actions/api/usersAPI";

interface IPairLocalState {
    data1: string
    data2: string,
    name1: string
    name2: string,
    isGenerator: boolean
}

interface IForm {
    name1: string
    name2: string
    data1: string
    data2: string
}


const PairCoopInput: React.FC = () => {
    const dispatch = useDispatch()
    const encData1 = useSelector((state: globalStoreType) => state.pair.partner1.encData)
    const encData2 = useSelector((state: globalStoreType) => state.pair.partner2.encData)
    const { firstName, psyData } = useSelector((state: globalStoreType) => state.user)
    const { register, handleSubmit, errors, getValues } = useForm()
    const { t } = useTranslation()

    const encDataFromURL = getAndDecodeData().encoded;

    const [ localState, setLocalState ] = useState<IPairLocalState>({
        data1: encDataFromURL ? encDataFromURL : encData1,
        data2: encData2,
        name1: `${t('pair:profile')} 1`,
        name2: `${t('pair:profile')} 2`,
        isGenerator: false
    })
    // const [ userIndex, setUserIndex ] = useState<null | number>(null)

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

            <form onSubmit={handleSubmit(submitCompare)} id="pairForm">
                <div className={`row between-xs ${style.fields}`}>

                    {[ localState.name1, localState.name2 ].map((item, i) => (
                        <div className="col-lg-6 mb-md" key={`${localState.name1}-${Math.random()}`}>
                            <InputField
                                name={item}
                                encData={localState[`data${i + 1}`]}
                                index={i + 1}
                                placeholder={`${t('pair:textarea_placeholder')} ${i + 1}`}
                                nameRef={register({
                                    required: `${t('common:errors.required')}`,
                                })}
                                dataRef={register({
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        decode: value => extractEncData(value).data !== null
                                    }
                                })}
                                errors={errors}
                            />
                            <div className={style.buttons}>
                                {psyData && <button
                                    className={`${style.btn} btn btn-outlined`}
                                    onClick={(e) => setOwnResult(e, i + 1)}>
                                    Свой результат
                                </button>}
                                <button
                                    className={`${style.btn} btn btn-outlined`}
                                    onClick={(e) => openSearch(e, i + 1)}>
                                    Найти пользователя
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </form>

            <div className={style.buttons}>
                <button className={`btn btn-outlined-yellow ${style.submit}`} form="pairForm">
                    <GoRocket />
                    {t('common:buttons.compare')}
                </button>
            </div>

            <button
                className={style.floatBtn}
                onClick={() => {
                    setLocalState({ ...localState, isGenerator: !localState.isGenerator })
                }}
            >
                <FaReact />
            </button>
        </>
    )

    function submitCompare(data: IForm) {

        const { data1, data2, name1, name2 } = data

        const decData1 = extractEncData(data1).data
        const decData2 = extractEncData(data2).data

        dispatch(setComparisonResult(true))
        dispatch(setPairData(decData1, decData2, name1, name2))
    }

    function setOwnResult(e: React.MouseEvent<HTMLButtonElement>, inputNum: number): void {
        e.preventDefault()
        setDataGroup(firstName, psyData, inputNum)
    }

    function openSearch(e: React.MouseEvent<HTMLButtonElement>, inputNum: number): void {
        e.preventDefault()
        // setUserIndex(inputNum)
    }

    function setFoundUserData(data: anyType, i: number) {
        setDataGroup(data.firstName, data.tests[0].value, i)
    }

    function setDataGroup(name: string, encData: string, index: number): void {
        if (name && name.length > 0) {
            setLocalState({
                ...localState,
                [`data${index}`]: encData,
                [`name${index}`]: name
            })
        } else {
            setLocalState({
                ...localState,
                [`data${index}`]: encData
            })
        }
    }

    // Profiles generator handlers
    function generateAndSet1(data: string) {
        setLocalState({
            ...localState,
            data1: data
        })
    }

    function generateAndSet2(data: string) {
        setLocalState({
            ...localState,
            data2: data
        })
    }
}

export default PairCoopInput
