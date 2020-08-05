import React from "react"
import {Droppable} from "react-beautiful-dnd"
import DraggableItem from "../draggable-item/DraggableItem"
import {IEmployeeProfile} from "../../../../../constants/types";

import style from './droppable-column.module.scss'

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
                    className={`${style.wrapper} ${style.team} ${snapshot.isDraggingOver ? style.dragging : style.fixed}`}
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
                            isStore={false}
                        />
                    ))}
                    {hasPlaceholder && provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default DroppableColumn