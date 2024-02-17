import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { STATS_TYPES } from "helpers/constants.ts/indices"
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
    const currentCountryStoredIndicators = indices[selectedCountry]
    const [initialCurrentIndices, setInitialCurrentIndices] = useState(currentCountryStoredIndicators)
    const [currentCountryIndicators, setCurrentCountryIndicators] = useState(currentCountryStoredIndicators)
    const isSimulated = initialCurrentIndices !== currentCountryIndicators

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { indicatorname: indicatorName, year } = e.target.dataset as DOMStringMap & T_InputDataset
        const { min = -Infinity, max = Infinity } = indicators.byName[indicatorName]
        const enteredValue = +e.target.value
        const value = (min != null && max != null) ? Math.min(max, Math.max(min, enteredValue)) : enteredValue
        
        setCurrentCountryIndicators(prev => {
            return {
                ...prev,
                byIndicator: {
                    ...prev.byIndicator,
                    [indicatorName]: {
                        ...prev.byIndicator[indicatorName],
                        byYear: {
                            ...prev.byIndicator[indicatorName].byYear,
                            [year]: {
                                ...prev.byIndicator[indicatorName].byYear[year],
                                original: {
                                    ...prev.byIndicator[indicatorName].byYear[year].original,
                                    value,
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
        setCurrentCountryIndicators(initialCurrentIndices)
        
        dispatch(setIndices({
            ...indices,
            [selectedCountry]: initialCurrentIndices
        }))
    }

    const handleSubmitSimulations: MouseEventHandler<HTMLButtonElement> = () => {
        const processed = processIndices({
            countries,
            indicators,
            years,
            indices: {
                ...indices,
                [selectedCountry]: currentCountryIndicators
            }
        })

        dispatch(setIndices(processed))
    }

    useEffect(() => {
        setCurrentCountryIndicators(currentCountryStoredIndicators)
        setInitialCurrentIndices(currentCountryStoredIndicators)
    }, [selectedCountry])

    return (
        <div>
            <button 
                className={combineClassNames(["btn btn-outline-primary custom-btn mb-3"])}
                onClick={handleSubmitSimulations}
                disabled={currentCountryIndicators === currentCountryStoredIndicators}
            >
                Simulate with current changes
            </button>
            <button 
                title='Reset to original data'
                className="btn btn-outline-secondary mb-3 mx-3" 
                onClick={handleReset}
                disabled={!isSimulated}
            >
                Reset changes
            </button>
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
                                        <td title={indicatorName} className={styles.indicatorName}>{indicatorName}</td>
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
                                                            // title={`Please enter value in the corresponding valid range: from (${min ??  -Infinity} to ${max ?? Infinity})`}
                                                            max={max}
                                                            min={min}
                                                            data-indicatorname={indicatorName}
                                                            data-year={year}
                                                            value={value}
                                                            onChange={handleChange}
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
                                    <tr key={type} className={combineClassNames(['fw-bold', styles.stats])}>
                                        <td>{type.toUpperCase()}</td>
                                        {
                                            years.map(year => {
                                                const value = currentCountryStoredIndicators.byYear[year][type]?.value
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
                                                        {value.toFixed(2)}
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