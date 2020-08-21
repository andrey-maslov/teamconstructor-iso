import React, {useState} from "react"
import Rodal from "rodal"
import {useSelector, useDispatch} from "react-redux"
import {GlobalStateType, IModalProps, ITeam} from "../../../../../constants/types"
import Auth from "../../auth/Auth";

const AuthModal: React.FC<IModalProps> = ({visible, closeModal}) => {

    const [state, setState] = useState({isError: false})

    const dispatch = useDispatch()
    const teams: Array<ITeam> = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)

    return (
        <Rodal
            className='auth-modal'
            visible={visible}
            onClose={() => {
                closeModal()
            }}
            height={600}
        >
            <Auth/>
        </Rodal>
    )

};

export default AuthModal