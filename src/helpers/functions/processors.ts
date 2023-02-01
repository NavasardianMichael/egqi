import { T_ListsState } from "store/lists/types";
import { T_ValuesState } from "store/values/types";
import XLSX from "xlsx";

type T_Data = { lists: T_ListsState, values: T_ValuesState }

export const processWorkbookData = (workbook: XLSX.WorkBook): T_Data => {
    const { SheetNames, Sheets } = workbook
    const result: T_Data = {
        lists: {
            countries: [],
            indicators: SheetNames,
            years: []
        },
        values: {}
    }
    
    const templateSrc = XLSX.utils.sheet_to_json(Sheets[result.lists.indicators[0]])

    templateSrc.forEach((row: any) => result.lists.countries.push(row.Country))

    const { Country, ...years } = templateSrc[0] as any

    result.lists.years = Object.keys(years)
    

    // rows.forEach((row: any) => result.lists.countries.push(row.Country))
    result.lists.indicators.forEach(() => {
        // const rows = XLSX.utils.sheet_to_json(Sheets[indicator]);
        
        // rows.forEach((columns: any) => {
        //     const { Country } = columns
        //     columns.forEach((column: any) => {
        //         result[Country][sheet][column] = 
        //     })
        // })
    });
    return result
}