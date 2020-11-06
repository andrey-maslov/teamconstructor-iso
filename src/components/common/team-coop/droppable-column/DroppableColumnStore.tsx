import React from "react"
import { Droppable } from "react-beautiful-dnd"
import { IDroppableColumn } from "./DroppableColumn"
import DraggableItem from "./draggable-item/DraggableItem"

import style from './droppable-column.module.scss'
import { useTranslation } from "react-i18next";


const DroppableColumnStore: React.FC<IDroppableColumn> = (
    {
        id,
        items,
        deleteItem,
        isDropDisabled = false,
    }
) => {

    const { t } = useTranslation()

    return (
        <Droppable droppableId={id} isDropDisabled={isDropDisabled}>
            {(provided, snapshot) => (
                <div
                    className={`${style.wrapper} ${style.store}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {items.length === 0 &&
                    <span>{t('team:empty_pool')}</span>}
                    {items.map((item, index) => (
                        <DraggableItem
                            key={`${item.id}`}
                            index={index}
                            member={item}
                            colIndex={+id}
                            deleteItem={deleteItem}
                            isStore={true}
                        />
                    ))}
                </div>
            )}
        </Droppable>
    )
}

export default DroppableColumnStore