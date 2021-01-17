import React, { useEffect, useState } from 'react'
import Rodal from 'rodal'
import { useSelector, useDispatch } from 'react-redux'
import style from './add-member.module.scss'
import { anyType, globalStoreType, IMemberForm, IModalProps } from '../../../../constants/types'
import { IMember } from 'psychology/build/main/types/types'
import { getAndDecodeData } from 'psychology'
import { updateProject } from '../../../../actions/actionCreator'
import { useTranslation } from 'react-i18next'
import MemberForm from "../../forms/member-form/MemberForm";
import SearchMember from "../../forms/search-member/SearchMember";
import Button from "../../buttons/button/Button";

export const AddMember: React.FC<IModalProps> = ({ visible, closeModal }) => {

    const customStyles = {
        height: 'auto',
        bottom: 'auto',
        top: '30%'
    }

    // const { t } = useTranslation()
    const dispatch = useDispatch()
    const [isSearchMode, setSearchMode] = useState(false)
    const [defaultProfile, setDefaultProfile] = useState<IMemberForm>({
        name: '',
        position: '',
        encData: ''
    })

    useEffect(() => {
        if (defaultProfile.name || defaultProfile.encData) {
            setSearchMode(false)
        }
    }, [defaultProfile.name, defaultProfile.encData])

    const { teams, editedMember } = useSelector((state: globalStoreType) => state.team)
    // const { isLoading, errorApiMessage } = useSelector((state: globalStoreType) => state.app)
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []

    useEffect(() => {
        if (editedMember !== null) {
            const member = members.filter((item: IMember) => item.baseID === editedMember)[0]
            setDefaultProfile({
                name: member.name,
                position: member.position,
                encData: btoa(JSON.stringify(member.decData))
            })
        }
    }, [])

    console.log(defaultProfile)

    return (
        <Rodal
            className='add-member-modal'
            visible={visible}
            onClose={closeModal}
            customStyles={customStyles}
            width={350}
            closeOnEsc={true}
        >
            <div className={style.content}>
                {isSearchMode ? (
                    <SearchMember searchHandler={searchMemberHandler} />
                ) : (
                    <MemberForm
                        memberData={defaultProfile}
                        submitForm={submitMemberForm}
                    />
                )}
                {editedMember === null && <Button
                    title={isSearchMode ? 'Вручную' : 'Искать'}
                    // startIcon={isLoading && <AiOutlineLoading />}
                    handle={() => setSearchMode(!isSearchMode)}
                    btnClass="btn btn-outlined"
                />}
            </div>
        </Rodal>
    )

    function searchMemberHandler({name, position, encData}: any) {
        // TODO провалидировать на ошибки, отсутствие результата теста и куда-то разместить инфу об этом
        setDefaultProfile({
            name,
            position,
            encData
        })
    }

    function submitMemberForm(formData: IMemberForm): void {

        const data = getAndDecodeData('', formData.encData)

        if (data.data === null) {
            return
        }

        //generate new base id as max of list of ids + 1
        const baseIdList = teams[0].items.map((item: IMember) => item.baseID)
        const newBaseID = baseIdList.length !== 0 ? Math.max.apply(null, baseIdList) + 1 : 0

        const newMember: IMember = {
            id: `0-${new Date().getTime()}`,
            name: formData.name,
            position: formData.position,
            decData: data.data,
            baseID: newBaseID
        }

        let newTeams = [...teams]

        if (editedMember === null) {
            // push new member to pool
            newTeams[0].items.push(newMember)
            dispatch(updateProject({ pool: newTeams[0] }))
            console.log('add')
        } else {
            console.log('edit')
            // search edited member in pool and every team and update him
            newTeams = [...teams].map(team => {
                return {
                    ...team,
                    items: team.items.map((item: IMember) => {
                        if (item.baseID === editedMember) {
                            return {
                                ...item,
                                name: newMember.name,
                                position: newMember.position,
                                decData: newMember.decData,
                            }
                        }
                        return item
                    })
                }
            })
            dispatch(updateProject({ pool: newTeams[0], teams: newTeams.slice(1) }))
        }
    }
}