import React, {useState} from 'react'
import {DragDropContext, DropResult} from "react-beautiful-dnd"
import Button from "../buttons/button/Button"
import Box from '../layout/box/Box'
import DroppableColumn from "./droppable-column/DroppableColumn"
import ColumnTop from "./droppable-column/ColumnTop"
import DroppableColumnStore from "./droppable-column/DroppableColumnStore"
import {GlobalStateType, IEmployeeProfile, ITeamProfile} from "../../../../constants/types"
import {useDispatch, useSelector} from "react-redux";
import {setAddMemberModal, setTeamsData} from "../../../actions/actionCreator";
import { useToasts } from 'react-toast-notifications'

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
    // console.log('==> dest', destination);

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = new Object(sourceClone[droppableSource.index])

    destClone.splice(droppableDestination.index, 0, {...item, id: `0-${new Date().getTime()}`});
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

    const staff: ITeamProfile     = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams[0])
    const columns: ITeamProfile[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const dispatch                = useDispatch();
    const { addToast }            = useToasts()

    const [columnsCount, setColumnsCount] = useState(2)


    function onDragEnd(result: DropResult) {
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {

            const items = reorder(columns[sInd].items, source.index, destination.index);
            const newColumns: any = [...columns];
            newColumns[sInd].items = items;
            dispatch(setTeamsData(newColumns))

        } else if (sInd === 0) {

            const result = copy(columns[0].items, columns[dInd].items, source, destination); //new destination column array

            if (!checkDuplicate(0, source.index, dInd)) {
                const currName = columns[0].items[source.index].name
                addToast(`Работник ${currName} есть в команде!`, { appearance: 'error' })
                return
            } else {
                const newColumns: ITeamProfile[] = [...columns];
                newColumns[dInd].items = result;
                dispatch(setTeamsData(newColumns))
            }

        } else {
            const result = move(columns[sInd].items, columns[dInd].items, source, destination); //new destination column array

            if (!checkDuplicate(sInd, source.index, dInd)) {
                const currName = columns[sInd].items[source.index].name
                addToast(`Работник ${currName} есть в команде!`, { appearance: 'error', autoDismiss: true })
                return
            } else {
                const newTeams = [...columns];
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
            handle={() => {
                addColumn(columnsCount)
            }}
            btnClass={'btn btn-outlined btn-widget'}
            title={'Добавить команду'}
        />
    )


    return (
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            <div className="flex-row mb-md">

                <Box title="Пул работников" addClass={'store-area'} widget={storeWidget}>
                    <DroppableColumnStore
                        items={staff.items}
                        deleteItem={deleteMember}
                        id={`${0}`}
                        isDropDisabled={true}
                    />
                </Box>

                <Box title={'Команды'} addClass={'teams-area'} widget={teamsWidget}>
                    <div className={'teams-wrapper'}>
                        {columns.slice(1).map((column, i) => (
                            <div key={i}>

                                <ColumnTop
                                    label={column.label}
                                    deleteHandler={deleteColumn}
                                    columnIndex={i + 1}
                                />

                                <DroppableColumn
                                    items={column.items}
                                    deleteItem={deleteMember}
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

    //TODO what about staff column
    function deleteMember(colIndex: number, itemIndex: number): void {
        if (colIndex === 0) {
            if (confirm('Вы действительно хотите удалить работника из пула?')) {
                const newColumns = [...columns];
                newColumns[colIndex].items.splice(itemIndex, 1);
                dispatch(setTeamsData(newColumns))
                addToast(`Работник удален из команды`, { appearance: 'success', autoDismiss: true })
            }
        } else {
            const newColumns = [...columns];
            newColumns[colIndex].items.splice(itemIndex, 1);
            dispatch(setTeamsData(newColumns))
            addToast(`Работник удален из команды`, { appearance: 'success', autoDismiss: true })
        }
    }

    //TODO need to fix column count
    function addColumn(count: number): void {
        const columnName = `Команда ${count}`
        dispatch(setTeamsData([...columns, {label: columnName, items: []}]))
        setColumnsCount(columnsCount + 1)
        addToast(`Команда добавлена`, { appearance: 'success', autoDismiss: true })
    }

    function deleteColumn(colIndex: number): void {
        const newColumns = [...columns];
        dispatch(setTeamsData(newColumns.filter((group, i) => i !== colIndex)));
        addToast(`Команда удалена из списка`, { appearance: 'success', autoDismiss: true })
    }

    //if one team includes this member
    function checkDuplicate(columnIndex: number, sourceIndex: number, destIndex: number): boolean {

        const sourceItemData = columns[columnIndex].items[sourceIndex].encData;
        const destItemsData = columns[destIndex].items.map((item: IEmployeeProfile) => item.encData)

        const includesNum = destItemsData.filter((item: string) => item === sourceItemData).length
        return includesNum === 0
    }
}


export default DraggableZone;