import style from "../../auth/auth.module.scss";
import Button from "../../buttons/button/Button";
import { AiOutlineLoading } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { ISignUpForm } from "../../auth/Signup";
import { anyType, globalStoreType, IMemberForm, IOneFieldForm } from "../../../../constants/types";
import { useSelector } from "react-redux";
import { EMAIL_PATTERN } from "../../../../constants/constants";
import { searchUser } from "../../../../actions/api/usersAPI";

interface ISearchMember {
    searchHandler: (formData: IMemberForm) => void
}

const SearchMember: React.FC<ISearchMember> = ({ searchHandler }) => {

    const { t } = useTranslation()
    const [searchedEmail, setSearchedEmail] = useState('')
    const { register, handleSubmit, setError, errors, clearErrors } = useForm<ISignUpForm>()
    const { isLoading, errorApiMessage } = useSelector((state: globalStoreType) => state.app)

    useEffect(() => {
        if (searchedEmail) {
            searchUser(searchedEmail)
                .then(res => res.data)
                .then(data => validateAndSetMember(data))
        }
    }, [searchedEmail])

    return (
        <form onSubmit={handleSubmit(submitSearchForm)}>
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
                                value: EMAIL_PATTERN,
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

    function submitSearchForm({ email }: IOneFieldForm<string>): void {
        setSearchedEmail(email)
    }

    function validateAndSetMember(data: anyType): void {
        const name = (`${data.firstName && data.firstName} ${data.lastName && data.lastName}`).trim()
        const position = data.position || ''
        const testList = data.tests.length > 0 ? data.tests.filter((item: anyType) => item.type === 0) : null
        const encData = testList ? testList[0].value : ''
        // TODO провалидировать на ошибки, отсутствие результата теста и куда-то разместить инфу об этом
        searchHandler({name, position, encData})
    }
}

export default SearchMember