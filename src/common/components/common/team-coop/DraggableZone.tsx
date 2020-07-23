import React, {useState} from 'react'
import {DragDropContext, Droppable, DropResult} from "react-beautiful-dnd";
import DraggableItem from "./draggable-item/DraggableItem";
import Button from "../buttons/button/Button";
import style from "./draggable-item/draggable-item.module.scss";
import {FaTrashAlt} from "react-icons/fa";

// src:  https://codesandbox.io/s/react-drag-and-drop-react-beautiful-dnd-w5szl?file=/src/index.js:1565-4901
// with copy element:  https://codesandbox.io/s/react-beautiful-dnd-copy-and-drag-5trm0?from-embed
//tread about copy: https://github.com/atlassian/react-beautiful-dnd/issues/216

const staff = [
    {
        id: `0-${new Date().getTime()}`,
        name: 'Мария',
        position: 'Manager',
        encData: 'W1syLDMsMF0sW1stMSwtMSw1LDMsLTFdLFstNCwtMywtMywtMiwtMV0sWzEsMCwtNCwzLC0xXSxbLTIsNiwwLDEsLTRdLFs0LDEsMSwtNCwtM11dXQ=='
    },
    {
        id: `1-${new Date().getTime()}`,
        name: 'Павел',
        position: 'Designer',
        encData: 'W1sxLDQsMV0sW1sxLDMsMywtMywxXSxbLTQsLTIsLTIsNCwtMl0sWy0xLDEsLTMsMCwtNF0sWy0zLC00LC0yLDUsLTNdLFsxLC0yLC0yLC0yLDFdXV0='
    },
    {
        id: `2-${new Date().getTime()}`,
        name: 'Таня',
        position: 'QA engineer',
        encData: 'W1sxLDEsMV0sW1szLC0yLDIsNSwxXSxbLTQsLTIsLTIsMSwtMV0sWy00LDUsLTUsMSwtMV0sWzAsMSwtMSwxLC00XSxbMSwtNCwtMiwxLC0xXV1d'
    },
    {
        id: `3-${new Date().getTime()}`,
        name: 'Лаврик',
        position: 'Business Analyst',
        encData: 'W1sxLDEsMF0sW1s0LC01LC02LC0yLDBdLFstMiwtMywtNCwwLDNdLFs2LDQsMiwtMSwyXSxbNCw0LDIsMywtNl0sWy0yLC0xLDIsMywwXV1d'
    },
    {
        id: `4-${new Date().getTime()}`,
        name: 'Andrey Maslov',
        position: 'Web Developer',
        encData: 'W1sxLDEsMV0sW1stMiwtMywtMSwyLC0xXSxbLTIsLTIsLTIsLTQsLTFdLFstMiwtMSwtMiwxLC02XSxbLTEsMSwxLC0yLC0zXSxbMSwtMywyLDEsLTJdXV0='
    },
    {
        id: `5-${new Date().getTime()}`,
        name: 'Julia Sobal',
        position: 'QA junior',
        encData: 'W1sxLDEsMV0sW1stNCwxLDEsLTMsLTFdLFswLC0yLDAsLTUsLTJdLFstNCwwLC0zLC0yLC0yXSxbLTEsMCwxLC0xLC00XSxbMSwtNCw0LDEsLTRdXV0='
    },
    {
        id: `6-${new Date().getTime()}`,
        name: 'Паша',
        position: 'Tech Writer',
        encData: 'W1swLDEsMF0sW1stMiw0LDAsLTEsMF0sWy0xLDEsLTMsMSwtMV0sWy00LDAsLTIsMSw0XSxbLTYsLTIsLTIsLTQsMl0sWzAsLTIsLTEsLTEsLTJdXV0='
    },
    {
        id: `7-${new Date().getTime()}`,
        name: 'Маша',
        position: 'Backend Developer',
        encData: 'W1swLDAsMV0sW1stMSwxLDAsLTMsLTNdLFsyLC0yLC0zLC0xLDNdLFstNCwwLDEsLTEsM10sWzEsMCwzLDEsLTRdLFstMSwxLC0xLDMsLTNdXV0='
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
    console.log('==> dest', destination);

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

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 8,
    width: 300
});


function DraggableZone() {

    const [state, setState] = useState(
        [
            {
                label: 'STAFF',
                items: staff
            },
            {
                label: 'Команда 1',
                items: []
            }
        ]
    )
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
            console.log(source)
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
        console.log('update')
    }

    // console.log('state', state)

    return (
        <div className={`draggable-wrapper`}>

            <div className={`row`}>
                <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>

                    <div className={`droppable-pool col-md-3`}>
                        <h3>{state[0].label}</h3>
                        <Droppable droppableId={`${0}`} isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <div
                                    className={`droppable-column`}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {state[0].items.map((item, index) => (
                                        <DraggableItem
                                            key={item.id}
                                            index={index}
                                            profile={item}
                                            colIndex={0}
                                            deleteItem={deleteItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    <div className={`col-md-6`}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <h3>Команды</h3>
                            <Button handle={() => {addColumn(columnsCount)}} btnClass={'btn btn-outlined'} title={'New team'} startIcon={<span>+</span>} />
                        </div>
                        <div style={{display: "flex"}}>
                            {[...state].slice(1).map((column, i) => (
                                <div key={i}>
                                    <div style={{display: 'flex'}}>
                                        <h4>{column.label}</h4>
                                        <button
                                            className={style.delete}
                                            onClick={() => {deleteColumn(i + 1)}}
                                        >
                                            <FaTrashAlt/>
                                        </button>
                                    </div>
                                    <Droppable droppableId={`${i + 1}`}>
                                        {(provided, snapshot) => (
                                            <div
                                                className={`droppable-column`}
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}
                                                {...provided.droppableProps}
                                            >
                                                {column.items.map((item, index) => (
                                                    <DraggableItem
                                                        key={item.id}
                                                        index={index}
                                                        profile={item}
                                                        colIndex={i + 1}
                                                        deleteItem={deleteItem}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </div>

                </DragDropContext>
            </div>
        </div>
    );

    function deleteItem (colIndex: number, itemIndex: number): void {
        const newState = [...state];
        newState[colIndex].items.splice(itemIndex, 1);
        setState(newState);
    }

    //TODO need to fix naming
    function addColumn (count: number): void {
        const columnName = `Команда ${count}`
        setState([...state, {label: columnName, items: []}]);
        setColumnsCount(columnsCount + 1)
    }

    //TODO need to fix
    function deleteColumn (colIndex: number): void {
        const newState = [...state];
        setState(newState.filter((group, i) => i !== colIndex));
    }

    //if one team includes this member
    function checkDuplicate (columnIndex: number, sourceIndex: number, destIndex: number): boolean {
        const sourceItemData = state[columnIndex].items[sourceIndex].encData
        const destItemsData = state[destIndex].items.map(item => item.encData)
        const includesNum = destItemsData.filter(item => item === sourceItemData).length
        return includesNum === 0
    }
}


export default DraggableZone;