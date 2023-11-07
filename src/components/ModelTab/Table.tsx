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
import { T_IndicesState } from 'store/indices/types'
// import { T_IndicesState } from 'store/indices/types'

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
    changeQuantity: '',
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

    useEffect(() => {
        // 2.73442081369032
        let currentYear = years.at(-1) as number
        const currentCountrySimulatedState: T_IndicesState[keyof T_IndicesState] = JSON.parse(JSON.stringify(indices[selectedCountry]))
        const changeShares: {[key: T_Indicator['name']]: number} = {
            "Government expenditure on education, total (% of GDP)": 0.919328051,
            "Medium and high-tech manufacturing value added (% manufacturing value added)": 0.869634642,
            "HH Market concentration index": 0.844787938,
            "Research and development expenditure (% of GDP) ": 0.832364586,
            "Gross fixed capital formation (constant 2015 US$) per labor unit": 0.79509453,
            "CO2 emissions (kg per 2015 US$ of GDP)": 0.745401122,
            "GDP per capita (constant 2015 US$)": 0.683284362,
            "Happiness index": 0.683284362,
            "Global Competitiveness Index": 0.633590954,
            "Prosperity index": 0.509357433,
            "Domestic credit to private sector (% of GDP)": 0.496934081,
            "SFA-TFP": 0.198773633,
            "Gini index": 0.173926928,

        } 
        indicators.allNames.forEach(indicatorName => {
            const { min, weight, affect } = indicators.byName[indicatorName]
            const x = indices[selectedCountry].byIndicator[indicatorName].byYear[currentYear].original.value
            const egqi = indices[selectedCountry].byYear[currentYear].egqi.value

            // if(!changeShares[indicatorName]) return
            const args: T_GetContributionArgs = {
                min,
                ammount: changeShares[indicatorName],
                egqi,
                weight,
                x
            }
            const simulatedValue = getContributionByPercent(args)
            
            currentCountrySimulatedState.byIndicator[indicatorName].byYear[currentYear].original.value += (affect * simulatedValue * currentCountrySimulatedState.byIndicator[indicatorName].byYear[currentYear].original.value / 100)
            console.log({indicatorName, change: simulatedValue});
            
        })
console.log({currentCountrySimulatedState});

        const processed = processIndices({
            countries,
            indicators,
            years,
            indices: {
                ...indices,
                [selectedCountry]: currentCountrySimulatedState
            }
        })
        console.log(processed[selectedCountry].byYear[currentYear].egqi.value -
            indices[selectedCountry].byYear[currentYear].egqi.value);
        
        dispatch(setIndices(processed))
    }, [])

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

    const getContributionByPoints = ({
        min, x, weight, egqi, ammount
    }: T_GetContributionArgs) => {
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
    
    const handleEditValueByChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const currentValue = +e.target.value
        setEditValueChanges(currentValue)
    }

    const handleEditTypeByChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const currentType = e.target.value
        setSimulatedCellDetails(prev => ({...prev, changeType: currentType}))
        setEditValueChanges(+simulatedCellDetails.changeQuantity)
    }

    const setEditValueChanges = (currentValue: typeof simulatedCellDetails.value) => {
        setSimulatedCellDetails(prev => {
            const { changeType, changeQuantity, indicatorName, year, value } = prev
            const { min = -Infinity } = indicators.byName[indicatorName]
            
            const egqi = indices[selectedCountry].byYear[year].egqi.value
            const weight = indicators.byName[indicatorName].weight
            const args: T_GetContributionArgs = {
                min,
                ammount: +changeQuantity,
                egqi,
                weight,
                x: value
            }

            return {
                ...prev, 
                changeQuantity: currentValue.toString(),
                value: currentValue ? (changeType === 'percent' ? getContributionByPercent(args) : getContributionByPoints(args)) : prev.value
            }
        })
    }
    
    return (
      <>
        <div>
          <button
            className={combineClassNames(["btn btn-outline-primary mb-3"])}
            onClick={handleSubmitSimulations}
            disabled={
              currentCountryIndicators === currentCountryStoredIndicators
            }
          >
            Simulate with current changes
          </button>
          <button
            title='Reset to original data'
            className='btn btn-outline-secondary mb-3 mx-3'
            onClick={handleReset}
            disabled={!isSimulated}
          >
            Reset changes
          </button>
          <table
            className={combineClassNames([
              "table",
              "table-bordered",
              "align-middle",
              styles.country_values,
            ])}
          >
            <thead>
              <tr>
                <th scope='col'>Indicator Name</th>
                {years.map((year) => {
                  return (
                    <th key={year} className='text-center' scope='col'>
                      {year}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <>
                {indicators.allNames.map((indicatorName) => {
                  return (
                    <tr key={indicatorName}>
                      <td>{indicatorName}</td>
                      {years.map((year) => {
                        const { max, min } = indicators.byName[indicatorName];
                        const value =
                          currentCountryIndicators?.byIndicator[indicatorName]
                            .byYear[year].original.value;

                        const hasBeenSimulated =
                          +initialCurrentIndices.byIndicator[indicatorName]
                            .byYear[year].original.value !== +value;
                        return (
                          <td
                            className='text-center p-0 align-middle'
                            key={selectedCountry + indicatorName + year}
                            style={{
                              backgroundColor: hasBeenSimulated
                                ? "#029191"
                                : "initial",
                              color: hasBeenSimulated ? "white" : "initial",
                            }}
                          >
                            <input
                              type='number'
                              title={`Please enter value in the corresponding valid range: from (${
                                min ?? -Infinity
                              } to ${max ?? Infinity})`}
                            //   max={max}
                            //   min={min}
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
                        );
                      })}
                    </tr>
                  );
                })}
                {STATS_TYPES.map((type) => {
                  return (
                    <tr
                      key={type}
                      className={combineClassNames(["fw-bold", styles.stats])}
                    >
                      <td>{type.toUpperCase()}</td>
                      {years.map((year) => {
                        const value =
                          currentCountryStoredIndicators.byYear[year][type]
                            ?.value;
                        const hasBeenSimulated =
                          +initialCurrentIndices.byYear[year][type].value !==
                          +value;
                        return (
                          <td
                            key={"average" + year}
                            className='text-center'
                            style={{
                              backgroundColor: hasBeenSimulated
                                ? "#029191"
                                : "initial",
                              color: hasBeenSimulated ? "white" : "initial",
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            </tbody>
          </table>
        </div>
        <Portal
          opened={!!simulatedCellDetails.indicatorName}
          close={handleEditCellPortalClose}
          wrapperClassName={styles.simulationPortalWrapper}
        >
          <div>
            <div className='mb-3 input-group-sm'>
              <label htmlFor='quantity' className='form-label'>
                Change Quantity
              </label>
              <input
                type='number'
                className='form-control'
                id='quantity'
                aria-describedby='emailHelp'
                max={indicators.byName[simulatedCellDetails?.indicatorName]?.max}
                min={indicators.byName[simulatedCellDetails?.indicatorName]?.min}
                value={simulatedCellDetails.changeQuantity}
                onChange={handleEditValueByChange}
              />
              {/* <div id="emailHelp" className="form-text">Unit type</div> */}
            </div>
            <div className='mb-3 input-group-sm'>
              <label htmlFor='change-type' className='form-label'>
                Change Type
              </label>
              <select
                className='form-select'
                id='change-type'
                aria-label='Default select example'
                value={simulatedCellDetails.changeType}
                onChange={handleEditTypeByChange}
              >
                <option value='absolute'>By Absolute Value</option>
                <option value='percent'>By Percent</option>
              </select>
            </div>
            <h6 className='mb-4'>
              Current value is: {simulatedCellDetails.value}
            </h6>
            <button className='btn btn-outline-secondary w-25 mx-auto d-block'>
              Apply
            </button>
          </div>
        </Portal>
      </>
    );
}

export default Table