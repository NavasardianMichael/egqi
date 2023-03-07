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
                    <th scope="col">Average</th>
                </tr>
            </thead>
            <tbody>
                <>
                    {
                        indicators.allNames.map(indicatorName => {
                            const averageForIndicator = ((years.reduce((value, year) => {
                                return value + currentCountryIndicators?.byIndicator[indicatorName][year].original
                            }, 0))
                            / years.length)
                            return (
                                <tr key={indicatorName}>
                                    <td>{indicatorName}</td>
                                    {
                                        years.map(year => {
                                            
                                            const value = currentCountryIndicators?.byIndicator[indicatorName][year].original
                                            return (
                                                <td 
                                                    className='text-center p-0 align-middle' 
                                                    key={indicatorName+year}
                                                >
                                                    <input type='number' value={value?.toFixed(2)} />
                                                </td>
                                            )
                                        })
                                    }
                                    <td className='text-center'>
                                        {
                                            averageForIndicator
                                            ?.toFixed(2)
                                        }
                                    </td>                                            
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