import React from 'react'
import style from './checkbox.module.scss'
//source : https://codepen.io/myleneb/pen/WMpyxG

type CheckBoxProps = {
    label?: string
    type?: string
    hasError?: boolean
    handle: any
    isChecked: boolean
    innerRef?: any
    inputProps?: any
}

function Checkbox(props: CheckBoxProps) {
    const { label, type, hasError, handle, isChecked, innerRef, ...inputProps } = props
    const checkboxClassname = `${style.checkbox} ${type === 'switch' ? style.switch : ''} ${hasError ? style.hasError : ''}`
    const inputClassname = `${style.input} ${type === 'switch' ? style.switchInput : ''} ${hasError ? style.hasErrorInput : ''}`
    const labelClassname = `${style.label} ${type === 'switch' ? style.switchLabel : ''}`

    return (
        <div className={checkboxClassname}>
            <label className={labelClassname}>
                <input
                    tabIndex={0}
                    type="checkbox"
                    className={inputClassname}
                    onChange={handle}
                    defaultChecked={isChecked}
                    ref={innerRef}
                    {...inputProps}
                />
                {label && <span className={style.text}>{label}</span>}
            </label>
        </div>
    )
}

export default Checkbox