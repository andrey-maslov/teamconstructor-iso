import React from 'react'
import style from "./table.module.scss"
import { TableRow } from "../../../../constants/types"

interface TableProps {
    tableHeader?: TableRow
    tableData: TableRow[]
    addClasses?: ('striped' | 'small')[]
}

const Table: React.FC<TableProps> = ({ tableHeader, tableData, addClasses, }) => {

    let tableClasses = '';
    if (addClasses) {
        tableClasses = addClasses.map(item => ` ${style[item]}`).join('')
    }

    return (
        <div className={style.wrapper}>
            <table className={`${style.table} ${tableClasses.length > 0 ? tableClasses : ''}`}>
                <tbody>
                {tableHeader &&
                <tr>
                    {tableHeader.map((item) => {
                        return <th key={item}>{item}</th>
                    })}
                </tr>}
                {tableData.map((item, index) => {
                    return (
                        item && <tr key={index}>
                            {item.map((value, i) => (<td key={`${index}-${i}`}>
                                <span dangerouslySetInnerHTML={{ __html: `${value}` }} />
                            </td>))}
                        </tr>)
                })
                }
                </tbody>
            </table>
        </div>
    )
}

export default Table
