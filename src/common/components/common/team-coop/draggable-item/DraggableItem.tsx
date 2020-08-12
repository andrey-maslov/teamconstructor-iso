import React from 'react'
import {Draggable} from "react-beautiful-dnd"
import {IEmployeeProfile} from "../../../../../constants/types"
import ItemContent from "./ItemContent"

import style from './draggable-item.module.scss'


export interface IDraggableItem {
    index: number,
    employeeProfile: IEmployeeProfile,
    colIndex: number,
    deleteItem: (colIndex: number, itemIndex: number) => void
    isStore: boolean
}


const DraggableItem: React.FC<IDraggableItem> = (props) => {

    const itemClasses = `${style.wrapper} ${props.isStore ? style.store : ''}`

    return (
        <Draggable
            draggableId={props.employeeProfile.id}
            index={props.index}
        >
            {(provided, snapshot) => (
                <>
                    <div
                        className={`${itemClasses} ${snapshot.isDragging ? style.dragging : style.fixed}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                    >
                        <ItemContent {...props}/>
                    </div>
                    {(snapshot.isDragging && props.isStore) && (
                        <div
                            className={`${style.wrapper} ${style.fixed} ${style.clone}`}
                        >
                            <ItemContent {...props}/>
                        </div>
                    )}
                </>
            )}
        </Draggable>
    );
}

export default DraggableItem;