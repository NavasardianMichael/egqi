import { Portal } from "components/Portal/Portal"
import { FC } from "react"
import { useSelector } from "react-redux"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
import { T_Indicator } from "store/indicators/types"
import { selectIndices } from "store/indices/selectors"
import { selectYears } from "store/years/selectors"

type T_Props = {
    countryName: T_Country['name']
    close: () => void
}

export const CountryDetails: FC<T_Props> = ({ countryName, close }) => {
    const years = useSelector(selectYears)
    const indicators = useSelector(selectIndicators)
    const indices = useSelector(selectIndices)

    if(!years?.length || !indices) return null
    
    const generateColorByValue = (value: number, indicatorName: T_Indicator['name']) => {
        const colors = [
            'rgba(255, 67, 67, 0.5)',
            'rgba(247, 247, 77, 0.877)',
            'rgba(87, 247, 87, 0.63)'
        ]
        return (indicators.byName[indicatorName].affect > 0 ? colors : colors.reverse())[Math.floor(value / (100 / 3))]
    }

    return (
        <Portal opened={!!countryName} close={close}>
            <>
                <h1>{countryName}</h1>
                <table className='table' style={{fontSize: 14}}>
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
                        {
                            indicators.allNames.map(indicatorName => {
                                return (
                                    <tr key={indicatorName}>
                                        <td>{indicatorName}</td>
                                        {
                                            years.map(year => {
                                                const value = indices?.[countryName]?.byIndicator[indicatorName][year].toFixed(2)
                                                return (
                                                    <td 
                                                        className='text-center' 
                                                        key={indicatorName+year} 
                                                        style={{backgroundColor: generateColorByValue(+value, indicatorName)}}
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
                    </tbody>
                </table>
            </>
        </Portal>
    )
}