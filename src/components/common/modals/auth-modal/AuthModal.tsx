import React from "react"
import Rodal from "rodal"
import {IModalProps} from "../../../../constants/types"
import Auth from "../../auth/Auth"

const AuthModal: React.FC<IModalProps> = ({visible, closeModal}) => {

    return (
        <Rodal
            className='auth-modal'
            visible={visible}
            onClose={() => {
                closeModal()
            }}
            width={340}
            height={550}
        >
            Auth modal
        </Rodal>
    )
};

export default AuthModal