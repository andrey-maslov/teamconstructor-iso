import React, { useState } from "react"
import InputField from "./input-field/InputField"
import { useDispatch, useSelector } from "react-redux"
import { setComparisonResult, setPairData, } from "../../../../actions/actionCreator"
import { getAndDecodeData } from "psychology"
import Button from "../../buttons/button/Button"
import { FaReact } from "react-icons/fa"
import { GoRocket } from "react-icons/go"
import ProfileGenerator from "./profile-generator/ProfileGenerator"
import style from './pair-coop-input.module.scss'
import { globalStoreType } from "../../../../../constants/types"
import { useForm } from 'react-hook-form'
import { useTranslation } from "react-i18next"

interface IPairLocalState {
    data1: string
    data2: string,
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
    const { register, handleSubmit, errors } = useForm()
    const { t } = useTranslation()

    const encDataFromURL = getAndDecodeData().encoded;

    const [localState, setLocalState] = useState<IPairLocalState>({
        data1: encDataFromURL ? encDataFromURL : encData1,
        data2: encData2,
        isGenerator: false
    })

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

            <form onSubmit={handleSubmit(submitCompare)}>
                <div className={`row between-xs ${style.fields}`}>

                    {[1, 2].map(item => (
                        <div className="col-lg-6 mb-md" key={item}>
                            <InputField
                                label={`${item}`}
                                value={localState[`data${item}`]}
                                placeholder={`${t('pair:textarea_placeholder')} ${item}`}
                                nameRef={register({
                                    required: `${t('common:errors.required')}`,
                                })}
                                dataRef={register({
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        decode: value => getAndDecodeData('', value).data !== null
                                    }
                                })}
                                errors={errors}
                            />
                        </div>
                    ))}

                </div>
                <div className={style.buttons}>
                    <Button
                        title={t('common:buttons.compare')}
                        startIcon={<GoRocket />}
                        handle={() => void (0)}
                        btnClass={'btn-outlined'}
                    />
                </div>
            </form>

            <button
                className={style.floatBtn}
                onClick={() => {
                    setLocalState({ ...localState, isGenerator: !localState.isGenerator })
                }}
            >
                <FaReact />
            </button>
        </>
    );

    function submitCompare(data: IForm) {

        const { data1, data2, name1, name2 } = data

        const decData1 = getAndDecodeData('', data1).data
        const decData2 = getAndDecodeData('', data2).data

        dispatch(setComparisonResult(true))
        dispatch(setPairData(decData1, decData2, name1, name2))
    }


    //Profiles generator handlers
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

export default PairCoopInput;