import { T_ListsState, T_Indicator } from "store/lists/types";
import { T_SettingsState, T_IndicatorSettings } from "store/settings/types";
import { T_Value, T_ValuesState } from "store/values/types";
import XLSX from "xlsx";

type T_Data = {
    lists: T_ListsState, 
    values: T_ValuesState
    settings: T_SettingsState
}

export const processWorkbookData = (workbook: XLSX.WorkBook): T_Data => {
    const { SheetNames: [ settingSheetName ], Sheets } = workbook
    const settingsSheet = XLSX.utils.sheet_to_json<T_IndicatorSettings>(Sheets.settings)
    const indicatorAbbrNames: T_Indicator['name'][] = settingsSheet.map(indicator => indicator.abbr)
    const indicatorFullNames: T_Indicator['name'][] = settingsSheet.map(indicator => indicator.name)
    console.log({settingSheetName});
    
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
    
    const template = XLSX.utils.sheet_to_json(Sheets[indicatorAbbrNames[0]])
    
    template.forEach((row: any) => result.lists.countries.push(row.Country))
    
    
    const { Country, ...years } = template[0] as any
    
    result.lists.years = Object.keys(years)
    
    indicatorAbbrNames.forEach((indicatorAbbrName, i) => {
        const indicatorFullName = indicatorFullNames[i]
        const rows: any[] = XLSX.utils.sheet_to_json(Sheets[indicatorAbbrName]);
        console.log(rows, result.lists.years[0]);
        
        if(!rows[0][result.lists.years[0]]) return

        result.lists.indicators.push()
        
        rows.forEach((columns: any) => {
            const { Country } = columns
            if(!Country) return
            result.lists.years.forEach((year: any) => {
                if(!columns[year]) return
                if(!result.values[Country]) result.values[Country] = {}
                if(!result.values[Country][indicatorFullName]) result.values[Country][indicatorFullName] = {}
                result.values[Country][indicatorFullName][year] = columns[year]
            })
        })
    });
    console.log(processIndices(result));
    
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
