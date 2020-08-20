import React from 'react'
import {useDispatch} from 'react-redux'
import {Draggable} from "react-beautiful-dnd"
import {IMember} from "../../../../../constants/types"
import ItemContent from "./ItemContent"

import style from './draggable-item.module.scss'
import {setAddMemberModal, setEditedMember} from "../../../../actions/actionCreator";


export interface IDraggableItem {
    index: number,
    employeeProfile: IMember,
    colIndex: number,
    deleteItem: (colIndex: number, itemIndex: number) => void
    isStore: boolean
}


const DraggableItem: React.FC<IDraggableItem> = (props) => {

    const dispatch = useDispatch()
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
                        onClick={() => editMember(props.employeeProfile.baseID)}
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

    function editMember(id: number) {
        dispatch(setEditedMember(id))
        dispatch(setAddMemberModal(true))
    }
}

export default DraggableItem;