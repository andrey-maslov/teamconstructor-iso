import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {Pair, getDescByRange} from '../../../../../cooperation'
import RadarChart from "../../charts/radar-chart/RadarChart"
import Box from "../../layout/box/Box"
import Table from "../../tables/table/Table"
import ComparisonTable from "./comparison-table/ComparisonTable"
import {GlobalStateType} from "../../../../../constants/types"
import {BsTable} from "react-icons/bs"
import KeyIndicator from "../../result-common/key-indicator/KeyIndicator"
import {useTranslation} from "react-i18next"

const PairCoopOutput: React.FC = () => {

    const {t} = useTranslation();

    //Initial data
    const {terms: scheme, descriptions} = useSelector((state: GlobalStateType) => state.termsReducer)
    const {partner1, partner2, isComparisonResultReady} = useSelector((state: GlobalStateType) => state.pairCoopReducer)
    const {name: name1, data: data1} = partner1
    const {name: name2, data: data2} = partner2

    //if all resources are fetched, calculated and ready to display
    const [isReady, setReady] = useState(false)

    useEffect(() => {
        if (isComparisonResultReady && scheme && descriptions) {
            setReady(true)
        }
    }, [isComparisonResultReady, scheme, descriptions])

    if (!isReady) {
        return null;
    }

    const {compatibilityDesc, efficiencyDesc, complementarityDesc, pairDescriptions: desc} = descriptions

    const pair = new Pair([data1[1], data2[1]])

    //All calculated values for comparison table
    const partnerAcceptance: number = pair.getPartnerAcceptance()
    const understanding: number = pair.getUnderstanding()
    const attraction: number[] = pair.getAttraction()
    const lifeAttitudes: number = pair.getLifeAttitudes()
    const similarityThinking: number = pair.getSimilarityThinking()
    const complementarity: number[] = pair.getComplementarity()
    const maturity: number[] = pair.getPsyMaturity()

    const valuesForEfficiency: number[] = [partnerAcceptance, understanding, lifeAttitudes, similarityThinking];
    const efficiency: number = valuesForEfficiency.reduce((a, b) => a + b) / valuesForEfficiency.length;

    const valuesForCompatibility: number[] = [partnerAcceptance, understanding, ...maturity, lifeAttitudes, similarityThinking, ...maturity];
    const compatibility: number = valuesForCompatibility.reduce((a, b) => a + b) / valuesForCompatibility.length;

    const keyValues = [
        {
            title: getDescByRange(compatibility, compatibilityDesc).title,
            description: getDescByRange(compatibility, compatibilityDesc).desc,
            value: compatibility
        },
        {
            title: getDescByRange(efficiency, efficiencyDesc).title,
            description: getDescByRange(efficiency, efficiencyDesc).desc,
            value: efficiency
        }
    ]

    return (
        <>
            <Box
                addClass='result-box'
                title={`${t('pair:result_for_pair', {name1, name2})}`}
            >
                <div className="row around-md">
                    <RadarChart
                        profiles={[pair.profile1, pair.profile2]}
                        names={[name1, name2]}
                        labels={scheme.tendencies}
                    />
                    <div className="keys">
                        {keyValues.map((item, i) => (
                            <KeyIndicator
                                key={i}
                                title={item.title}
                                description={item.description}
                                value={item.value}
                            />
                        ))}
                    </div>
                </div>
            </Box>

            <Box
                addClass='result-box'
                title={t('pair:descriptions')}
                icon={<BsTable/>}
            >
                <div className="row center-md">
                    <div className="col-md-11">
                        <ComparisonTable tableData={getComparisonTableData()}/>
                    </div>
                </div>
            </Box>

            <Box addClass='result-box additional-profile' title={'Привязанность-отдельность'}>
                <div className="row center-md">
                    <div className="col-md-11">
                        <Table
                            tableData={[[name1, ...data1[1][3]], [name2, ...data2[1][3]]]}
                            tableHeader={['', ...(scheme.subAxes[3])]}
                        />
                    </div>
                </div>
            </Box>
            <Box addClass='result-box full-profile' title={'Профили пользователей'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={pair.profile1.map((item, i) => [scheme.tendencies[i], item.value])}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong>
                        <Table
                            tableData={pair.profile2.map((item, i) => [scheme.tendencies[i], item.value])}
                        />
                    </div>
                </div>
            </Box>
            <Box addClass='result-box additional-profile' title={'Отсортированные психотипы'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={pair.partner1.sortedOctants.map((item) => [scheme.psychoTypes[item.index], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong><br/>
                        <Table
                            tableData={pair.partner2.sortedOctants.map((item) => [scheme.psychoTypes[item.index], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>
        </>
    );

    function getComparisonTableData() {

        return [
            [desc[0], `${partnerAcceptance * 100}%`],
            [desc[1], `${understanding * 100}%`],
            [desc[2], `${name1} - ${attraction[0] * 100}%,</br>${name2} - ${attraction[1] * 100}%`],
            [desc[3], `${lifeAttitudes * 100}%`],
            [desc[4], `${similarityThinking * 100}%`],
            [desc[6], getComplementarityData(complementarity)],
            [desc[7], `${name1} - ${maturity[0]}%,</br>${name2} - ${maturity[1]}%`],
        ]
    }

    /**
     * Дополняемость
     */
    function getComplementarityData(indexes: number[]): string {

        if (indexes.length === 1) {
            return t('pair:both_bring_in_pair', {name1, name2, description: complementarityDesc.variants[indexes[0]]})
        }

        return `${t('pair:one_brings_in_pair', {name: name1, description: complementarityDesc.variants[indexes[0]]})}.<br/> 
                ${t('pair:one_brings_in_pair', {name: name2, description: complementarityDesc.variants[indexes[1]]})}`
    }

}

export default PairCoopOutput;