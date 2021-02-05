import React from 'react'
import { useDispatch } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd'
import { IMember } from '../../../../../constants/types'
import ItemContent from './ItemContent'
import { setAddMemberModal, setEditedMember } from '../../../../../actions/actionCreator'
import { FaTimes, FaInfo } from 'react-icons/fa'
import { FiEdit3 } from 'react-icons/fi'
import style from './draggable-item.module.scss'
import { SET_MEMBER_INFO_MODAL } from "../../../../../actions/actionTypes"

export interface IDraggableItem {
    index: number,
    member: IMember,
    colIndex: number,
    deleteItem: (colIndex: number, itemIndex: number) => void
    isStore: boolean
    isHidden?: boolean
}


const DraggableItem: React.FC<IDraggableItem> = ({ index, member, colIndex, deleteItem, isStore, isHidden }) => {

    const dispatch = useDispatch()
    const itemClasses = `${style.wrapper} ${isStore ? style.store : ''} ${(isStore && isHidden) ? style.hidden : ''}`

    return (
        <Draggable draggableId={member.id} index={index}>
            {(provided, snapshot) => (
                <>
                    <div
                        className={`${itemClasses} ${snapshot.isDragging ? style.dragging : style.fixed} `}
                        ref={provided.innerRef}
                        style={{display: 'none'}}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <div className={style.buttons}>
                            <button
                                className={style.btn}
                                onClick={() => editMember(member.baseID)}
                                aria-label="edit member"
                            >
                                <FiEdit3 />
                            </button>
                            <button
                                className={style.btn}
                                onClick={() => openInfo(member.baseID)}
                                aria-label="member info"
                            >
                                <FaInfo />
                            </button>
                            <button
                                className={style.btn}
                                onClick={() => deleteItem(colIndex, index)}
                                aria-label="delete member"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <ItemContent member={member} />
                    </div>
                    {(snapshot.isDragging && isStore) && (
                        <div
                            className={`${style.wrapper} ${style.fixed} ${style.clone}`}
                        >
                            <ItemContent member={member} />
                        </div>
                    )}
                </>
            )}
        </Draggable>
    )

    function editMember(id: number) {
        dispatch(setEditedMember(id))
        dispatch(setAddMemberModal(true))
    }

    function openInfo(id: number) {
        dispatch(setEditedMember(id))
        dispatch({ type: SET_MEMBER_INFO_MODAL, isMemberInfoModal: true })
    }
}

export default DraggableItem
