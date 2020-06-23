import React from 'react';
import CompareInput from "../../common/compare/compare-input/CompareInput";
import CompareOutput from "../../common/compare/compare-output/CompareOutput";
import Loader from "../../common/loaders/loader/Loader";
import {SchemeType} from "../../../../helper/UserResult";
import {useDispatch, useSelector} from "react-redux";
import Button from "../../common/buttons/button/Button";
import {FiRefreshCw} from "react-icons/fi";
import {clearUsersResults} from '../../../actions/actionCreator'

const ComparePage = () => {

    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms);
    const isCompareReady: boolean = useSelector((state: any) => state.compareReducer.isComparisonResultReady);
    const dispatch = useDispatch();

    if (!schemeCurrent) {
        return <Loader/>;
    }

    return (
        <main className='bg-grey section main'>
            <div className="container">

                {isCompareReady &&
                <Button
                    title={'New comparison'}
                    handle={() => {
                        dispatch(clearUsersResults(true))
                    }}
                    startIcon={<FiRefreshCw/>}
                    btnClass={'btn-accent'}
                />}
                {!isCompareReady ?
                    <CompareInput/>
                    : <div className='section'>
                        <CompareOutput/>
                    </div>}

            </div>
        </main>
    );
};

export default ComparePage;