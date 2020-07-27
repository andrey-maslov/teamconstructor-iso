import React from 'react'
import {Draggable} from "react-beautiful-dnd"
import {IEmployeeProfile} from "../../../../../constants/types"
import ItemContent from "./ItemContent"

import style from './draggable-item.module.scss'


export interface IDraggableItem {
    index: number,
    profile: IEmployeeProfile,
    colIndex: number,
    deleteItem: (colIndex: number, itemIndex: number) => void
}


const DraggableItem: React.FC<IDraggableItem> = (props) => {

    return (
        <Draggable
            draggableId={props.profile.id}
            index={props.index}
        >
            {(provided, snapshot) => (
                <>
                    <div
                        className={`${style.wrapper} ${snapshot.isDragging ? style.dragging : style.fixed}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <ItemContent {...props}/>
                    </div>
                    {snapshot.isDragging && (
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