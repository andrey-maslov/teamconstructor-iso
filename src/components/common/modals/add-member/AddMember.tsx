import React, { useEffect, useState } from 'react'
import Rodal from 'rodal'
import { useSelector, useDispatch } from 'react-redux'
import style from './add-member.module.scss'
import { globalStoreType, IMemberForm, IModalProps } from '../../../../constants/types'
import { IMember } from 'psychology/build/main/types/types'
import { updateProject } from '../../../../actions/actionCreator'
import { useTranslation } from 'react-i18next'
import MemberForm from "../../forms/member-form/MemberForm";
import SearchMember from "../../forms/search-member/SearchMember";
import { extractEncData } from "../../../../helper/helper";
import { useDisableBodyScroll } from "../../hooks/use-disable-body-scroll";

export const AddMember: React.FC<IModalProps> = ({ visible, closeModal }) => {

    const customStyles = {
        height: 'auto',
        bottom: 'auto',
        top: '10%'
    }

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [defaultProfile, setDefaultProfile] = useState<IMemberForm>({
        name: '',
        position: '',
        encData: ''
    })

    const { activeProject: { teams }, editedMember } = useSelector((state: globalStoreType) => state.team)
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []

    useDisableBodyScroll(visible)

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

    return (
        <Rodal
            className='add-member-modal modal'
            visible={visible}
            onClose={closeModal}
            customStyles={customStyles}
            width={350}
            closeOnEsc={true}
        >
            <div className={style.content}>

                    <SearchMember searchHandler={searchMemberHandler} />
                    <div className={style.divider}>
                        <span>{t('team:or')}</span>
                    </div>
                    <MemberForm
                        memberData={defaultProfile}
                        submitForm={submitMemberForm}
                    />
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

        const data = extractEncData(formData.encData)

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