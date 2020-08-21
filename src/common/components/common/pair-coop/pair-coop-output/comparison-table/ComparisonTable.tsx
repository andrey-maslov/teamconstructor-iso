import React from 'react'
import Table from "../../../tables/table/Table"
import {TableRow} from "../../../../../../constants/types";

interface ComparisonTableProps {
    tableData: TableRow[]
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({tableData}) => {


    return (
        <>
            <Table
                tableData={tableData}
                tableHeader={['Основные характеристики', 'Выявлено']}
                addClasses={['striped']}
            />
        </>
    );

}

export default ComparisonTable;