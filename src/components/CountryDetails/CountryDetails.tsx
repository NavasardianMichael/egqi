import { FC, Fragment } from "react"
import { useSelector } from "react-redux"
import { Portal } from "components/Portal/Portal"
import { STATS_TYPES } from "helpers/constants.ts/indices"
import { INDICATOR_COLORS } from "helpers/constants.ts/output"
import { combineClassNames, generateOrdinalNumber } from "helpers/functions/commons"
import { generateCountryAllValuesExcelFile, generateCountryIndicesByYearsExcelFile } from "helpers/functions/encoders"
import { selectCountriesState } from "store/countries/selectors"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
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
    
    const generateColorByValue = (value: number) => {
        if(value == null) return ''
        if(value === 100) return INDICATOR_COLORS[2]
        return INDICATOR_COLORS[Math.floor(value / (100 / 3))]
    }

    const generateColorByGrowthRate = (value: number) => {
        if(value == null || value === 1) return ''
        if(value > 100) return INDICATOR_COLORS[2]
        if(value < 100) return INDICATOR_COLORS[0]
        return INDICATOR_COLORS[1]
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
                        <img src={`https://flagcdn.com/${countries.byName[countryName].abbr}.svg`} alt={`flag of ${countryName}`} />
                        <h2 className={styles.country_details_name}>{countryName}</h2>
                        <button 
                            name={countryName}
                            className={combineClassNames([styles.country_details_download_btn, 'link-secondary'])}
                            onClick={handleDownloadIndicesBtnClick}
                        >
                            <i className='bi bi-download'></i> Indices by years
                        </button>
                        <button 
                            name={countryName}
                            className={combineClassNames([styles.country_details_download_btn, 'link-secondary'])}
                            onClick={handleDownloadAllValuesBtnClick}
                        >
                            <i className='bi bi-download'></i> Normalized values
                        </button>
                    </div>
                }
                <table className={combineClassNames(['table mt-3 align-middle', styles.countryDetailsTable])} style={{fontSize: 14}}>
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
                                    const pair = indices[countryName]?.byIndicator?.[indicatorName]?.average;
                                    
                                    return (
                                        <tr key={indicatorName}>
                                            <td className={styles.indicatorName}>{indicatorName}</td>
                                            {
                                                years.map(year => {
                                                    
                                                    const pair = indices?.[countryName]?.byIndicator[indicatorName].byYear[year].normalized
                                                    const color = generateColorByValue(+pair?.value)
                                                    return (
                                                        <td 
                                                            className='text-center text-light' 
                                                            key={indicatorName+year} 
                                                            style={{backgroundColor: color}}
                                                            title={`"${indicatorName}" value in ${year}`}
                                                        >
                                                            {`${pair?.value?.toFixed(2)} (${generateOrdinalNumber(pair?.ranking)})`}
                                                        </td>
                                                    )
                                                })
                                            }
                                            <td 
                                                className='text-center text-light' 
                                                style={{backgroundColor: generateColorByValue(+pair?.value)}}
                                                title={`Average value of "${indicatorName}" during the observed period`}
                                            >
                                                {
                                                    `${pair?.value?.toFixed(2)} (${pair?.ranking})`
                                                }
                                            </td>                                    
                                        </tr>                                    
                                    )
                                })
                            }
                            {
                                STATS_TYPES.map(type => {
                                    const mean = indices?.[countryName]?.means[type]

                                    return (
                                        <tr key={type}>
                                            <>
                                                <td>{type.toUpperCase()}</td>
                                                {
                                                    years.map(year => {
                                                        const pair = indices?.[countryName]?.byYear[year][type]
                                                        return (
                                                            <Fragment key={type+year}>
                                                                <td 
                                                                    className='text-center text-light' 
                                                                    style={{backgroundColor: (false ? generateColorByGrowthRate : generateColorByValue)(+pair?.value)}}
                                                                >
                                                                    {
                                                                        false ?
                                                                        '-' :
                                                                        `${pair?.value?.toFixed(2)} (${pair?.ranking})`
                                                                    }
                                                                </td>
                                                            </Fragment>
                                                        )
                                                    })
                                                }
                                                <td 
                                                    className='text-center text-light' 
                                                    style={{backgroundColor: (false ? generateColorByGrowthRate : generateColorByValue)(+mean?.value)}}
                                                >
                                                    {`${mean?.value?.toFixed(2)} (${mean?.ranking})`}
                                                </td>
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