import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Pair, getDescByRange } from 'psychology'
import RadarChart from "../../charts/radar-chart/RadarChart"
import Box from "../../layout/box/Box"
import Table from "../../tables/table/Table"
import ComparisonTable from "./comparison-table/ComparisonTable"
import { globalStoreType } from "../../../../../constants/types"
import { BsTable } from "react-icons/bs"
import KeyIndicator from "../../result-common/key-indicator/KeyIndicator"
import { useTranslation } from "react-i18next"
import { toPercent } from "../../../../../helper/helper"

const PairCoopOutput: React.FC = () => {

    const { t } = useTranslation()

    //Initial data
    const { terms: scheme, descriptions } = useSelector((state: globalStoreType) => state.terms)
    const { partner1, partner2, isComparisonResultReady } = useSelector((state: globalStoreType) => state.pair)
    const { name: name1, data: data1 } = partner1
    const { name: name2, data: data2 } = partner2

    //if all resources are fetched, calculated and ready to display
    const [isReady, setReady] = useState(false)

    useEffect(() => {
        if (isComparisonResultReady && scheme && descriptions) {
            setReady(true)
        }
    }, [isComparisonResultReady, scheme, descriptions])

    if (!isReady) {
        return null
    }

    const { compatibilityDesc, efficiencyDesc, complementarityDesc, pairDescriptions: desc } = descriptions

    const pair = Pair([data1[1], data2[1]])

    //All calculated values for comparison table
    const partnerAcceptance = pair.getPartnerAcceptance()
    const understanding = pair.getUnderstanding()
    const attraction = pair.getAttraction()
    const lifeAttitudes = pair.getLifeAttitudes()
    const similarityThinking = pair.getSimilarityThinking()
    const complementarity = pair.getComplementarity()
    const maturity = pair.getPsyMaturity()

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
                title={`${t('pair:result_for_pair', { name1, name2 })}`}
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
                icon={<BsTable />}
            >
                <div className="row center-md">
                    <div className="col-md-11">
                        <ComparisonTable tableData={getComparisonTableData()} />
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
                        <strong>{name2}</strong><br />
                        <Table
                            tableData={pair.partner2.sortedOctants.map((item) => [scheme.psychoTypes[item.index], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>
        </>
    )

    function getComparisonTableData() {

        return [
            [desc[0], toPercent(partnerAcceptance).str],
            [desc[1], toPercent(understanding).str],
            [desc[2], `${name1} - ${toPercent(attraction[0]).str},</br>${name2} - ${toPercent(attraction[1]).str}`],
            [desc[3], toPercent(lifeAttitudes).str],
            [desc[4], toPercent(similarityThinking).str],
            [desc[6], getComplementarityData(complementarity)],
            [desc[7], `${name1} - ${toPercent(maturity[0]).str},</br>${name2} - ${toPercent(maturity[1]).str}`],
        ]
    }

    /**
     * Дополняемость
     */
    function getComplementarityData(indexes: readonly number[]): string {

        if (indexes.length === 1) {
            return t('pair:both_bring_in_pair', { name1, name2, description: complementarityDesc.options[indexes[0]] })
        }

        return `${t('pair:one_brings_in_pair', { name: name1, description: complementarityDesc.options[indexes[0]] })}.<br/> 
                ${t('pair:one_brings_in_pair', { name: name2, description: complementarityDesc.options[indexes[1]] })}`
    }

}

export default PairCoopOutput
