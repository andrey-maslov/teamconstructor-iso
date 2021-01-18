import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../buttons/button/Button"
import { AiOutlineLoading } from "react-icons/ai"
import { useForm } from "react-hook-form"
import { ISignUpForm } from "../../auth/Signup"
import { anyType, IMemberForm, IOneFieldForm } from "../../../../constants/types"
import { EMAIL_PATTERN } from "../../../../constants/constants"
import { searchUser } from "../../../../actions/api/usersAPI"
import { FiSearch } from 'react-icons/fi'
import style from './search-member.scss'

interface ISearchMember {
    searchHandler: (formData: IMemberForm) => void
}

const SearchMember: React.FC<ISearchMember> = ({ searchHandler }) => {

    const { t } = useTranslation()
    const [searchedEmail, setSearchedEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [responseError, setResponseError] = useState<string | null>(null)
    const { register, handleSubmit, errors, clearErrors } = useForm<ISignUpForm>()

    useEffect(() => {
        if (searchedEmail) {
            setLoading(true)
            searchUser(searchedEmail)
                .then(res => {
                    if (typeof res === 'number' && (res > 500 || res === 400)) {
                        setResponseError(t('common:errors.something_wrong'))
                        return
                    }
                    if (typeof res === 'number' && res === 404) {
                        setResponseError(t('common:errors.user_absent_or_hides_profile'))
                        return
                    }
                    if (res.data.tests && res.data.tests.length === 0) {
                        setResponseError(t('common:errors.user_have_no_test_result'))
                        return
                    }
                    validateAndSetMember(res.data)
                })
                .finally(() => setLoading(false))
        }
    }, [searchedEmail])

    return (
        <form onSubmit={handleSubmit(submitSearchForm)}>
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label>
                    <span>Email</span>
                    <input style={{ marginBottom: 5 }}
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
                    <button
                        className={`btn btn-accent ${style.submit} ${loading ? 'btn-loader' : ''}`}
                    >
                        {loading ? <AiOutlineLoading /> : <FiSearch />}
                    </button>
                </label>
                {errors.email && <div className="item-explain">{errors.email.message}</div>}
                {responseError && <div style={{ marginTop: '1rem' }}>{responseError}</div>}
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
        searchHandler({ name, position, encData })
    }
}

export default SearchMember