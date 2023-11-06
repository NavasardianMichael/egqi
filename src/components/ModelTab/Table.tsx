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
import { ReactComponent as EditIcon } from 'assets/images/edit-icon.svg';


import styles from './modelTab.module.css'
import { Portal } from "components/Portal/Portal"

type Props = {
    selectedCountry: T_Country['name']
}

type T_InputDataset = {
    indicatorname: T_Indicator['name']
    year: T_Year
}

type T_GetContributionArgs = {
    min: number, 
    x: number, 
    weight: number, 
    egqi: number, 
    ammount: number
}


const EDIT_CELL_DETAILS_INITIAL = {
    year: 0,
    indicatorName: '',
    changeType: 'absolute',
    changeQuantity: 0,
    value: 0,
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

    const [simulatedCellDetails, setSimulatedCellDetails] = useState(EDIT_CELL_DETAILS_INITIAL)

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

    const handleEditCellClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        const { year, indicatorName, value } = e.currentTarget.dataset as DOMStringMap & typeof simulatedCellDetails
         
        setSimulatedCellDetails(prev => {
            return {
                ...prev,
                year, 
                indicatorName,
                value: +value,
            }
        })
    }

    const handleEditCellPortalClose = () => {
        setSimulatedCellDetails({...EDIT_CELL_DETAILS_INITIAL})
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

    // const handleSimulatedCellValuesSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        
    // }

    useEffect(() => {
        setCurrentCountryIndicators(currentCountryStoredIndicators)
        setInitialCurrentIndices(currentCountryStoredIndicators)
    }, [selectedCountry])

    useEffect(() => {
        if(!simulatedCellDetails.changeQuantity) return;
        
        setSimulatedCellDetails(prev => {
            const { changeType, changeQuantity, indicatorName, year, value } = simulatedCellDetails
            const { min = -Infinity } = indicators.byName[indicatorName]
            console.log(indicators.byName[indicatorName]);
            
            const egqi = indices[selectedCountry].byYear[year].egqi.value
            const weight = indicators.byName[indicatorName].weight
            const args: T_GetContributionArgs = {
                min,
                ammount: changeQuantity,
                egqi,
                weight,
                x: value
            }
            return {
                ...prev,
                value: changeType === 'percent' ? getContributionByPercent(args) : getContributionByPoints(args) 
            }
        })
    }, [simulatedCellDetails.changeType, simulatedCellDetails.changeQuantity, simulatedCellDetails.value])

    const getContributionByPoints = ({
        min, x, weight, egqi, ammount
    }: T_GetContributionArgs) => {
        console.log({min, x, weight, egqi, ammount});
        
        const contributionByPoint = 
        (
            (
                x-min
            ) *
            (
                Math.pow(
                    1+
                    (
                        (
                            2*ammount * egqi + Math.pow(ammount, 2)
                        ) /
                        (
                            Math.pow(egqi, 2)
                        )
                    ),
                    1/weight
                ) - 1
            )
        )
        return contributionByPoint
    }

    const getContributionByPercent = ({
        min, x, weight, ammount
    }: T_GetContributionArgs) => {
        const contributionByPercent = (
            (100-(100*min/x))*
            // (x-min)*
            (
                Math.pow(
                    1 + 
                    (
                        (200*ammount + Math.pow(ammount, 2)) / 10000
                    ),
                    1/weight
                ) - 1
            )
        )
        return contributionByPercent
    }

    return (
        <>
            <div>
                <button 
                    className={combineClassNames(["btn btn-outline-primary mb-3"])} 
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
                                                                title={`Please enter value in the corresponding valid range: from (${min ??  -Infinity} to ${max ?? Infinity})`}
                                                                max={max}
                                                                min={min}
                                                                data-indicatorname={indicatorName}
                                                                data-year={year}
                                                                value={value}
                                                                onChange={handleChange}
                                                            />
                                                            <button 
                                                                className={styles.options} 
                                                                data-indicator-name={indicatorName}
                                                                data-year={year}
                                                                data-value={value}
                                                                onClick={handleEditCellClick}
                                                            >
                                                                <EditIcon />
                                                            </button>
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
            <Portal opened={!!simulatedCellDetails.indicatorName} close={handleEditCellPortalClose} wrapperClassName={styles.simulationPortalWrapper}>
                <div>
                    <div className="mb-3 input-group-sm">
                        <label htmlFor="quantity" className="form-label">Change Quantity</label>
                        <input type="number" className="form-control" id="quantity" aria-describedby="emailHelp" value={simulatedCellDetails.changeQuantity} onChange={e => setSimulatedCellDetails(prev => ({...prev, changeQuantity: +e.target.value}))} />
                        {/* <div id="emailHelp" className="form-text">Unit type</div> */}
                    </div>
                    <div className="mb-3 input-group-sm">
                        <label htmlFor="change-type" className="form-label">Change Type</label>
                        <select className="form-select" id="change-type" aria-label="Default select example" value={simulatedCellDetails.changeType} onChange={e => setSimulatedCellDetails(prev => ({...prev, changeType: e.target.value}))}>
                            <option value='absolute'>By Absolute Value</option>
                            <option value='percent'>By Percent</option>
                        </select>
                    </div>
                    <h6 className="mb-4">Current value is: {simulatedCellDetails.value}</h6>
                    <button className="btn btn-outline-secondary w-25 mx-auto d-block">Apply</button>
                </div>
            </Portal>
        </>
    )
}

export default Table