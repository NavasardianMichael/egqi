import { INDICES_TYPES } from "helpers/constants.ts/indices"
import { combineClassNames } from "helpers/functions/commons"
import { processIndices } from "helpers/functions/decoders"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
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
    const isSimulated = initialCurrentIndices !== indices[selectedCountry]

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const { indicatorname: indicatorName, year } = e.target.dataset as DOMStringMap & T_InputDataset
        const value = +e.target.value

        if(value === indices[selectedCountry].byIndicator[indicatorName][year].original) return;

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
                            [year]: {
                                ...indices[selectedCountry].byIndicator[indicatorName][year],
                                original: value
                            }
                        }
                    }
                }
            }
        })
        dispatch(setIndices(res))
    }

    const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch(setIndices({
            ...indices,
            [selectedCountry]: initialCurrentIndices
        }))
    }

    useEffect(() => {
        setInitialCurrentIndices(currentCountryIndicators)
    }, [selectedCountry])

    return (
        <div>
            <button 
                title='Reset to original data'
                className="btn btn-outline-secondary mb-3" 
                onClick={handleReset}
                disabled={!isSimulated}
            >
                Reset
            </button>
            <table className={combineClassNames(['table','table-bordered', styles.country_values])}>
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
                                                const value = currentCountryIndicators?.byIndicator[indicatorName][year].original
                                                const hasBeenSimulated = +initialCurrentIndices.byIndicator[indicatorName][year].original !== +value
                                                return (
                                                    <td 
                                                        className='text-center p-0 align-middle' 
                                                        key={selectedCountry+indicatorName+year}
                                                        style={{
                                                            backgroundColor: hasBeenSimulated ? 'darkcyan' : 'initial',
                                                            color: hasBeenSimulated ? 'white' : 'initial'
                                                        }}
                                                    >
                                                        <input 
                                                            type='number'
                                                            max={max}
                                                            min={min}
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
                            INDICES_TYPES.map(type => {
                                return (
                                    <tr key={type} className="fw-bold">
                                        <td>{type.toUpperCase()}</td>
                                        {
                                            years.map(year => {
                                                const value = currentCountryIndicators.byYear[year][type]
                                                const hasBeenSimulated = +initialCurrentIndices.byYear[year][type] !== +value
                                                return (
                                                    <td 
                                                        key={'average'+year} 
                                                        className='text-center'
                                                        style={{
                                                            backgroundColor: hasBeenSimulated ? 'darkcyan' : 'initial',
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