import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FiCopy } from 'react-icons/fi'
import style from './code-box.module.scss'

interface CodeBoxType {
    content: string
    successMsg?: string
    btnLabel?: string
}

const CodeBox: React.FC<CodeBoxType> = ({ content, successMsg, btnLabel }) => {
    const [isCopied, setCopied] = useState(false)

    return (
        <div className={`${style.wrapper} ${btnLabel ? style.withBtn : ''}`}>
            <textarea
                className={style.enc}
                defaultValue={content}
                onFocus={(e: any) => e.target.select()}
                readOnly
            />
            <CopyToClipboard
                onCopy={() => setCopied(true)}
                options={{ message: successMsg || 'Done!' }}
                text={content}>
                <button className={`${style.btn} ${isCopied ? style.success : ''}`}>
                    {btnLabel || <FiCopy />}
                </button>
            </CopyToClipboard>
        </div>
    )
}

export default CodeBox
