import { COUNTRY_CODES_BY_NAMES } from "helpers/constants.ts/countries";
import { T_NormalizedValues, T_Row, T_Sheets } from "helpers/types/processors";
import { RootState } from "index";
import { initialCountriesState } from "store/countries/reducer";
import { T_CountriesState } from "store/countries/types";
import { initialIndicatorsState } from "store/indicators/reducer";
import { T_Indicator, T_IndicatorsState } from "store/indicators/types";
import { T_IndicesState } from "store/indices/types";
import { T_YearsState } from "store/years/types";
import XLSX from "xlsx";

const processCountries = (templateSheet: T_Row[]): T_CountriesState => {  
    return templateSheet.reduce((state, row) => {
        const countryName = row['Country Name']
        state.allIds.push(countryName)
        state.byId[countryName] = {
            id: COUNTRY_CODES_BY_NAMES[countryName as keyof typeof COUNTRY_CODES_BY_NAMES],
            name: countryName
        }
        return state
    }, initialCountriesState) 
}



const workbookContentToJson = (indicesSheetNames: T_Indicator['name'][], Sheets: XLSX.WorkBook['Sheets']) => {
    return indicesSheetNames.reduce((state: T_Sheets, indicatorName: keyof T_Sheets) => {
        state[indicatorName] = XLSX.utils.sheet_to_json<T_Row>(Sheets[indicatorName])
        return state
    }, {})
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

export const processWorkbookData = (workbook: XLSX.WorkBook) => {
    const { SheetNames: [ indicatorsSheetName, ...indicesSheetNames ], Sheets } = workbook
    const workbookJsonSheet = workbookContentToJson(indicesSheetNames, Sheets)

    const result: RootState = {
        countries: processCountries(workbookJsonSheet[indicesSheetNames[0]]),
        indicators: processIndicators(Sheets[indicatorsSheetName]),
        years: processYears(workbookJsonSheet[indicesSheetNames[0]][0]),
        indices: {}
    }
    result.indices = processIndices(result, workbookJsonSheet)
    console.log({result});
    
    // const indicatorAbbrNames: T_Indicator['name'][] = settingsSheet.map(indicator => indicator.abbr)
    // const indicatorFullNames: T_Indicator['name'][] = settingsSheet.map(indicator => indicator.name)

    // template.forEach((row: any) => result.countries.push(row.Country))
    
    
    // const { Country, ...years } = template[0] as any
    
    // result.lists.years = Object.keys(years)
    
    // indicatorAbbrNames.forEach((indicatorAbbrName, i) => {
    //     const indicatorFullName = indicatorFullNames[i]
    //     const rows: any[] = XLSX.utils.sheet_to_json(Sheets[indicatorAbbrName]);
        
    //     if(!rows[0][result.lists.years[0]]) return

    //     result.lists.indicators.push()
        
    //     rows.forEach((columns: any) => {
    //         const { Country } = columns
    //         if(!Country) return
    //         result.lists.years.forEach((year: T_Year['name']) => {
    //             if(!columns[year]) return
    //             if(!result.values[Country]) result.values[Country] = {}
    //             if(!result.values[Country][indicatorFullName]) result.values[Country][indicatorFullName] = {}
    //             result.values[Country][indicatorFullName][year] = columns[year]
    //         })
    //     })
    // });
    
    return result
}

// const processSettings = (data: T_IndicatorSettings[]): T_SettingsState => {
//     return data.reduce((state: T_SettingsState, indicator: T_IndicatorSettings) => {
//         state[indicator.name as keyof T_SettingsState] = indicator
//         return state
//     }, {})
// }

export const processIndices = (utils: RootState, contentSheets: T_Sheets): T_IndicesState => {

    const normalized = normalizeValues(utils, contentSheets)
    console.log({normalized});
    return {
        
    }
    
}

const normalizeValues = (utils: RootState, contentSheets: T_Sheets): T_NormalizedValues => {
    const { min, max } = getCriticalValues(utils, contentSheets)
    const distance = max - min 
    
    let result: T_NormalizedValues = {}

    const { countries, indicators, years } = utils
    
    countries.allIds.forEach((countryName, i) => {
        if(i > 3) return
        indicators.allNames.forEach((indicatorName) => {
            contentSheets[indicators.byName[indicatorName].abbr].forEach((row) => {
                years.forEach((year) => {
                    const value = +row[year]
                    if(isNaN(value)) return
                    // console.log((value - min) / distance)
                    const normalizedValue = (value - min) / distance
                    
                    if(!result[countryName]) result[countryName] = {}
                    if(!result[countryName][indicators.byName[indicatorName].name]) result[countryName][indicators.byName[indicatorName].name] = {}
                    result[countryName][indicators.byName[indicatorName].name][year] = Math.max(Math.min(normalizedValue, 100), 0)
                })
            })
        })
    })
    return result
}


const getCriticalValues = (utils: RootState, contentSheets: T_Sheets): { min: number, max: number } => {
    let res = {
        min: 0,
        max: 0
    }
    const { percentiledMin, percentiledMax } = getPercentiledCriticalValues(utils, contentSheets)
    const { indicators, years } = utils
    console.log({contentSheets});
    
        indicators.allNames.forEach(indicatorName => {
            contentSheets[indicators.byName[indicatorName].abbr].forEach((row) => {
                years.forEach(year => {
                    const value = +row[year]
                    
                    if(isNaN(value)) return
                    
                    if(value > res.max && percentiledMax <= value) return res.max = value
                    if(value < res.min && percentiledMin >= res.min) res.min = value
                })
            })
        })
    return res
}

const PERCENTILE = 30
const getPercentiledCriticalValues = (utils: RootState, contentSheets: T_Sheets): { percentiledMin: number, percentiledMax: number } => {
    const { indicators, years } = utils
    const allValues: number[] = []
        indicators.allNames.forEach(indicatorName => {
            
            contentSheets[indicators.byName[indicatorName].abbr].forEach((row) => {
                years.forEach(year => {
                    allValues.push(+row[year])
                })
            })
        })

    const percentileCount = Math.round(allValues.length * PERCENTILE / 100)
    console.log(allValues.length);
    
    allValues.splice(0, percentileCount)
    console.log(allValues.length);
    allValues.splice(allValues.length - percentileCount, allValues.length)
    console.log(allValues.length);
    return {
        percentiledMax: allValues[0],
        percentiledMin: allValues[allValues.length - 1]
    }
}
