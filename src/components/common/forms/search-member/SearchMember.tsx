import style from "../../auth/auth.module.scss";
import Password from "../../Inputs/password/Password";
import Button from "../../buttons/button/Button";
import { AiOutlineLoading } from "react-icons/ai";
import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { ISignUpForm } from "../../auth/Signup";
import { globalStoreType, IOneFieldForm } from "../../../../constants/types";
import { useSelector } from "react-redux";

interface ISearchMember {
    submitForm: (formData: IOneFieldForm<string>) => void
}

const SearchMember: React.FC<ISearchMember> = ({ submitForm }) => {

    const { t } = useTranslation()
    const { register, handleSubmit, setError, errors, clearErrors } = useForm<ISignUpForm>()
    const { isLoading, errorApiMessage } = useSelector((state: globalStoreType) => state.app)

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label>
                    <span>Email</span>
                    <input
                        className={style.input}
                        name="email"
                        placeholder="Введите email сотрудника"
                        ref={register({
                            required: `${t('common:errors.required')}`,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: `${t('common:errors.invalid_email')}`
                            }
                        })}
                    />
                </label>
                {errors.email && <div className="item-explain">{errors.email.message}</div>}
            </div>

            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title="Искать"
                    startIcon={isLoading && <AiOutlineLoading />}
                    handle={() => clearErrors()}
                    btnClass="btn btn-accent btn-loader"
                />
                {errors.form && <div className="item-explain api-error">{errors.form.message}</div>}
            </div>
        </form>
    )
}

export default SearchMember