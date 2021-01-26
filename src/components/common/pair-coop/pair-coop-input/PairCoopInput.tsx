import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setComparisonResult, setPairData, } from '../../../../actions/actionCreator'
import { getAndDecodeData } from 'psychology'
import { FaReact } from 'react-icons/fa'
import { GoRocket } from 'react-icons/go'
import ProfileGenerator from './profile-generator/ProfileGenerator'
import style from './pair-input.module.scss'
import { globalStoreType, IMemberForm } from '../../../../constants/types'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { extractEncData } from '../../../../helper/helper'
import { SEARCH_MODAL } from "../../../../actions/actionTypes";
import { SearchUserModal } from "../../modals/search-user-modal/SearchUserModal";
import { useMediaPredicate } from "react-media-hook";

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
    const isMobi = useMediaPredicate('(max-width: 600px)')
    const { partner1, partner2 } = useSelector((state: globalStoreType) => state.pair)
    const { firstName, psyData, isLoggedIn } = useSelector((state: globalStoreType) => state.user)
    const { isSearchModal } = useSelector((state: globalStoreType) => state.modals)
    const { t } = useTranslation()

    const encDataFromURL = getAndDecodeData().encoded;

    const [localState, setLocalState] = useState<IPairLocalState>({
        data1: encDataFromURL ? encDataFromURL : partner1.encData,
        data2: partner2.encData,
        name1: `${t('pair:profile')} 1`,
        name2: `${t('pair:profile')} 2`,
        isGenerator: false
    })

    const { register, handleSubmit, errors, getValues } = useForm()
    const [inputIndex, setInputIndex] = useState<number>(1)

    const renderResultButtons = (index: number, resultData: string) => {
        return (
            <div className={style.buttons}>
                {resultData && <button
                    type="button"
                    className={`${style.btn} btn btn-outlined`}
                    onClick={(e) => setOwnResult(e, index)}>
                    {t('pair:own_result_btn')}
                </button>}
                <button
                    type="button"
                    className={`${style.btn} btn btn-outlined`}
                    onClick={(e) => openSearch(e, index)}>
                    {t('pair:search_user_btn')}
                </button>
            </div>
        )
    }

    const renderSearchModal = () => {
        return (
            <SearchUserModal
                visible={Boolean(isSearchModal)}
                isLarge={!isMobi}
                closeModal={() => {
                    dispatch({ type: SEARCH_MODAL, isSearchModal: false })
                }}
                handler={setFoundUserData}
            />
        )
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

            <form onSubmit={handleSubmit(submitCompare)} id="pairForm">
                <div className={`row between-xs ${style.fields}`}>
                    <div className={style.inputGroup}>
                        <div
                            className={`${style.title} form-group ${errors.name1 ? 'has-error' : ''}`}>
                            <input
                                type="text"
                                name="name1"
                                value={localState.name1}
                                onChange={onInputChange}
                                ref={register({
                                    required: `${t('common:errors.required')}`,
                                })}
                                onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.target.select()}
                                placeholder={localState.name1}
                                autoComplete="off"
                            />
                            {errors.name1 &&
                            <div className={`item-explain`}>{errors.name1.message}</div>}
                        </div>
                        <div className={`form-group ${errors.data1 ? 'has-error' : ''}`}>
                            <textarea
                                name="data1"
                                value={localState.data1 || ''}
                                placeholder={`${t('pair:textarea_placeholder')} 1`}
                                onChange={onInputChange}
                                ref={register({
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        decode: value => {
                                            console.log(extractEncData(value).data)
                                            return extractEncData(value).data !== null
                                        }
                                    }
                                })}
                            />
                            {errors.data1 &&
                            <div className={`item-explain`}>{errors.data1.message}</div>}
                            {errors.data1 && errors.data1.type === 'decode' && (
                                <div className={`item-explain`}>{t('common:errors.invalid')}</div>
                            )}
                        </div>
                        {isLoggedIn && renderResultButtons(1, psyData)}
                    </div>
                    <div className={style.inputGroup}>
                        <div
                            className={`${style.title} form-group ${errors.name2 ? 'has-error' : ''}`}>
                            <input
                                type="text"
                                name="name2"
                                value={localState.name2}
                                onChange={onInputChange}
                                ref={register({
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        matchesPreviousName: value => {
                                            const { name1 } = getValues()
                                            return name1 !== value || `${t('common:errors.same_partner_names')}`
                                        }
                                    }
                                })}
                                onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.target.select()}
                                placeholder={localState.name2}
                                autoComplete="off"
                            />
                            {errors.name2 &&
                            <div className={`item-explain`}>{errors.name2.message}</div>}
                        </div>
                        <div className={`form-group ${errors.data2 ? 'has-error' : ''}`}>
                            <textarea
                                name="data2"
                                value={localState.data2 || ''}
                                onChange={onInputChange}
                                placeholder={`${t('pair:textarea_placeholder')} 2`}
                                ref={register({
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        decode: value => extractEncData(value).data !== null,
                                        matchesPreviousData: value => {
                                            const { data1 } = getValues()
                                            return data1 !== value || `${t('common:errors.same_partner_results')}`
                                        }
                                    }
                                })}
                            />
                            {errors.data2 &&
                            <div className={`item-explain`}>{errors.data2.message}</div>}
                            {errors.data2 && errors.data2.type === 'decode' && (
                                <div className={`item-explain`}>{t('common:errors.invalid')}</div>
                            )}
                        </div>
                        {isLoggedIn && renderResultButtons(2, psyData)}
                    </div>
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
            {isSearchModal && renderSearchModal()}
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
        setDataGroup(firstName, psyData, inputNum)
    }

    function openSearch(e: React.MouseEvent<HTMLButtonElement>, inputNum: number): void {
        setInputIndex(inputNum)
        dispatch({ type: SEARCH_MODAL, isSearchModal: inputNum })
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

    function setFoundUserData(data: IMemberForm) {
        setDataGroup(data.name, data.encData, inputIndex)
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const inputName = e.target.name
        setLocalState({
            ...localState,
            [inputName]: e.target.value
        })
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
