import { RootState } from 'index';
import { T_Country } from 'store/countries/types';
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
    const { countries, indicators, years, indices } = data
    const processed = indicators.allNames.reduce((state: any, indicatorName) => {
        countries.allNames.forEach((countryName) => {
            state.push({
                'Country Name': countryName,
                'Indicator Name': indicatorName,
                ...years.reduce((state: {[key: T_Year]: number}, year) => {
                    state[year] = indices[countryName].byIndicator[indicatorName][year]
                    return state
                }, {})
            })
        })
        return state
    }, [])
    console.log({processed});
    
    generateExcelFile(processed, 'EGQI indicators')
}

export const generateIndicatorsRowsExcelFile = (data: RootState) => {
    const { countries, indicators, years, indices } = data
    let id = 1
    const processed = indicators.allNames.reduce((state: any, indicatorName) => {
        countries.allNames.forEach((countryName) => {
            years.forEach(year => {
                state.push({
                    id, 
                    'Country Name': countryName,
                    'Indicator Name': indicatorName,
                    year,
                    value: indices[countryName].byIndicator[indicatorName][year]  
                })
                id++
            })
        })
        return state
    }, [])
    console.log({processed});
    
    generateExcelFile(processed, 'EGQI indicators rows')
}

export const generateSummaryRowsExcelFile = (data: RootState) => {
    const { countries, indicators, years, indices } = data
    let id = 1
    const processed = countries.allNames.reduce((state: any[], countryName: T_Country['name']) => {
        years.forEach(year => {
            const calcIndices = indicators.allNames.reduce((indicesState: any, indicatorName) => {
                const { subindex, weight } = indicators.byName[indicatorName]
                indicesState[subindex === 0 ? 'EGQGI' : 'EGQEI'] += indices[countryName].byIndicator[indicatorName][year] * weight
                return indicesState
            }, {
                EGQGI: 0,
                EGQEI: 0
            })
            state.push({
                id, 
                'Country Name': countryName,
                year,
                ...calcIndices
            })
            id++
        })
        return state
    }, [])
    console.log({processed});
    
    generateExcelFile(processed, 'EGQI indicators rows')
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