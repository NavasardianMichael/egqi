import { T_ListsState } from "store/lists/types";
import { T_SettingsState } from "store/settings/types";
import { T_Value, T_ValuesState } from "store/values/types";
import XLSX from "xlsx";

type T_Data = {
    lists: T_ListsState, 
    values: T_ValuesState
    settings: T_SettingsState
}

export const processWorkbookData = (workbook: XLSX.WorkBook): T_Data => {
    const { SheetNames: [ _, ...sheetNames ], Sheets } = workbook
    const result: T_Data = {
        lists: {
            countries: [],
            indicators: [],
            years: []
        },
        values: {},
        settings: {}
    }

    processSettings(workbook)
    
    const template = XLSX.utils.sheet_to_json(Sheets[sheetNames[0]])
    
    template.forEach((row: any) => result.lists.countries.push(row.Country))
    
    
    const { Country, ...years } = template[0] as any
    result.lists.years = Object.keys(years)
    
    sheetNames.forEach((indicator) => {
        const rows: any[] = XLSX.utils.sheet_to_json(Sheets[indicator]);
        if(!rows[0][result.lists.years[0]]) return

        result.lists.indicators.push(indicator)
        
        rows.forEach((columns: any) => {
            const { Country } = columns
            if(!Country) return
            result.lists.years.forEach((year: any) => {
                if(!columns[year]) return
                if(!result.values[Country]) result.values[Country] = {}
                if(!result.values[Country][indicator]) result.values[Country][indicator] = {}
                result.values[Country][indicator][year] = columns[year]
            })
        })
    });
    return result
}

const processSettings = (workbook: XLSX.WorkBook) => {
    const { SheetNames, Sheets } = workbook
    console.log({Sheets, SheetNames: SheetNames[0]}, Sheets[SheetNames[0]]);
    
    const settings = XLSX.utils.sheet_to_json(Sheets[SheetNames[0]])
    console.log({settings});
    
}

export const processIndices = (data: T_Data) => {

    const normalized = normalizeValues(data)
    console.log({normalized});
    
    
}

const normalizeValues = (data: T_Data) => {
    const { min, max } = getCriticalValues(data)
    const distance = max - min 

    const { values, lists: { countries, indicators, years } } = data

    countries.forEach(country => {
        indicators.forEach(indicator => {
            years.forEach(year => {
                const value = +values[country][indicator][year]
                if(isNaN(value)) return
                values[country][indicator][year] = (value - min) / distance * 100
            })
        })
    })
    return data
}

const PERCENTILE = 3

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
