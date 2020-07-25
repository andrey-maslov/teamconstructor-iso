import React, {useState} from 'react'
import {DragDropContext, DropResult} from "react-beautiful-dnd"
import Button from "../buttons/button/Button"
import Box from '../layout/box/Box'
import DroppableColumn from "./droppable-column/DroppableColumn"
import ColumnTop from "./droppable-column/ColumnTop"
import DroppableColumnStore from "./droppable-column/DroppableColumnStore"
import TeamCoopSidebar from "./team-coop-sidebar/TeamCoopSidebar"
import {ITeamProfile} from "../../../../constants/types"

// src:  https://codesandbox.io/s/react-drag-and-drop-react-beautiful-dnd-w5szl?file=/src/index.js:1565-4901
// with copy element:  https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?from-embed
//tread about copy: https://github.com/atlassian/react-beautiful-dnd/issues/216

const initialStaff = [
    {
        id: `0-${new Date().getTime()}`,
        name: 'Мария',
        position: 'Manager',
        encData: 'W1syLDMsMF0sW1stMSwtMSw1LDMsLTFdLFstNCwtMywtMywtMiwtMV0sWzEsMCwtNCwzLC0xXSxbLTIsNiwwLDEsLTRdLFs0LDEsMSwtNCwtM11dXQ==',
        decData: [[2,3,0],[[-1,-1,5,3,-1],[-4,-3,-3,-2,-1],[1,0,-4,3,-1],[-2,6,0,1,-4],[4,1,1,-4,-3]]]
    },
    {
        id: `1-${new Date().getTime()}`,
        name: 'Павел',
        position: 'Designer',
        encData: 'W1sxLDQsMV0sW1sxLDMsMywtMywxXSxbLTQsLTIsLTIsNCwtMl0sWy0xLDEsLTMsMCwtNF0sWy0zLC00LC0yLDUsLTNdLFsxLC0yLC0yLC0yLDFdXV0=',
        decData: [[1,4,1],[[1,3,3,-3,1],[-4,-2,-2,4,-2],[-1,1,-3,0,-4],[-3,-4,-2,5,-3],[1,-2,-2,-2,1]]]
    },
    {
        id: `2-${new Date().getTime()}`,
        name: 'Таня',
        position: 'QA engineer',
        encData: 'W1sxLDEsMV0sW1szLC0yLDIsNSwxXSxbLTQsLTIsLTIsMSwtMV0sWy00LDUsLTUsMSwtMV0sWzAsMSwtMSwxLC00XSxbMSwtNCwtMiwxLC0xXV1d',
        decData: [[1,1,1],[[3,-2,2,5,1],[-4,-2,-2,1,-1],[-4,5,-5,1,-1],[0,1,-1,1,-4],[1,-4,-2,1,-1]]]
    },
    {
        id: `3-${new Date().getTime()}`,
        name: 'Лаврик',
        position: 'Business Analyst',
        encData: 'W1sxLDEsMF0sW1s0LC01LC02LC0yLDBdLFstMiwtMywtNCwwLDNdLFs2LDQsMiwtMSwyXSxbNCw0LDIsMywtNl0sWy0yLC0xLDIsMywwXV1d',
        decData: [[1,1,0],[[4,-5,-6,-2,0],[-2,-3,-4,0,3],[6,4,2,-1,2],[4,4,2,3,-6],[-2,-1,2,3,0]]]
    },
    {
        id: `4-${new Date().getTime()}`,
        name: 'Andrey Maslov',
        position: 'Web Developer',
        encData: 'W1sxLDEsMV0sW1stMiwtMywtMSwyLC0xXSxbLTIsLTIsLTIsLTQsLTFdLFstMiwtMSwtMiwxLC02XSxbLTEsMSwxLC0yLC0zXSxbMSwtMywyLDEsLTJdXV0=',
        decData: [[1,1,1],[[-2,-3,-1,2,-1],[-2,-2,-2,-4,-1],[-2,-1,-2,1,-6],[-1,1,1,-2,-3],[1,-3,2,1,-2]]]
    },
    {
        id: `5-${new Date().getTime()}`,
        name: 'Julia Sobal',
        position: 'QA junior',
        encData: 'W1sxLDEsMV0sW1stNCwxLDEsLTMsLTFdLFswLC0yLDAsLTUsLTJdLFstNCwwLC0zLC0yLC0yXSxbLTEsMCwxLC0xLC00XSxbMSwtNCw0LDEsLTRdXV0=',
        decData: [[1,1,1],[[-4,1,1,-3,-1],[0,-2,0,-5,-2],[-4,0,-3,-2,-2],[-1,0,1,-1,-4],[1,-4,4,1,-4]]]
    },
    {
        id: `6-${new Date().getTime()}`,
        name: 'Паша',
        position: 'Tech Writer',
        encData: 'W1swLDEsMF0sW1stMiw0LDAsLTEsMF0sWy0xLDEsLTMsMSwtMV0sWy00LDAsLTIsMSw0XSxbLTYsLTIsLTIsLTQsMl0sWzAsLTIsLTEsLTEsLTJdXV0=',
        decData: [[0,1,0],[[-2,4,0,-1,0],[-1,1,-3,1,-1],[-4,0,-2,1,4],[-6,-2,-2,-4,2],[0,-2,-1,-1,-2]]]
    },
    {
        id: `7-${new Date().getTime()}`,
        name: 'Маша',
        position: 'Backend Developer',
        encData: 'W1swLDAsMV0sW1stMSwxLDAsLTMsLTNdLFsyLC0yLC0zLC0xLDNdLFstNCwwLDEsLTEsM10sWzEsMCwzLDEsLTRdLFstMSwxLC0xLDMsLTNdXV0=',
        decData: [[0,0,1],[[-1,1,0,-3,-3],[2,-2,-3,-1,3],[-4,0,1,-1,3],[1,0,3,1,-4],[-1,1,-1,3,-3]]]
    },

]

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

    const [state, setState] = useState(
        [
            {
                label: 'STAFF',
                items: initialStaff
            },
            {
                label: 'Команда 1',
                items: []
            }
        ]
    )
    const staff: ITeamProfile = state[0];
    const teams: ITeamProfile[] = [...state].slice(1);
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
            const items = reorder(state[sInd].items, source.index, destination.index);
            const newState: any = [...state];
            newState[sInd].items = items;
            setState(newState);
        } else if (sInd === 0) {
            const result = copy(state[0].items, state[dInd].items, source, destination); //new destination column array
            //check double items
            if (!checkDuplicate(0, source.index, dInd)) {
                alert('Такой пользователь есть в команде!')
                return
            } else {
                const newState: any = [...state];
                newState[dInd].items = result;
                setState(newState);
            }

        } else {
            const result = move(state[sInd].items, state[dInd].items, source, destination); //new destination column array

            //check double items
            if (!checkDuplicate(sInd, source.index, dInd)) {
                alert('Такой пользователь есть в команде!')
                return
            } else {
                const newState = [...state];
                newState[sInd].items = result[sInd];
                newState[dInd].items = result[dInd];

                setState(newState);
            }
        }
    }

    const onDragUpdate = (result: DropResult) => {
        if (!result.destination) return
        // console.log('update')
    }

    // console.log('state', state)

    return (
        <div className={`draggable-wrapper`}>

            <div className={`row`}>
                <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>

                    <div className={`droppable-pool col-md-2`}>
                        <Box title={state[0].label} addClass={'box-store'}>

                            <Button
                                handle={addItemModal}
                                btnClass={'btn btn-outlined add-command-btn'}
                                title={'Добавить'}
                                startIcon={<span>+</span>}
                            />

                            <DroppableColumnStore
                                items={staff.items}
                                deleteItem={deleteItem}
                                id={`${0}`}
                                isDropDisabled={true}
                            />

                        </Box>
                    </div>

                    <div className={`col-md-8`}>
                        <Box title={'Команды'}>

                            <Button
                                handle={() => {
                                    addColumn(columnsCount)
                                }}
                                btnClass={'btn btn-outlined add-command-btn'}
                                title={'Добавить команду'}
                                startIcon={<span>+</span>}
                            />

                            <div style={{display: "flex", height: '100%'}}>
                                {teams.map((column, i) => (
                                    <div key={i}>

                                        <ColumnTop
                                            label={column.label}
                                            deleteHandler={deleteColumn}
                                            columnIndex={i + 1}
                                        />

                                        <DroppableColumn
                                            items={column.items}
                                            deleteItem={deleteItem}
                                            id={`${i + 1}`}
                                            hasPlaceholder={true}
                                        />

                                    </div>
                                ))}
                            </div>
                        </Box>
                    </div>

                    <div className={`col-md-2`}>
                        <Box title={'Статус'}>

                            <TeamCoopSidebar
                                teams={teams}
                            />

                        </Box>
                    </div>

                </DragDropContext>
            </div>
        </div>
    );

    function addItemModal():void {
        alert('Add new employee')
    }

    function deleteItem(colIndex: number, itemIndex: number): void {
        const newState = [...state];
        newState[colIndex].items.splice(itemIndex, 1);
        setState(newState);
    }

    function addColumn(count: number): void {
        const columnName = `Команда ${count}`
        setState([...state, {label: columnName, items: []}]);
        setColumnsCount(columnsCount + 1)
    }

    //TODO need to fix
    function deleteColumn(colIndex: number): void {
        const newState = [...state];
        setState(newState.filter((group, i) => i !== colIndex));
    }

    //if one team includes this member
    function checkDuplicate(columnIndex: number, sourceIndex: number, destIndex: number): boolean {
        const sourceItemData = state[columnIndex].items[sourceIndex].encData
        const destItemsData = state[destIndex].items.map(item => item.encData)
        const includesNum = destItemsData.filter(item => item === sourceItemData).length
        return includesNum === 0
    }
}


export default DraggableZone;