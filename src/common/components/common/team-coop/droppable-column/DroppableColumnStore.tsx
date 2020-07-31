import React from "react"
import {Droppable} from "react-beautiful-dnd"
import {IDroppableColumn} from "./DroppableColumn"
import DraggableItem from "../draggable-item/DraggableItem"

import style from './droppable-column.module.scss'


const DroppableColumnStore: React.FC<IDroppableColumn> = (
    {
        id,
        items,
        deleteItem,
        isDropDisabled = false,
    }
) => {

    return (
        <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
            {(provided, snapshot) => (
                <div
                    className={`${style.wrapper} ${style.store}`}
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
                </div>
            )}
        </Droppable>
    )
}

export default DroppableColumnStore