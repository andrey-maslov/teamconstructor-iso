import React from 'react';
import Table from "../../../tables/table/Table";
import {useSelector} from "react-redux";
import {SchemeType} from "../../../../../../UserResult";

interface ComparisonTableProps {
    tableData: string[][]
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({tableData}) => {

    // const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms)
    //
    // const userData1: any = useSelector((state: any) => state.pairCoopReducer.user1.data)
    // const userData2: any = useSelector((state: any) => state.pairCoopReducer.user2.data)
    // //
    // // const userResult1 = new UserResult(userData1[1], schemeCurrent)
    // // const userResult2 = new UserResult(userData2[1], schemeCurrent)
    //
    // const profilesComparison = new ProfilesComparison(schemeCurrent, userData1, userData2)

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