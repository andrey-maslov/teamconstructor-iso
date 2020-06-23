import React, {Component} from 'react';
import style from './checkbox.module.scss';
//source : https://codepen.io/myleneb/pen/WMpyxG

type CheckBoxProps = {
    indeterminate?: any
    label?: string
    type?: string
    hasError?: boolean
    handle: any
    isChecked: boolean
}

class Checkbox extends React.Component<CheckBoxProps> {

    private selector: any;

    componentDidMount() {
        // Apply the indeterminate attribute of the checkbox input
        this.selector.indeterminate = this.props.indeterminate;
    }

    // @ts-ignore
    componentDidUpdate(prevProps: { indeterminate: any; }): void {
        if (prevProps.indeterminate !== this.props.indeterminate) {
            this.selector.indeterminate = this.props.indeterminate;
        }
    }

    render() {
        const {label, type, indeterminate, hasError, handle, isChecked, ...inputProps} = this.props;

        const checkboxClassname = `${style.checkbox} ${type === 'switch' ? style.switch : ''} ${hasError ? style.hasError : ''}`;

        const inputClassname = `${style.input} ${type === 'switch' ? style.switchInput : ''} ${hasError ? style.hasErrorInput : ''}`;

        const labelClassname = `${style.label} ${type === 'switch' ? style.switchLabel : ''}`;

        return (
            <div className={checkboxClassname}>
                <label className={labelClassname}>
                    <input
                        tabIndex={0}
                        type="checkbox"
                        className={inputClassname}
                        ref={el => (this.selector = el)}
                        onChange={handle}
                        defaultChecked={isChecked}
                        {...inputProps}
                    />
                    {label}
                </label>
            </div>
        );
    }
}

export default Checkbox;