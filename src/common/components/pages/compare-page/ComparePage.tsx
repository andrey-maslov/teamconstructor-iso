import React, {useState} from 'react';
import CompareInput from "../../common/compare/compare-input/CompareInput";
import CompareOutput from "../../common/compare/compare-output/CompareOutput";
import Loader from "../../common/loaders/loader/Loader";
import {SchemeType} from "../../../../UserResult";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import Button from "../../common/buttons/button/Button";
import {FiRefreshCw} from "react-icons/fi";
import {clearUsersResults} from '../../../actions/actionCreator'
import CompareLoader from "../../common/loaders/compare-loader/CompareLoader";

const ComparePage = () => {

    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms);
    const isCompareReady: boolean = useSelector((state: any) => state.compareReducer.isComparisonResultReady);
    const isComparisonInProcess: boolean = useSelector((state: any) => state.compareReducer.isComparisonInProcess);
    const dispatch = useDispatch();
    const history = useHistory();

    if (!schemeCurrent) {
        return <main className='section page-compare main'>
            <div className="container">
                <Loader/>
            </div>
        </main>
    }
    if (isComparisonInProcess) {
        return <main className='section page-compare main'>
            <CompareLoader type="full-page"/>
        </main>
    }

    const newComparisonHandler = () => {
        dispatch(clearUsersResults(true))
        history.push('/')
    }

    return (
        <main className='section page-compare main'>
            <div className="container">
                {isCompareReady &&
                <Button
                    title={'New comparison'}
                    handle={newComparisonHandler}
                    startIcon={<FiRefreshCw/>}
                    btnClass={'btn-outlined'}
                />}
                {!isCompareReady ?
                    <CompareInput/>
                    :
                    <CompareOutput/>
                }

            </div>
        </main>
    );
};

export default ComparePage;