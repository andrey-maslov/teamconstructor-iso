import React from 'react'
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";
import { IOctant, ITendency } from "psychology/build/main/types/types";

interface IAdditional {
    pair: any
    terms: any
    data1: any
    data2: any
    name1: string
    name2: string
}

export default function Additional({pair, terms, data1, data2, name1, name2}: IAdditional) {

    return (
        <>
            <Box addClass='result-box additional-profile' title={'Привязанность-отдельность'}>
                <div className="row center-md">
                    <div className="col-md-11">
                        <Table
                            tableData={[[name1, ...data1[1][3]], [name2, ...data2[1][3]]]}
                            tableHeader={['', ...(terms.subAxes[3])]}
                        />
                    </div>
                </div>
            </Box>
            <Box addClass='result-box full-profile' title={'Профили пользователей'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={pair.profile1.map((item: ITendency, i: number) => [terms.tendencies[i], item.value])}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong>
                        <Table
                            tableData={pair.profile2.map((item: ITendency, i: number) => [terms.tendencies[i], item.value])}
                        />
                    </div>
                </div>
            </Box>
            <Box addClass='result-box additional-profile' title={'Отсортированные психотипы'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={pair.partner1.sortedOctants.map((item: IOctant) => [terms.psychoTypes[item.index], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong><br />
                        <Table
                            tableData={pair.partner2.sortedOctants.map((item: IOctant) => [terms.psychoTypes[item.index], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>
        </>
    )
}