import { COL_NAMES, COL_SORT_TYPES } from "helpers/constants/indices"
import { SET_COUNTRIES, SORT_COUNTRIES } from "./actionTypes"
import { T_CountriesActions, T_CountriesState, T_Country } from "./types"

export const initialCountriesState: T_CountriesState = {
    byName: {},
    allNames: []
}

export function countriesReducer(state: T_CountriesState = initialCountriesState, action: T_CountriesActions): T_CountriesState {
    switch (action.type) {
        case SET_COUNTRIES:
            return {
                ...state,
                ...action.payload
            }
        case SORT_COUNTRIES:
            const { col, order, indices } = action.payload
            let newNames: T_CountriesState['allNames'] = [...state.allNames]
            
            if(col === COL_NAMES.country) {
                    order !== COL_SORT_TYPES[1] ? 
                    newNames.sort((a: T_Country['name'], b: T_Country['name']) => {
                        if(a > b) return 1
                        if(a < b) return -1
                        return 0                        
                    })  :
                    newNames.sort((a: any, b: any) => {
                        if(a > b) return -1
                        if(a < b) return 1
                        return 0                        
                    }) 
            } else {
                order !== COL_SORT_TYPES[1] ?
                newNames.sort((a: T_Country['name'], b: T_Country['name']) => {
                    return indices[a].means[col].value - indices[b].means[col].value
                }) :
                newNames.sort((a: T_Country['name'], b: T_Country['name']) => {
                    return indices[b].means[col].value - indices[a].means[col].value
                })
            }
            return {
                ...state,
                allNames: newNames
            }
        default:
            return state
    }
}

export default countriesReducer