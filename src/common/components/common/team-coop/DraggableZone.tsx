import React, {useState, useEffect} from 'react'
import {DragDropContext, DropResult} from "react-beautiful-dnd"
import Button from "../buttons/button/Button"
import Box from '../layout/box/Box'
import DroppableColumn from "./droppable-column/DroppableColumn"
import ColumnTop from "./droppable-column/ColumnTop"
import DroppableColumnStore from "./droppable-column/DroppableColumnStore"
import {GlobalStateType, IMember, ITeam} from "../../../../constants/types"
import {useDispatch, useSelector} from "react-redux";
import {setAddMemberModal, setTeamsData} from "../../../actions/actionCreator";
import {useToasts} from 'react-toast-notifications'
import Loader from "../loaders/loader/Loader";

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
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = new Object(sourceClone[droppableSource.index])

    destClone.splice(droppableDestination.index, 0, {...item, id: `${new Date().getTime()}`});

    return destClone;
};


/**
 * Moves an item from one list to another list.
 */
const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};


const DraggableZone: React.FC = () => {

    const teams: ITeam[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const staff: ITeam = teams[0]
    const dispatch = useDispatch();
    const {addToast} = useToasts()

    const [isReady, setReady] = useState(false)

    useEffect(() => {
        if (staff && staff.items !== 0) {
            setReady(true)
        }
    }, [staff])


    function onDragEnd(result: DropResult) {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {

            const items = reorder(teams[sInd].items, source.index, destination.index);
            const newTeams: ITeam[] = [...teams];
            newTeams[sInd].items = items;
            dispatch(setTeamsData(newTeams))

        } else if (sInd === 0) {

            const result = copy(teams[0].items, teams[dInd].items, source, destination); //new destination team array

            if (!checkDuplicate(0, source.index, dInd)) {
                const currName = teams[0].items[source.index].name
                addToast(`Работник ${currName} есть в команде!`, {appearance: 'error'})
                return
            } else {
                const newTeams: ITeam[] = [...teams];
                newTeams[dInd].items = result;
                dispatch(setTeamsData(newTeams))
            }

        } else {
            const result = move(teams[sInd].items, teams[dInd].items, source, destination); //new destination teams array

            if (!checkDuplicate(sInd, source.index, dInd)) {
                const currName = teams[sInd].items[source.index].name
                addToast(`Работник ${currName} есть в команде!`, {appearance: 'error', autoDismiss: true})
                return
            } else {
                const newTeams = [...teams];
                newTeams[sInd].items = result[sInd];
                newTeams[dInd].items = result[dInd];

                dispatch(setTeamsData([...newTeams]))
            }
        }
    }

    const onDragUpdate = (result: DropResult) => {
        if (!result.destination) return
    }

    const storeWidget = (
        <Button
            handle={addMemberModal}
            btnClass={'btn btn-outlined btn-widget'}
            title={'Добавить'}
        />
    )

    const teamsWidget = (
        <Button
            handle={addTeam}
            btnClass={'btn btn-outlined btn-widget'}
            title={'Добавить команду'}
        />
    )


    return (
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            <div className="flex-row mb-sm">

                <Box title="Пул работников" addClass={'store-area'} widget={storeWidget}>
                    {isReady && <DroppableColumnStore
                        items={staff.items}
                        deleteItem={deleteMemberHandler}
                        id={`${0}`}
                        isDropDisabled={true}
                    />}
                </Box>

                <Box title={'Команды'} addClass={'teams-area'} widget={teamsWidget}>
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
                    </div>
                </Box>

            </div>
        </DragDropContext>
    );

    function addMemberModal(): void {
        dispatch(setAddMemberModal(true))
    }

    //TODO what about pool
    function deleteMemberHandler(colIndex: number, itemIndex: number): void {
        if (colIndex === 0 && confirm('Вы действительно хотите удалить работника из проекта?')) {
            deleteMemberFromPool(colIndex, itemIndex)
        } else {
            deleteMemberFromTeam(colIndex, itemIndex)
        }
    }

    function deleteMemberFromTeam(colIndex: number, itemIndex: number) {
        const newTeams = [...teams];
        newTeams[colIndex].items.splice(itemIndex, 1);
        dispatch(setTeamsData(newTeams))
        addToast(`Работник удален из команды`, {appearance: 'success', autoDismiss: true})
    }


    function deleteMemberFromPool(colIndex: number, itemIndex: number) {
        const baseId = teams[colIndex].items[itemIndex].baseID
        const newTeams = teams.map(team => ({
            ...team,
            items: team.items.filter((item: IMember) => item.baseID !== baseId)
        }))
        dispatch(setTeamsData(newTeams))
        addToast(`Работник удален из пула`, {appearance: 'success', autoDismiss: true})
    }

    function addTeam(): void {
        const idList = teams.map((team: ITeam) => team.id)
        const newId = Math.max.apply(null, idList) + 1
        dispatch(setTeamsData([...teams, {title: `Команда ${newId}`, id: newId, items: []}]))
        addToast(`Команда добавлена`, {appearance: 'success', autoDismiss: true})
    }

    function deleteTeam(colIndex: number): void {
        const newTeams = [...teams];
        dispatch(setTeamsData(newTeams.filter((group, i) => i !== colIndex)));
        addToast(`Команда удалена из списка`, {appearance: 'success', autoDismiss: true})
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