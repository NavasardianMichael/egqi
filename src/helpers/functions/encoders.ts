import { RootState } from 'index';
import { T_Year } from 'store/years/types';
import XLSX from 'xlsx'

export const generateExcelFile = (data: any, fileName: string) => {
  try {
    const workbook = XLSX.utils.book_new();  
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'indices');
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
    
    let res = XLSX.write(workbook, { type: "array" });
    console.log(`${res.byteLength} bytes generated`);
  
} catch (err) {
    console.error("Error:", err);
  }
}

export const generateIndicatorsExcelFile = (data: RootState) => {
    const { countries, indicators, indices, years } = data
    const processed = indicators.allNames.map(indicatorName => {
        return countries.allNames.map((countryName) => {
            return {
                'Country Name': countryName,
                'Indicator Name': indicatorName,
                ...years.reduce((state: {[key: T_Year]: number}, year) => {
                    state[year] = indices[countryName].byYear[year].egqei
                    return state
                }, {})
            }
        })
    })
    generateExcelFile(processed, 'EGQI indicators')
}

export const generateSummaryExcelFile = (data: RootState) => {
    const { countries, indices } = data
    const processed = countries.allNames.map(countryName => {
        return {
            'Country Name': countryName,
            EGQGI: indices[countryName].means.egqgi, 
            EGQEI: indices[countryName].means.egqei, 
            EGGI: indices[countryName].means.egqi, 
            EGQEMR: indices[countryName].means.egqemr, 
        }
    })
    generateExcelFile(processed, 'EGQI Summary')
}