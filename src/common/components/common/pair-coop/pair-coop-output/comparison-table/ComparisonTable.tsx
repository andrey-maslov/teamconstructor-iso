import React from 'react'
import Table from "../../../tables/table/Table"

interface ComparisonTableProps {
    tableData: string[][]
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