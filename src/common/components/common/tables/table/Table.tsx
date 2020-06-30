import React from 'react';
import style from "./table.module.scss";

type Value = string | number | any

interface TableProps {
    tableHeader?: Value[]
    tableData: Value[][]
    addClasses?: ('striped' | 'small')[]
}

const Table: React.FC<TableProps> = ({tableHeader, tableData, addClasses,}) => {

    let tableClasses: string = '';
    if (addClasses) {
        tableClasses = addClasses.map(item => ` ${style[item]}`).join('')
    }

    return (
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
                    <tr key={index}>
                        {item.map((value, i) => (<td key={`${index}-${i}`}>
                            <span dangerouslySetInnerHTML={{__html: value}}/>
                        </td>))}
                    </tr>)
            })
            }
            </tbody>
        </table>
    );
}

export default Table;