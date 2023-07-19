import XLSX from "xlsx";

import { COUNTRY_CODES_BY_NAMES } from "helpers/constants.ts/countries";
import { INDICES_INITIALS, SUBINDEX_TYPES } from "helpers/constants.ts/indices";
import { T_Row, T_Sheets } from "helpers/types/processors";
import { RootState } from "index";
import { initialCountriesState } from "store/countries/reducer";
import { T_CountriesState, T_Country } from "store/countries/types";
import { initialIndicatorsState } from "store/indicators/reducer";
import { T_Indicator, T_IndicatorsState } from "store/indicators/types";
import { T_Indices, T_IndicesByIndicator, T_IndicesByYear, T_IndicesState } from "store/indices/types";
import { T_YearsState } from "store/years/types";
import { geoMean } from "./commons";

export const processWorkbookData = (workbook: XLSX.WorkBook) => {
    const { SheetNames: [ indicatorsSheetName, ...indicesSheetNames ], Sheets } = workbook
    const workbookJsonSheet = workbookContentToJson(indicesSheetNames, Sheets)

    const countries = processCountries(workbookJsonSheet[indicesSheetNames[0]]) 
    const indicators = processIndicators(Sheets[indicatorsSheetName])
    const years = processYears(workbookJsonSheet[indicesSheetNames[0]][0])
    const initialValues = processInitialValues({countries, indicators, years}, workbookJsonSheet)

    const result: RootState = {
        countries,
        indicators,
        years,
        indices: processIndices({countries, indicators, years, indices: initialValues})
    }
    
    return result
}

const workbookContentToJson = (indicesSheetNames: T_Indicator['name'][], Sheets: XLSX.WorkBook['Sheets']) => {
    return indicesSheetNames.reduce((state: T_Sheets, indicatorName: keyof T_Sheets) => {
        state[indicatorName] = XLSX.utils.sheet_to_json<T_Row>(Sheets[indicatorName])
        return state
    }, {})
}

const processCountries = (templateSheet: T_Row[]): T_CountriesState => {  
    return templateSheet.reduce((state, row) => {
        const countryName = row['Country Name']
        state.allNames.push(countryName)
        state.byName[countryName] = {
            abbr: COUNTRY_CODES_BY_NAMES[countryName as keyof typeof COUNTRY_CODES_BY_NAMES],
            name: countryName
        }
        return state
    }, initialCountriesState)
}

const processIndicators = (indicatorsSheet: Partial<XLSX.WorkBook['Sheets']>): T_IndicatorsState => {
    const indicatorsJsonSheet = XLSX.utils.sheet_to_json<T_Indicator>(indicatorsSheet)
    return indicatorsJsonSheet.reduce((state, indicator) => {
        state.allNames.push(indicator.name)
        state.byName[indicator.name] = indicator
        return state
    }, initialIndicatorsState)
}

const processYears = (templateSheet: T_Row): T_YearsState => {
    return Object.keys(templateSheet).filter(value => !isNaN(+value)).map(year => +year)
}

const processInitialValues = (utils: Omit<RootState, 'indices'>, contentSheets: T_Sheets): T_IndicesState => {
    // const normalizedValues = normalizeValues(utils, contentSheets)
    const { indicators, years } = utils
    
    let result: T_IndicesState = {}
    
    indicators.allNames.forEach((indicatorName) => {
        const indicator = indicators.byName[indicatorName]        
        
        contentSheets[indicator.abbr].forEach((row) => {
            const countryName = row['Country Name'];
            [...years, +years[years.length-1] + 1, +years[years.length-1] + 2 ].forEach(year => {
                const value = +row[year]
    
                if(isNaN(value)) return
                if(!result[countryName]) result[countryName] = {
                    byIndicator: {},
                    byYear: {},
                    means: {
                        egqei: Infinity,
                        egqgi: Infinity,
                        egqi: Infinity,
                        egqemr: Infinity,
                    }
                }
                if(!result[countryName].byIndicator[indicatorName]) result[countryName].byIndicator[indicatorName] = {}
                result[countryName].byIndicator[indicatorName][year] = {
                    normalized: Infinity,
                    original: value
                }
            })
        })
    })
    
    return result
    
} 

export const processIndices = (utils: RootState): T_IndicesState => {

    const normalizedValues = normalizeValues(utils)
    const { countries } = utils
    
    let result: T_IndicesState = {}
    
    countries.allNames.forEach((countryName: T_Country['name']) => {
        const countryIndicators = normalizedValues[countryName].byIndicator
        
        const indicesByYears = processIndicesByYear(utils, countryIndicators)
        result[countryName] = {
            byIndicator: countryIndicators,
            byYear: indicesByYears,
            means: processIndicesMeans(utils, indicesByYears)
        }
    })
    
    return result
}

const processIndicesByYear = (utils: Omit<RootState, 'indices'>, countryIndicators: T_IndicesByIndicator): T_IndicesByYear => {
    const { indicators, years } = utils
    
    const indicesByYears = years.reduce((state: T_IndicesByYear, year) => {
        const indices = indicators.allNames.reduce((indicesState, indicatorName, i, arr) => {
            const { subindex, weight } = indicators.byName[indicatorName]
            const currentNormalizedValue = countryIndicators[indicatorName][year].normalized

            if(subindex === SUBINDEX_TYPES[0]) {
                indicesState.egqgi *= currentNormalizedValue ? Math.pow(currentNormalizedValue, weight) : 1
            } else {
                indicesState.egqei *= Math.pow(
                    (
                        (currentNormalizedValue * 0.582012172) +
                        (countryIndicators[indicatorName][year + 1].normalized * 0.243084568) +
                        (countryIndicators[indicatorName][year + 2].normalized * 0.174903259)
                    ),
                    weight
                )
            }
            if(i === arr.length - 1) {
                indicesState.egqi = geoMean(indicesState.egqgi, indicesState.egqei)
                indicesState.egqemr =  indicesState.egqei / indicesState.egqgi
            }
            
            return indicesState
        }, {...INDICES_INITIALS})
        
        state[year] = {...indices}
        return state
    }, {})

    return indicesByYears
}

const processIndicesMeans = (utils: Omit<RootState, 'indices'>, indicesByYears: T_IndicesByYear): T_Indices => {
    const { years } = utils
    return years.reduce((state, year, i, arr) => {
        state.egqgi *= indicesByYears[year].egqgi
        state.egqei *= indicesByYears[year].egqei
        state.egqi *= indicesByYears[year].egqi
        state.egqemr *= indicesByYears[year].egqemr
        if(i === arr.length - 1) {
            state.egqgi = Math.pow(state.egqgi, 1/years.length)
            state.egqei = Math.pow(state.egqei, 1/years.length)
            state.egqi = Math.pow(state.egqi, 1/years.length)
            state.egqemr = Math.pow(state.egqemr, 1/years.length)
        }
        return state
    }, {...INDICES_INITIALS})
}

const normalizeValues = (utils: RootState): T_IndicesState => { 
    const { countries, indicators, years, indices } = utils
    let result = indices
    
    countries.allNames.forEach(countryName => {        
        indicators.allNames.forEach((indicatorName) => {
            const indicator = indicators.byName[indicatorName]
            const { min, max } = getCriticalValues(utils, indicatorName)
            
            const distance = max - min;
            
            [...years, +years[years.length - 1] + 1, +years[years.length - 1] + 2].forEach((year) => {
                const value = +indices[countryName].byIndicator[indicatorName][year]?.original
                
                if(isNaN(value)) return

                let normalizedValue = (indices[countryName].byIndicator[indicatorName][year].original - min) / distance * 100
                if(indicator.affect === -1) normalizedValue = 100 - normalizedValue
                result[countryName].byIndicator[indicator.name][year].normalized = Math.max(Math.min(normalizedValue, 100), 0)
            })
        })
    })


    return result
}

const getCriticalValues = (utils: RootState, indicatorName: T_Indicator['name']): { min: number, max: number } => {
    const { indicators } = utils
    const { max: givenMax, min: givenMin } = indicators.byName[indicatorName]
    if(givenMax != null) {
        return {
            max: givenMax,
            min: givenMin
        } 
    } 

    const { percentiledMin, percentiledMax } = getPercentiledCriticalValues(utils, indicatorName)
    return {
        min: percentiledMin,
        max: percentiledMax
    }    
}

const getPercentiledCriticalValues = (utils: RootState, indicatorName: T_Indicator['name']): { percentiledMin: number, percentiledMax: number } => {
    const { indicators, years, countries, indices } = utils
    const { percentile } = indicators.byName[indicatorName]
    
    let allValues: number[] = []
            
    countries.allNames.forEach(countryName => {
        [...years, +years[years.length - 1] + 1, +years[years.length - 1] + 2].forEach(year => {
            const value = indices[countryName].byIndicator[indicatorName][year]?.original;
            if(isNaN(value)) return;
            allValues.push(value)
        })
    })
    
    allValues = allValues.sort((a, b) => a - b)

    const percentileCount = Math.round(allValues.length * percentile / 100)
    
    allValues.splice(0, percentileCount)
    allValues.splice(allValues.length - percentileCount, allValues.length)
    
    return {
        percentiledMax: allValues[allValues.length - 1],
        percentiledMin: allValues[0]
    }
}