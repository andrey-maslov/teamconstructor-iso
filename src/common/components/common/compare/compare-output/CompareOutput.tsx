import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {UserResult, SchemeType} from '../../../../../helper/UserResult'
import Loader from "../../loaders/loader/Loader";
import ChartRadar from "./radar-chart/ChartRadar";
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";

interface ICompareOutputProps {
    // schemeCurrent: SchemeType
}

const CompareOutput: React.FC<ICompareOutputProps> = () => {

    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms)
    const isCompareReady: boolean = useSelector((state: any) => state.compareReducer.isComparisonResultReady)
    const userData1: any = useSelector((state: any) => state.compareReducer.user1.data)
    const userData2: any = useSelector((state: any) => state.compareReducer.user2.data)
    const dispatch = useDispatch()

    if (!isCompareReady) {
        return null;
    }

    const userResult1 = new UserResult(userData1[1], schemeCurrent)
    const userResult2 = new UserResult(userData2[1], schemeCurrent)
    const userProfile1 = userResult1.profile
    const userProfile2 = userResult2.profile

    console.log([[...userData1[1][3]], [...userData2[1][3]]])

    return (
        <div>
            <ChartRadar
                userProfile1={userProfile1}
                userProfile2={userProfile2}
            />

            <Box className='result-box full-profile'>
                <h4>Users profiles</h4>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>User 1</strong>
                        <Table
                            tableData={userProfile1}
                            addClasses={['striped']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>User 2</strong>
                        <Table
                            tableData={userProfile2}
                            addClasses={['striped']}
                        />
                    </div>
                </div>
            </Box>


            <Box className='result-box additional-profile'>
                <h4>Users profiles</h4>
                <div className="row center-md">
                    <div className="col-md-11">
                        <Table
                            tableData={[['user 1', ...userData1[1][3]], ['user 2',...userData2[1][3]]]}
                            tableHeader={['', ...(schemeCurrent.axes[3].subAxes).map(item => item.join(' - '))]}
                            addClasses={['striped']}
                        />
                    </div>
                </div>
            </Box>


            <Box className='result-box additional-profile'>
                <h4>Users sorted octants</h4>
                {userResult1.octantsTitles.join(' / ')}
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>User 1</strong>
                        <Table
                            tableData={userResult1.sortedOctants.map(item => [item.title, item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>User 2</strong>
                        <Table
                            tableData={userResult2.sortedOctants.map(item => [item.title, item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>

        </div>
    );

}

export default CompareOutput;