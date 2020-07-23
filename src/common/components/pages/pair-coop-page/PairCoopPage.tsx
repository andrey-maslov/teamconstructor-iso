import React from 'react'
import PairCoopInput from "../../common/pair-coop/pair-coop-input/PairCoopInput"
import PairCoopOutput from "../../common/pair-coop/pair-coop-output/PairCoopOutput"
import Loader from "../../common/loaders/loader/Loader"
import {SchemeType} from "../../../../UserResult"
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from 'react-router-dom'
import Button from "../../common/buttons/button/Button"
import {FiRefreshCw} from "react-icons/fi"
import {clearUsersResults} from '../../../actions/actionCreator'
import CompareLoader from "../../common/loaders/compare-loader/CompareLoader"

const PairCoopPage: React.FC = () => {

    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms);
    const isCompareReady: boolean = useSelector((state: any) => state.pairCoopReducer.isComparisonResultReady);
    const isComparisonInProcess: boolean = useSelector((state: any) => state.pairCoopReducer.isComparisonInProcess);
    const dispatch = useDispatch();
    const history = useHistory();

    if (!schemeCurrent) {
        return <main className='section page-pair main'>
            <div className="container">
                <Loader/>
            </div>
        </main>
    }
    if (isComparisonInProcess) {
        return <main className='section page-pair main'>
            <CompareLoader type="full-page"/>
        </main>
    }

    const newComparisonHandler = () => {
        dispatch(clearUsersResults(true))
        history.push('/')
    }

    return (
        <main className='section page-pair main'>
            <div className="container">
                {isCompareReady &&
                <Button
                    title={'Еще раз'}
                    handle={newComparisonHandler}
                    startIcon={<FiRefreshCw/>}
                    btnClass={'btn-outlined'}
                />}
                {!isCompareReady ?
                    <PairCoopInput/>
                    :
                    <PairCoopOutput/>
                }
            </div>
        </main>
    );
};

export default PairCoopPage;