import { STATS_TYPES } from 'helpers/constants.ts/indices';
import { RootState } from 'index';
import { T_Country } from 'store/countries/types';
import { T_Year } from 'store/years/types';
import XLSX from 'xlsx'

export const generateExcelFile = (data: any, fileName: string) => {
  try {
    const workbook = XLSX.utils.book_new();  
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EGQI data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
    
    let res = XLSX.write(workbook, { type: "array" });
    console.log(`${res.byteLength} bytes generated`);
  
} catch (err) {
    console.error("Error:", err);
  }
}

export const generateSummaryExcelFile = (data: RootState) => {
    const { countries, indices } = data
    const processed = countries.allNames.map(countryName => {
        return {
            'Country Name': countryName,
            EGQGI: indices[countryName].means.egqgi.value, 
            EGQEI: indices[countryName].means.egqei.value, 
            EGGI: indices[countryName].means.egqi.value, 
            'EGQGI ranking': indices[countryName].means.egqgi.ranking, 
            'EGQEI ranking': indices[countryName].means.egqei.ranking, 
            'EGGI ranking': indices[countryName].means.egqi.ranking,
        }
    })
    generateExcelFile(processed, 'EGQI Summary')
}

export const generateSummaryByYearsRowsExcelFile = (data: RootState) => {
    const { countries, years, indices } = data
    const processed = countries.allNames.reduce((state: any, countryName) => {
        years.forEach((year) => {
            state.push({
                'Country Name': countryName,
                'Year': year,
                ...STATS_TYPES.reduce((state: any, type) => {
                    state[type.toUpperCase()] = indices[countryName].byYear[year][type].value
                    return state
                }, {}),
                ...STATS_TYPES.reduce((state: any, type) => {
                    state[type.toUpperCase() + ' ranking'] = indices[countryName].byYear[year][type].ranking
                    return state
                }, {})
            })
        })
        return state
    }, [])
    
    generateExcelFile(processed, 'EGQI Summary by Years (Rows)')
}

export const generateSummaryByYearsColumnsExcelFile = (data: RootState) => {
    const { countries, years, indices } = data
    const processedValues = countries.allNames.reduce((state: any, countryName) => {
        STATS_TYPES.forEach(type => {
            state.push({
                'Country Name': countryName,
                'Index Name': type.toUpperCase(),
                ...years.reduce((state: any, year) => {
                    state[year] = indices[countryName].byYear[year][type].value
                    return state
                }, {}),
                ...years.reduce((state: any, year) => {
                    state[year + ' rank'] = indices[countryName].byYear[year][type].ranking
                    return state
                }, {})
            })
        })
        return state
    }, [])
    
    generateExcelFile(processedValues, 'EGQI Summary by Years (Columns)')
}

export const generateIndicatorsExcelFile = (data: RootState) => {
    const { countries, indicators, years, indices } = data
    const processed = indicators.allNames.reduce((state: any, indicatorName) => {
        countries.allNames.forEach((countryName) => {
            state.push({
                'Country Name': countryName,
                'Indicator Name': indicatorName,
                ...years.reduce((state: {[key: T_Year]: number}, year) => {
                    state[year] = indices[countryName].byIndicator[indicatorName].byYear[year].normalized.value
                    return state
                }, {}),
                'Average': indices[countryName].byIndicator[indicatorName].average.value,
                '': null,
                ...years.reduce((state: { [key: string]: number }, year) => {
                    state[year + ' ranking'] = indices[countryName].byIndicator[indicatorName].byYear[year].normalized.ranking
                    return state
                }, {}),
                'Average ranking': indices[countryName].byIndicator[indicatorName].average.ranking,
            })
        })
        return state
    }, [])
    
    generateExcelFile(processed, 'EGQI normalized indicators')
}

export const generateOriginalIndicatorsExcelFile = (data: RootState) => {
    const { countries, indicators, years, indices } = data
    const processed = indicators.allNames.reduce((state: any, indicatorName) => {
        countries.allNames.forEach((countryName) => {
            state.push({
                'Country Name': countryName,
                'Indicator Name': indicatorName,
                ...years.reduce((state: {[key: T_Year]: number}, year) => {
                    state[year] = indices[countryName].byIndicator[indicatorName].byYear[year].original.value
                    return state
                }, {})
            })
        })
        return state
    }, [])
    
    generateExcelFile(processed, 'EGQI original indicators')
}

export const generateCountryIndicesByYearsExcelFile = (data: Omit<RootState, 'app'> & { countryName: T_Country['name'] }) => {
    const { years, indices, countryName } = data
    const processed = STATS_TYPES.map(type => {
        return {
            'Country': countryName,
            'Index Name': type.toUpperCase(),
            ...years.reduce((state: { [key: T_Year]: number }, year) => {
                state[year] = indices[countryName].byYear[year][type].value
                return state
            }, {}),
            'Average': indices[countryName].means[type].value,
            '': null,
            ...years.reduce((state: { [key: string]: number }, year) => {
                state[year + ' ranking'] = indices[countryName].byYear[year][type].ranking
                return state
            }, {}),
            'Average ranking': indices[countryName].means[type].ranking,
        }
    })
    
    generateExcelFile(processed, `${countryName} EGQI Details`)
}

export const generateCountryAllValuesExcelFile = (data: Omit<RootState, 'app'> & { countryName: T_Country['name'] }) => {
    const { years, indicators, indices, countryName } = data
    const processed = indicators.allNames.map(indicatorName => {
        return {
            'Country': countryName,
            'Indicator': indicatorName,
            ...years.reduce((state: { [key: T_Year]: number }, year) => {
                state[year] = indices[countryName].byIndicator[indicatorName].byYear[year].normalized.value
                return state
            }, {}),
            'Average': indices[countryName].byIndicator[indicatorName].average.value,
            '': null,
            ...years.reduce((state: { [key: string]: number }, year) => {
                state[year + ' ranking'] = indices[countryName].byIndicator[indicatorName].byYear[year].normalized.ranking
                return state
            }, {}),
            'Average ranking': indices[countryName].byIndicator[indicatorName].average.ranking,
        }
    })
    
    generateExcelFile(processed, `${countryName} EGQI Details`)
}