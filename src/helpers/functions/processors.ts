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

    const countries = processCountries(workbookJsonSheet[indicesSheetNames[0]]) 
    const indicators = processIndicators(Sheets[indicatorsSheetName])
    const years = processYears(workbookJsonSheet[indicesSheetNames[0]][0])

    const result: RootState = {
        countries,
        indicators,
        years,
        indices: processIndices({countries, indicators, years}, workbookJsonSheet)
    }
    result.indices = processIndices(result, workbookJsonSheet)
    console.log({result});
    
    return result
}

export const processIndices = (utils: Omit<RootState, 'indices'>, contentSheets: T_Sheets): T_IndicesState => {

    const normalized = normalizeValues(utils, contentSheets)
    console.log({normalized});
    return {
        
    }
    
}

const normalizeValues = (utils: Omit<RootState, 'indices'>, contentSheets: T_Sheets): T_NormalizedValues => { 
    let result: T_NormalizedValues = {}

    const { indicators, years } = utils
    
    indicators.allNames.forEach((indicatorName) => {
        const { min, max } = getCriticalValues(utils, contentSheets[indicators.byName[indicatorName].abbr])
        const distance = max - min
        contentSheets[indicators.byName[indicatorName].abbr].forEach((row) => {
            const countryName = row["Country Name"]
            years.forEach((year) => {
                const value = +row[year]
                if(isNaN(value)) return

                const normalizedValue = (value - min) / distance * 100
                
                if(!result[countryName]) result[countryName] = {}
                if(!result[countryName][indicators.byName[indicatorName].name]) result[countryName][indicators.byName[indicatorName].name] = {}
                result[countryName][indicators.byName[indicatorName].name][year] = Math.max(Math.min(normalizedValue, 100), 0)
            })
        })
    })
    return result
}


const getCriticalValues = (utils: Omit<RootState, 'indices'>, sheetRows: T_Row[]): { min: number, max: number } => {
    let res = {
        min: 0,
        max: 0
    }
    const { percentiledMin, percentiledMax } = getPercentiledCriticalValues(utils, sheetRows)
    const { years } = utils
    
    sheetRows.forEach((row) => {
        years.forEach(year => {
            const value = +row[year]
            
            if(isNaN(value)) return
            
            if(value > res.max && percentiledMax <= value) return res.max = value
            if(value < res.min && percentiledMin >= res.min) res.min = value
        })
    })
    return res
}

const PERCENTILE = 3
const getPercentiledCriticalValues = (utils: Omit<RootState, 'indices'>, sheetRows: T_Row[]): { percentiledMin: number, percentiledMax: number } => {
    const { years } = utils
    const allValues: number[] = []
            
    sheetRows.forEach((row) => {
        years.forEach(year => {
            allValues.push(+row[year])
        })
    })

    const percentileCount = Math.round(allValues.length * PERCENTILE / 100)
    
    allValues.splice(0, percentileCount)
    allValues.splice(allValues.length - percentileCount, allValues.length)
    return {
        percentiledMax: allValues[0],
        percentiledMin: allValues[allValues.length - 1]
    }
}
