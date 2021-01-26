import React, { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import Button from "../buttons/button/Button"
import Box from '../layout/box/Box'
import DroppableColumn from "./droppable-column/DroppableColumn"
import ColumnTop from "./droppable-column/ColumnTop"
import DroppableColumnStore from "./droppable-column/DroppableColumnStore"
import { globalStoreType, IMember, ITeam } from "../../../constants/types"
import { useDispatch, useSelector } from "react-redux"
import { setAddMemberModal, setTeamsData, updateProject } from '../../../actions/actionCreator'
import { useToasts } from 'react-toast-notifications'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useTranslation } from "react-i18next"
import FilterPanel from "./filter-panel/FilterPanel";
import { confirmAlert } from "react-confirm-alert";

// src:  https://codesandbox.io/s/react-drag-and-drop-react-beautiful-dnd-w5szl?file=/src/index.js:1565-4901
// with copy element:  https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?from-embed
//tread about copy: https://github.com/atlassian/react-beautiful-dnd/issues/216

/**
 * Reorder items on the same list.
 */
const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Copy an item from one list to another list.
 */
const copy = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const item = new Object(sourceClone[droppableSource.index])

    destClone.splice(droppableDestination.index, 0, { ...item, id: `${new Date().getTime()}` })

    return destClone
};


/**
 * Moves an item from one list to another list.
 */
const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    destClone.splice(droppableDestination.index, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone

    return result
}

const DraggableZone: React.FC = () => {

    const { teams }: {teams: ITeam[]} = useSelector((state: globalStoreType) => state.team.activeProject)
    const staff: ITeam | Record<string, unknown> = teams ? teams[0] : {}
    const dispatch = useDispatch()
    const { addToast } = useToasts()
    const { t } = useTranslation()

    const [isReady, setReady] = useState(false)
    const [isFilter, setFilter] = useState(false)
    const [filterValue, setFilterValue] = useState('')
    const [filteredMembers, setFilteredMembers] = useState<IMember[] | null>(null)

    useEffect(() => {
        if (staff && staff?.items) {
            setReady(true)
        }
    }, [staff])

    // useEffect(() => {
    //     if (activeProject) {
    //         dispatch(fetchProjectList())
    //     }
    // }, [])


    function onDragEnd(result: DropResult) {
        const { source, destination } = result

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId
        const dInd = +destination.droppableId

        if (sInd === dInd) {

            const items = reorder(teams[sInd].items, source.index, destination.index)
            const newTeams: ITeam[] = [...teams]
            newTeams[sInd].items = items
            dispatch(updateProject({ pool: newTeams[0], teams: newTeams.slice(1) }))

        } else if (sInd === 0) {

            const result = copy(teams[0].items, teams[dInd].items, source, destination) //new destination team array

            if (!checkDuplicate(0, source.index, dInd)) {
                const currName = teams[0].items[source.index].name
                addToast(t('common:errors.duplicate_member', { name: currName }), {
                    appearance: 'error',
                    autoDismiss: true
                })
                return
            } else {
                const newTeams: ITeam[] = [...teams];
                newTeams[dInd].items = result;
                console.log('before update')
                dispatch(updateProject({ pool: newTeams[0], teams: newTeams.slice(1) }))
            }

        } else if (dInd === 0) {
            console.log('store is destination')
        } else {
            const result = move(teams[sInd].items, teams[dInd].items, source, destination); //new destination teams array

            if (!checkDuplicate(sInd, source.index, dInd)) {
                const currName = teams[sInd].items[source.index].name
                addToast(t('common:errors.duplicate_member', { name: currName }), {
                    appearance: 'error',
                    autoDismiss: true
                })
                return
            } else {
                const newTeams = [...teams];
                newTeams[sInd].items = result[sInd];
                newTeams[dInd].items = result[dInd];
                dispatch(updateProject({ pool: newTeams[0], teams: newTeams.slice(1) }))
            }
        }
    }

    const onDragUpdate = (result: DropResult) => {
        if (!result.destination) return
    }

    const StoreWidget = () => {
        return (
            <div>
                <button
                    onClick={addMemberModal}
                    className={'btn btn-widget btn-icon'}
                    aria-label={t('common:buttons.add_member_to_pool')}
                >
                    <FiPlus />
                </button>
                <button
                    onClick={openSearch}
                    className={`btn btn-widget btn-icon ${isFilter ? 'active' : ''}`}
                    aria-label={t('common:buttons.search')}
                >
                    <FiSearch />
                </button>
                {isFilter && <FilterPanel changeHandler={filterStaff} value={filterValue} />}
            </div>
        )
    }


    const teamsWidget = (
        <Button
            handle={addTeam}
            btnClass={'btn btn-widget'}
            title={t('team:add_team')}
        />
    )

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            <div className="flex-row mb-sm">

                <Box
                    title={t('team:pool')}
                    addClass={'store-area'}
                    widget={<StoreWidget />}
                >
                    {isReady && <DroppableColumnStore
                        items={(filteredMembers && isFilter) ? filteredMembers : staff.items}
                        deleteItem={deleteMemberHandler}
                        id={`${0}`}
                        // isDropDisabled={true}
                    />}
                </Box>

                <Box title={t('team:team_plural')} addClass={'teams-area'} widget={teamsWidget}>
                    <div className={'teams-wrapper'}>
                        {isReady && teams.slice(1).map((team, i) => (
                            <div key={i}>

                                <ColumnTop
                                    label={team.title}
                                    deleteHandler={deleteTeam}
                                    columnIndex={i + 1}
                                />

                                <DroppableColumn
                                    items={team.items}
                                    deleteItem={deleteMemberHandler}
                                    id={`${i + 1}`}
                                    hasPlaceholder={true}
                                />

                            </div>
                        ))}
                        <button className="btn-add-team" aria-label="add-team" onClick={addTeam}>
                            <span /><span />
                        </button>
                    </div>
                </Box>

            </div>
        </DragDropContext>
    );

    function addMemberModal(): void {
        dispatch(setAddMemberModal(true))
    }

    function openSearch(): void {
        setFilter(!isFilter)
        if (!isFilter) {
            setFilteredMembers(staff.items)
        }
    }

    function filterStaff(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        setFilterValue(e.target.value)
        const reg = new RegExp(e.target.value, 'i')
        const filtered = staff.items.filter((item: IMember) => (
            item.name.match(reg) ||
            item.position.match(reg)
        ))
        setFilteredMembers(filtered)
    }

    //TODO what about pool
    function deleteMemberHandler(colIndex: number, itemIndex: number): void {
        if (colIndex === 0) {
            confirmAlert({
                message: t('team:do_you_want_to_delete_member?'),
                buttons: [
                    {
                        label: 'Нет',
                        onClick: () => null
                    },
                    {
                        label: 'Удалить',
                        onClick: () => deleteMemberFromPool(colIndex, itemIndex)
                    }
                ],
                overlayClassName: "alert-overlay confirm-danger",
            });
        } else if (colIndex !== 0) {
            deleteMemberFromTeam(colIndex, itemIndex)
        }
    }

    function deleteMemberFromTeam(colIndex: number, itemIndex: number) {
        const newTeams = [...teams];
        newTeams[colIndex].items.splice(itemIndex, 1);
        dispatch(updateProject({ pool: newTeams[0], teams: newTeams.slice(1) }))
        addToast(t('team:member_deleted_from_team'), { appearance: 'success', autoDismiss: true })
    }


    function deleteMemberFromPool(colIndex: number, itemIndex: number) {
        const baseId = teams[colIndex].items[itemIndex].baseID
        const newTeams = teams.map(team => ({
            ...team,
            items: team.items.filter((item: IMember) => item.baseID !== baseId)
        }))
        dispatch(updateProject({ pool: newTeams[0], teams: newTeams.slice(1) }))
        addToast(t('team:member_deleted_from_pool'), { appearance: 'success', autoDismiss: true })
    }

    function addTeam(): void {
        const idList = teams.map((team: ITeam) => team.id)
        const newId = Math.max.apply(null, idList) + 1
        dispatch(setTeamsData([...teams, { title: `${t('team:team')} ${newId}`, id: newId, items: [] }]))
        addToast(t('team:team_added'), { appearance: 'success', autoDismiss: true })
    }

    function deleteTeam(colIndex: number): void {
        const filteredTeams = [...teams].filter((group, i) => i !== colIndex)
        dispatch(updateProject({ pool: filteredTeams[0], teams: filteredTeams.slice(1) }))
        addToast(t('team:team_removed'), { appearance: 'success', autoDismiss: true })
    }

    //if one team includes this member
    function checkDuplicate(columnIndex: number, sourceIndex: number, destIndex: number): boolean {

        const sourceItemData = teams[columnIndex].items[sourceIndex].baseID;
        const destItemsData = teams[destIndex].items.map((item: IMember) => item.baseID)

        const includesNum = destItemsData.filter((item: string) => item === sourceItemData).length
        return includesNum === 0
    }
}

export default DraggableZone
