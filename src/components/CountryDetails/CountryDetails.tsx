import { FC, Fragment } from "react"
import { useSelector } from "react-redux"
import { Portal } from "components/Portal/Portal"
import { INDICES_TYPES } from "helpers/constants.ts/indices"
import { INDICATOR_COLORS } from "helpers/constants.ts/output"
import { combineClassNames } from "helpers/functions/commons"
import { generateCountryAllValuesExcelFile, generateCountryIndicesByYearsExcelFile } from "helpers/functions/encoders"
import { selectCountriesState } from "store/countries/selectors"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
import { T_Indicator } from "store/indicators/types"
import { selectIndices } from "store/indices/selectors"
import { selectYears } from "store/years/selectors"
import styles from './countryDetails.module.css'

type T_Props = {
    countryName: T_Country['name']
    close: () => void
}

export const CountryDetails: FC<T_Props> = ({ countryName, close }) => {
    const years = useSelector(selectYears)
    const countries = useSelector(selectCountriesState)
    const indicators = useSelector(selectIndicators)
    const indices = useSelector(selectIndices)

    if(!years?.length || !indices || !countries?.allNames?.length) return null
    
    const generateColorByValue = (value: number, affect: T_Indicator['affect']) => {
        if(value == null) return ''
        if(value == 100) return INDICATOR_COLORS[affect > 0 ? 2 : 0]
        return (affect > 0 ? INDICATOR_COLORS : [...INDICATOR_COLORS].reverse())[Math.floor(value / (100 / 3))]
    }

    const handleDownloadIndicesBtnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        generateCountryIndicesByYearsExcelFile({
            countries,
            years,
            indices,
            indicators,
            countryName: e.currentTarget.name
        })
    }

    const handleDownloadAllValuesBtnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        generateCountryAllValuesExcelFile({
            countries,
            years,
            indices,
            indicators,
            countryName: e.currentTarget.name
        })
    }

    return (
        <Portal opened={!!countryName} close={close}>
            <>
                {
                    !!countryName &&
                    <div className={combineClassNames(['d-flex', styles.country_details_header])}>
                        <img src={`https://flagcdn.com/${countries.byName[countryName].abbr}.svg`} />
                        <h2 className={styles.country_details_name}>{countryName}</h2>
                        <button 
                            name={countryName}
                            className={styles.country_details_download_btn}
                            onClick={handleDownloadIndicesBtnClick}
                        >
                            <i className='bi bi-download'></i> Indices by years
                        </button>
                        <button 
                            name={countryName}
                            className={styles.country_details_download_btn}
                            onClick={handleDownloadAllValuesBtnClick}
                        >
                            <i className='bi bi-download'></i> Normalized values
                        </button>
                    </div>
                }
                <table className='table mt-3' style={{fontSize: 14}}>
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
                                    const { affect } = indicators.byName[indicatorName]
                                    const averageForIndicator = ((years.reduce((value, year) => {
                                        return value + indices?.[countryName]?.byIndicator[indicatorName][year].normalized
                                    }, 0))
                                    / years.length)
                                    return (
                                        <tr key={indicatorName}>
                                            <td>{indicatorName}</td>
                                            {
                                                years.map(year => {
                                                    
                                                    const value = indices?.[countryName]?.byIndicator[indicatorName][year].normalized
                                                    const color = generateColorByValue(+value, affect)
                                                    return (
                                                        <td 
                                                            className='text-center' 
                                                            key={indicatorName+year} 
                                                            style={{backgroundColor: color}}
                                                        >
                                                            {value?.toFixed(2)}
                                                        </td>
                                                    )
                                                })
                                            }
                                            <td className='text-center' style={{backgroundColor: generateColorByValue(+averageForIndicator, affect)}}>
                                                {
                                                    averageForIndicator
                                                    ?.toFixed(2)
                                                }
                                            </td>                                            
                                        </tr>                                    
                                    )
                                })
                            }
                            {
                                INDICES_TYPES.map(type => {
                                    return (
                                        <tr key={type}>
                                            <>
                                                <td>{`Yearly ${type.toUpperCase()}`}</td>
                                                {
                                                    years.map(year => {
                                                        const value = indices?.[countryName]?.byYear[year][type]
                                                        return (
                                                            <Fragment key={type+year}>
                                                                <td 
                                                                    className='text-center' 
                                                                    style={{backgroundColor: generateColorByValue(+value, 1)}}
                                                                >
                                                                    {value?.toFixed(2)}
                                                                </td>
                                                            </Fragment>
                                                        )
                                                    })
                                                }
                                                <td className='text-center'>-</td>
                                            </>
                                        </tr>
                                    )
                                })
                            }
                        </>
                    </tbody>
                </table>
            </>
        </Portal>
    )
}