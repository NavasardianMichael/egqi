import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { STATS_TYPES } from "helpers/constants/indices"
import { combineClassNames } from "helpers/functions/commons"
import { processIndices } from "helpers/functions/decoders"
import { selectCountriesState } from "store/countries/selectors"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
import { T_Indicator } from "store/indicators/types"
import { setIndices } from "store/indices/actionCreators"
import { selectIndices } from "store/indices/selectors"
import { selectYears } from "store/years/selectors"
import { T_Year } from "store/years/types"

import styles from './modelTab.module.css'

type Props = {
    selectedCountry: T_Country['name']
}

type T_InputDataset = {
    indicatorname: T_Indicator['name']
    year: T_Year
}

function Table({ selectedCountry }: Props) {

    const dispatch = useDispatch()
    const years = useSelector(selectYears)
    const countries = useSelector(selectCountriesState)
    const indicators = useSelector(selectIndicators)
    const indices = useSelector(selectIndices)
    const currentCountryIndicators = indices[selectedCountry]
    const [initialCurrentIndices, setInitialCurrentIndices] = useState(currentCountryIndicators)
    // const isSimulated = initialCurrentIndices !== indices[selectedCountry]

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const { indicatorname: indicatorName, year } = e.target.dataset as DOMStringMap & T_InputDataset
        const { min = -Infinity, max = Infinity } = indicators.byName[indicatorName]
        const enteredValue = +e.target.value
        const value = enteredValue
        
        if(enteredValue > max || enteredValue < min) e.target.value = value.toString()

        if(value === +indices[selectedCountry].byIndicator[indicatorName].byYear[year].original.value.toFixed(2)) return;

        const res = processIndices({
            countries,
            indicators,
            years,
            indices: {
                ...indices,
                [selectedCountry]: {
                    ...indices[selectedCountry],
                    byIndicator: {
                        ...indices[selectedCountry].byIndicator,
                        [indicatorName]: {
                            ...indices[selectedCountry].byIndicator[indicatorName],
                            byYear: {
                                ...indices[selectedCountry].byIndicator[indicatorName].byYear,
                                [year]: {
                                    ...indices[selectedCountry].byIndicator[indicatorName].byYear[year],
                                    original: {
                                        value,
                                        ranking: 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
// console.log({
//     EGQI_value: res[selectedCountry].byYear[year].egqi.value,
//     EGQI_ranking: res[selectedCountry].byYear[year].egqi.ranking,
//     EGQGI_value: res[selectedCountry].byYear[year].egqgi.value,
//     EGQGI_ranking: res[selectedCountry].byYear[year].egqgi.ranking,
//     EGQEI_value: res[selectedCountry].byYear[year].egqei.value,
//     EGQEI_ranking: res[selectedCountry].byYear[year].egqei.ranking,
// });


        const x = indices[selectedCountry].byIndicator[indicatorName].byYear[year].original.value
        const weight = indicators.byName[indicatorName].weight
        
        const   old = indices[selectedCountry].byYear[year].egqi.value,
                newV = res[selectedCountry].byYear[year].egqi.value,
                changeByPoints = 
                    indices[selectedCountry].byYear[year].egqi.value *
                    (
                        Math.pow(
                            (
                                (
                                    (1+1/100) *
                                    x
                                ) -
                                min
                            ) /
                            (x -min),
                            weight/2
                        ) -
                        1
                    ),
                changeByPercent = 
                    (
                        Math.pow(
                            (
                                ((101/100)*x -min)
                            ) /
                            (x -min),
                            (weight/2)
                        )
                    ) * 100 - 100,
                    contributionByPoint = 
                    (
                        (
                            x-min
                        ) *
                        (
                            Math.pow(
                                1+
                                (
                                    (
                                        6 * indices[selectedCountry].byYear[year].egqi.value + 9
                                    ) /
                                    (
                                        Math.pow(indices[selectedCountry].byYear[year].egqi.value, 2)
                                    )
                                ),
                                1/weight
                            ) - 1
                        )
                    ),
                    contributionByPercent = 
                    (
                        (x-min) *
                        (
                            Math.pow(
                                2*indices[selectedCountry].byYear[year].egqi.value+1,
                                1/(2*weight)
                            ) - 1
                        )
                    ) / x * 100

                    // (
                    //     x-min
                    // ) *
                    // (
                    //     Math.pow(
                    //         (
                    //             (indices[selectedCountry].byYear[year].egqi.value+1)
                    //         ) /
                    //         (
                    //             Math.pow(
                    //                 indices[selectedCountry].byYear[year].egqi.value,
                    //                 2
                    //             )
                    //         ) + 1,
                    //         1/weight
                    //     ) -
                    //     1
                    // )

              
        console.log({
            old, 
            new: newV,
            _xPercentDiff: res[selectedCountry].byIndicator[indicatorName].byYear[year].original.value/x*100-100,
            diff: newV - old,
            ____toCompare: res[selectedCountry].byYear[year].egqi.value / indices[selectedCountry].byYear[year].egqi.value * 100 - 100,
            changeByPoints,
            changeByPercent,
            contributionByPoint,
            contributionByPercent,
            max,
            min
        });

        console.log({
            __pos_old_EGQI: indices[selectedCountry].byYear[year].egqi.ranking,
            __pos_old_EGQGI: indices[selectedCountry].byYear[year].egqgi.ranking,
            __pos_old_EGQEI: indices[selectedCountry].byYear[year].egqei.ranking,
            __pos_new_EGQI: res[selectedCountry].byYear[year].egqi.ranking,
            __pos_new_EGQGI: res[selectedCountry].byYear[year].egqgi.ranking,
            __pos_new_EGQEI: res[selectedCountry].byYear[year].egqei.ranking,
        });
        

        dispatch(setIndices(res))
    }

    useEffect(() => {
        setInitialCurrentIndices(currentCountryIndicators)
    }, [selectedCountry])

    return (
        <div>
            {/* <button 
                title='Reset to original data'
                className="btn btn-outline-secondary mb-3" 
                onClick={handleReset}
                disabled={!isSimulated}
            >
                Reset
            </button> */}
            <table className={combineClassNames(['table','table-bordered', 'align-middle', styles.country_values])}>
                <thead>
                    <tr>
                        <th scope="col">Indicator Name</th>
                        {
                            years.map(year => {
                                return (
                                    <th key={year} className='text-center' scope="col">{year}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <>
                        {
                            indicators.allNames.map(indicatorName => {
                                return (
                                    <tr key={indicatorName}>
                                        <td>{indicatorName}</td>
                                        {
                                            years.map(year => {
                                                const { max, min } = indicators.byName[indicatorName]
                                                const value = currentCountryIndicators?.byIndicator[indicatorName].byYear[year].original.value
                                                
                                                const hasBeenSimulated = +initialCurrentIndices.byIndicator[indicatorName].byYear[year].original.value !== +value
                                                return (
                                                    <td 
                                                        className='text-center p-0 align-middle' 
                                                        key={selectedCountry+indicatorName+year}
                                                        style={{
                                                            backgroundColor: hasBeenSimulated ? '#029191' : 'initial',
                                                            color: hasBeenSimulated ? 'white' : 'initial'
                                                        }}
                                                    >
                                                        <input 
                                                            type='number'
                                                            title={`Please enter value in the corresponding valid range (${min ??  '&infin;'} - ${max ?? Infinity})`}
                                                            // max={max}
                                                            // min={min}
                                                            data-indicatorname={indicatorName}
                                                            data-year={year}
                                                            defaultValue={value}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                        {
                            STATS_TYPES.map(type => {
                                return (
                                    <tr key={type} className="fw-bold">
                                        <td>{type.toUpperCase()}</td>
                                        {
                                            years.map(year => {
                                                const value = currentCountryIndicators.byYear[year][type]?.value
                                                const hasBeenSimulated = +initialCurrentIndices.byYear[year][type].value !== +value
                                                return (
                                                    <td 
                                                        key={'average'+year} 
                                                        className='text-center'
                                                        style={{
                                                            backgroundColor: hasBeenSimulated ? '#029191' : 'initial',
                                                            color: hasBeenSimulated ? 'white' : 'initial'
                                                        }}
                                                    >
                                                        {value}
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </>
                </tbody>
            </table>
        </div>
    )
}

export default Table