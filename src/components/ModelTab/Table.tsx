import { INDICES_TYPES } from "helpers/constants.ts/indices"
import { combineClassNames } from "helpers/functions/commons"
import { useSelector } from "react-redux"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
import { selectIndices } from "store/indices/selectors"
import { selectYears } from "store/years/selectors"
import styles from './modelTab.module.css'

type Props = {
    selectedCountry: T_Country['name']
}

function Table({ selectedCountry }: Props) {

    const years = useSelector(selectYears)
    const indicators = useSelector(selectIndicators)
    const indices = useSelector(selectIndices)
    const currentCountryIndicators = indices[selectedCountry]

    return (
        <div>
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
                                            return (
                                                <td 
                                                    className='text-center p-0 align-middle' 
                                                    key={indicatorName+year}
                                                >
                                                    <input 
                                                        type='number' 
                                                        max={max}
                                                        min={min}
                                                        value={value?.toFixed(2)}
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
                                            return (
                                                <td key={'average'+year} className='text-center'>
                                                    {currentCountryIndicators.byYear[year][type].toFixed(2)}
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