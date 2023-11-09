import XLSX from "xlsx";

import { COUNTRY_CODES_BY_NAMES } from "helpers/constants.ts/countries";
import { INDICES_INITIALS, STATS_TYPES, SUBINDEX_TYPES } from "helpers/constants.ts/indices";
import { T_Row, T_Sheets } from "helpers/types/processors";
import { RootState } from "index";
import { initialCountriesState } from "store/countries/reducer";
import { T_CountriesState, T_Country } from "store/countries/types";
import { initialIndicatorsState } from "store/indicators/reducer";
import { T_Indicator, T_IndicatorsState } from "store/indicators/types";
import { T_Indices, T_IndicesByIndicator, T_IndicesByYear, T_IndicesState, T_Pair } from "store/indices/types";
import { T_Year, T_YearsState } from "store/years/types";
import { geoMean } from "./commons";

export const processWorkbookData = (workbook: XLSX.WorkBook) => {
    const { SheetNames: [ indicatorsSheetName, ...indicesSheetNames ], Sheets } = workbook
    const workbookJsonSheet = workbookContentToJson(indicesSheetNames, Sheets)

    const countries = processCountries(workbookJsonSheet[indicesSheetNames[0]]) 
    const indicators = processIndicators(Sheets[indicatorsSheetName])
    const years = processYears(workbookJsonSheet[indicesSheetNames[0]][0])
    const initialValues = processInitialValues({countries, indicators, years}, workbookJsonSheet)

    const result: Omit<RootState, 'app'> = {
        countries,
        indicators,
        years,
        indices: processIndices({countries, indicators, years, indices: initialValues})
    }
    console.log({result});
    
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
        state.allNames = [...state.allNames.sort()]
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

const processInitialValues = (utils: Omit<RootState, 'indices' | 'app'>, contentSheets: T_Sheets): T_IndicesState => {
    const { indicators, years } = utils
    
    let result: T_IndicesState = {}
    
    indicators.allNames.forEach((indicatorName) => {
        const indicator = indicators.byName[indicatorName]        
        
        contentSheets[indicator.abbr].forEach((row) => {
            const countryName = row['Country Name'];
            years.forEach(year => {
                const value = processValue(row, year, years)

                if(!result[countryName]) result[countryName] = {
                    byIndicator: {},
                    byYear: {},
                    means: {
                        egqei: {
                            value: Infinity,
                            ranking: 0
                        },
                        egqgi: {
                            value: Infinity,
                            ranking: 0
                        },
                        egqi: {
                            value: Infinity,
                            ranking: 0
                        },
                        erqigr: {
                            value: Infinity,
                            ranking: 0
                        },
                    }
                }
                if(!result[countryName].byIndicator[indicatorName]) {
                    result[countryName].byIndicator[indicatorName] = {
                        byYear: {},
                        average: {
                            value: 1,
                            ranking: 0
                        }
                    }
                }
                
                result[countryName].byIndicator[indicatorName].byYear[year] = {
                    normalized: {
                        value: Infinity,
                        ranking: 0
                    },
                    original: {
                        value,
                        ranking: 0
                    },
                }
            })
        })
    })
    
    return result
    
}

const processValue = (row: T_Row, currentYear: T_Year, years: T_YearsState): number => {
    const value = +row[currentYear]
    if(!isNaN(value)) return value

    const initialSplittedYears: [number[], number[]]  = [[], []]
    const [pastYears, futureYears] = years.reduce((acc, current) => {
        if(current === currentYear) return acc

        acc[current > currentYear ? 1 : 0].push(current)
        return acc
    }, initialSplittedYears)

    const lastKnownValue = pastYears.reverse().reduce((acc, current) => {
        return isNaN(acc) ? +row[current] : acc
    }, value)
    
    if(!isNaN(lastKnownValue)) return lastKnownValue

    const firstKnownValue = futureYears.reduce((acc, current) => {
        return isNaN(acc) ? +row[current] : acc
    }, value)
    
    return firstKnownValue
}

export const processIndices = (utils: Omit<RootState, 'app'>): T_IndicesState => {

    const normalizedValues = normalizeValues(utils)
    
    const { countries, indicators, years } = utils
    
    let result: T_IndicesState = {}
    
    countries.allNames.forEach(countryName => {
        const countryIndicators = normalizedValues[countryName].byIndicator
        
        const indicesByYears = processIndicesByYear(utils, countryIndicators)
        
        result[countryName] = {
            byIndicator: countryIndicators,
            byYear: indicesByYears,
            means: processIndicesMeans(utils, indicesByYears)
        }
    })

    indicators.allNames.forEach(indicatorName => {
        const { affect } = indicators.byName[indicatorName]
        years.forEach(year => {
            let rankingUtil: ({ name: T_Country['name'], normalized: number, original: number })[] = []
            countries.allNames.forEach(countryName => {
                rankingUtil.push({
                    name: countryName,
                    original: result[countryName].byIndicator[indicatorName].byYear[year].original.value,
                    normalized: result[countryName].byIndicator[indicatorName].byYear[year].normalized.value,
                })
            });
            
            rankingUtil.sort((a,b) => b.original - a.original)
            
            if(affect < 0) rankingUtil = rankingUtil.reverse()
            rankingUtil.forEach((data, i) => {
                result[data.name].byIndicator[indicatorName].byYear[year].original.ranking = (i + 1)
            })

            rankingUtil.sort((a,b) => b.normalized - a.normalized)
            rankingUtil.forEach((data, i) => {
                result[data.name].byIndicator[indicatorName].byYear[year].normalized.ranking = (i + 1)
            })
        })
    })

    indicators.allNames.forEach(indicatorName => {
        let rankingUtil: { name: T_Country['name'], value: T_Pair['value'] }[] = []
        countries.allNames.forEach(countryName => {
            rankingUtil.push({
                name: countryName,
                value: result[countryName].byIndicator[indicatorName].average.value
            })
        })
        rankingUtil.sort((a,b) => b.value - a.value)
        rankingUtil.forEach(({ name }, i) => {
            result[name].byIndicator[indicatorName].average.ranking = (i + 1) 
        })
    })


    STATS_TYPES.forEach(statName => {
        let rankingUtil: { name: T_Country['name'], value: T_Pair['value'] }[] = []
        countries.allNames.forEach(countryName => {
            rankingUtil.push({
                name: countryName,
                value: result[countryName].means[statName].value
            })
        })

        rankingUtil.sort((a,b) => b.value - a.value)
        rankingUtil.forEach(({ name }, i) => {
            result[name].means[statName].ranking = (i + 1) 
        })
    })

    years.forEach(year => {
        STATS_TYPES.forEach(statName => {
            let rankingUtil: { name: T_Country['name'], value: T_Pair['value'] }[] = []
            countries.allNames.forEach(countryName => {
                rankingUtil.push({
                    name: countryName,
                    value: result[countryName].byYear[year][statName].value
                })
            })

            rankingUtil.sort((a,b) => b.value - a.value)
            rankingUtil.forEach(({ name }, i) => {
                result[name].byYear[year][statName].ranking = (i + 1)
            })
        })
    })
    
    return result
}

const processIndicesByYear = (utils: Omit<RootState, 'indices' | 'app'>, countryIndicators: T_IndicesByIndicator): T_IndicesByYear => {
    const { indicators, years } = utils
    
    const indicesByYears = years.reduce((state: T_IndicesByYear, year) => {
        const indices = indicators.allNames.reduce((indicesState, indicatorName, i, arr) => {
            const { subindex, weight } = indicators.byName[indicatorName]
            const currentNormalizedValue = countryIndicators[indicatorName].byYear[year].normalized.value

            if(subindex === SUBINDEX_TYPES[0]) {
                indicesState.egqgi.value *= Math.pow(currentNormalizedValue, weight)
            } else {
                indicesState.egqei.value *= Math.pow(currentNormalizedValue, weight)
            }

            if(i === arr.length - 1) {
                indicesState.egqi.value = geoMean(indicesState.egqgi.value, indicesState.egqei.value)
            }
            
            return indicesState
        }, JSON.parse(JSON.stringify(INDICES_INITIALS)))
        
        state[year] = {...indices}
        state[year].erqigr.value = (
            state[year - 1] ?
            state[year].egqi.value / state[year - 1].egqi.value * 100 :
            1
        )

        return state
    }, {})

    return indicesByYears
}

const processIndicesMeans = (utils: Omit<RootState, 'indices' | 'app'>, indicesByYears: T_IndicesByYear): T_Indices => {
    const { years } = utils
    return years.reduce((state, year, i, arr) => {
        state.egqgi.value *= indicesByYears[year].egqgi.value
        state.egqei.value *= indicesByYears[year].egqei.value
        state.egqi.value *= indicesByYears[year].egqi.value
        state.erqigr.value *= indicesByYears[year].erqigr.value
        if(i === arr.length - 1) {
            state.egqgi.value = Math.pow(state.egqgi.value, 1/years.length)
            state.egqei.value = Math.pow(state.egqei.value, 1/years.length)
            state.egqi.value = Math.pow(state.egqi.value, 1/years.length)
            state.erqigr.value = Math.pow(state.erqigr.value, 1/(years.length - 1))
        }
        return state
    }, JSON.parse(JSON.stringify(INDICES_INITIALS)))
}

const normalizeValues = (utils: Omit<RootState, 'app'>): T_IndicesState => { 
    const { countries, indicators, years, indices } = utils
    let result = indices
    
    countries.allNames.forEach(countryName => {        
        indicators.allNames.forEach((indicatorName) => {
            const indicator = indicators.byName[indicatorName]
            const { min, max } = getCriticalValues(utils, indicatorName)
            indicators.byName[indicatorName].min = min
            indicators.byName[indicatorName].max = max
            
            const distance = max - min;
            
            years.forEach((year) => {
                const value = +indices[countryName].byIndicator[indicatorName].byYear[year].original.value
                
                if(isNaN(value)) return

                let normalizedValue = (indices[countryName].byIndicator[indicatorName].byYear[year].original.value - min) / distance * 100
                
                if(indicator.affect === -1) normalizedValue = 100 - normalizedValue
                result[countryName].byIndicator[indicator.name].byYear[year].normalized.value = (
                    Math.max(Math.min(normalizedValue, 100), 0.00001)
                )
                result[countryName].byIndicator[indicator.name].average.value *= result[countryName].byIndicator[indicator.name].byYear[year].normalized.value
            })
            result[countryName].byIndicator[indicator.name].average.value = Math.pow(result[countryName].byIndicator[indicator.name].average.value, 1/years.length)
        })
    })


    return result
}

const getCriticalValues = (utils: Omit<RootState, 'app'>, indicatorName: T_Indicator['name']): { min: number, max: number } => {
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

const getPercentiledCriticalValues = (utils: Omit<RootState, 'app'>, indicatorName: T_Indicator['name']): { percentiledMin: number, percentiledMax: number } => {
    const { indicators, years, countries, indices } = utils
    const { percentile } = indicators.byName[indicatorName]
    
    let allValues: number[] = []
            
    countries.allNames.forEach(countryName => {
        years.forEach(year => {
            const value = indices[countryName].byIndicator[indicatorName].byYear[year].original.value;
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