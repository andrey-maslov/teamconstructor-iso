import React from "react"
import {Droppable} from "react-beautiful-dnd"
import DraggableItem from "../draggable-item/DraggableItem"

import style from './droppable-column.module.scss'
import {IEmployeeProfile, ITeamProfile} from "../../../../../constants/types";

export interface IDroppableColumn {
    id: string
    items: IEmployeeProfile[]
    deleteItem: (colIndex: number, itemIndex: number) => void
    isDropDisabled?: boolean
    hasPlaceholder?: boolean
}

const DroppableColumn: React.FC<IDroppableColumn> = (
    {
        id,
        items,
        deleteItem,
        isDropDisabled = false,
        hasPlaceholder = false
    }
) => {

    return (
        <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
            {(provided, snapshot) => (
                <div
                    className={`${style.wrapper} ${snapshot.isDraggingOver ? style.dragging : style.fixed}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {items.map((item, index) => (
                        <DraggableItem
                            key={item.id}
                            index={index}
                            profile={item}
                            colIndex={+id}
                            deleteItem={deleteItem}
                        />
                    ))}
                    {hasPlaceholder && provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default DroppableColumn