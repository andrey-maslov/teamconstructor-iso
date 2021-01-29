import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import OutsideClickHandler from 'react-outside-click-handler'
import style from './input-t.module.scss'
import { IOneFieldForm } from '../../../../constants/types'

interface IInputTransformer {
    initValue: string
    rules: Record<string, unknown>
    objectKey: string
    handler: (value: IOneFieldForm<string>) => void
}

const InputTransformer: React.FC<IInputTransformer> = ({
                                                           initValue,
                                                           rules,
                                                           objectKey,
                                                           handler,
                                                           ...props
                                                       }) => {
    const [isEdit, setEdit] = useState(false)
    const { register, handleSubmit, errors, reset } = useForm<IOneFieldForm<string>>()

    return (
        <div className={style.wrapper}>
            {isEdit ? (
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setEdit(!isEdit)
                    }}>
                    <form onSubmit={handleSubmit(submit)}>
                        <div
                            className={`form-group ${errors[objectKey] ? 'has-error' : ''} ${
                                style.group
                            }`}>
                            <input
                                defaultValue={initValue}
                                name={objectKey}
                                className={style.input}
                                onFocus={(e: any) => e.target.select()}
                                autoFocus
                                onBlur={handleSubmit(submit)}
                                ref={register(rules)}
                                {...props}
                            />
                            {errors[objectKey] && (
                                <div className="item-explain floating">
                                    {errors[objectKey]?.message}
                                </div>
                            )}
                        </div>
                    </form>
                </OutsideClickHandler>
            ) : (
                <button className={style.title} onClick={() => setEdit(!isEdit)}>
                    {initValue}
                </button>
            )}
        </div>
    )

    function submit(formData: IOneFieldForm<string>): void {
        handler(formData)
        setEdit(!isEdit)
        reset()
    }
}

export default InputTransformer
