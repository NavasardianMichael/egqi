import { COUNTRY_CODES_BY_NAMES } from "helpers/constants.ts/countries";
import { RootState } from "index";
import { initialCountriesState } from "store/countries/reducer";
import { T_CountriesState, T_Country } from "store/countries/types";
import { initialIndicatorsState } from "store/indicators/reducer";
import { T_Indicator, T_IndicatorsState } from "store/indicators/types";
import { initialIndicesState } from "store/indices/reducer";
import { T_IndicesState } from "store/indices/types";
import { T_Year, T_YearsState } from "store/years/types";
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

type T_Row = {
    'Country Name': T_Country['name']
    [key: T_Year]: number
}

type T_Sheets = {
    [key: T_Indicator['name']]: T_Row[]
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

export const processIndices = (data: RootState): T_IndicesState => {

    const normalized = normalizeValues(data)
    console.log({normalized});
    
    
}

const normalizeValues = (data: RootState) => {
    const { min, max } = getCriticalValues(data)
    const distance = max - min 
    
    data.countries.allIds.forEach(country => {
        data.indicators.allNames.forEach(indicator => {
            data.years.forEach(year => {
                const value = +values[country][indicator][year]
                if(isNaN(value)) return
                values[country][indicator][year] = (value - min) / distance * 100
            })
        })
    })
    return data
}

// const PERCENTILE = 3

const getCriticalValues = (data: T_Data): { min: number, max: number } => {
    let res = {
        min: 0,
        max: 0
    }
    const { percentiledMin, percentiledMax } = getPercentiledCriticalValues(data)
    const { values, lists: { countries, indicators, years } } = data
    
    countries.forEach(country => {
        indicators.forEach(indicator => {
            years.forEach(year => {
                const value = +values[country][indicator][year]
                if(isNaN(value)) return
                
                if(value > res.max && percentiledMax <= value) return res.max = value
                if(value < res.min && percentiledMin >= res.min) res.min = value
            })
        })
    })
    return res
}

const getPercentiledCriticalValues = (data: T_Data): { percentiledMin: number, percentiledMax: number } => {
    const { values, lists: { countries, indicators, years } } = data
    const allValues: T_Value['value'][] = []
    countries.forEach(country => {
        indicators.forEach(indicator => {
            years.forEach(year => {
                console.log({values, country, indicator, year});
                
                allValues.push(+values[country][indicator][year])
            })
        })
    })

    const percentileCount = Math.round(allValues.length * PERCENTILE / 100)
    allValues.splice(0, percentileCount)
    allValues.splice(allValues.length - percentileCount, allValues.length)
    console.log(allValues.length);
    return {
        percentiledMax: allValues[0],
        percentiledMin: allValues[allValues.length - 1]
    }
}
