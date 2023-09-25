import { useEffect, useState } from "react"
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

        const a1 = (indicators.allNames.filter(n => indicators.byName[n].subindex === indicators.byName[indicatorName].subindex).reduce((acc, name) => {
            if(name === indicatorName) return acc;
            const normalizedValue = (
                ((indicators.byName[name].affect === -1 ? (indicators.byName[name].max - indices[selectedCountry].byIndicator[name].byYear[year].original.value) : indices[selectedCountry].byIndicator[name].byYear[year].original.value) - indicators.byName[name].min)/
                (indicators.byName[name].max - indicators.byName[name].min)
            ) * 100
            const normalized = Math.max(Math.min(normalizedValue, 100), 0.00001)
            acc *= Math.pow(
                normalized,
                indicators.byName[name].weight
            )
            return acc
        }, 1))
        // console.log({a1});
        
        const old = indices[selectedCountry].byYear[year].egqgi.value,
              newV = res[selectedCountry].byYear[year].egqgi.value
console.log(indicators.byName[indicatorName]);
const currentNorm = indices[selectedCountry].byIndicator[indicatorName].byYear[year].normalized.value
        const calc = (
            old *
            (
                Math.pow(
                    (1+
                    (
                        100/
                        (
                            (max-min)*currentNorm
                        )
                    )),
                    indicators.byName[indicatorName].weight
                ) - 1
            )
        )
              
        console.log({
            old, 
            new: newV,
            max,
            min,
            calc,
            diff: newV - old,
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