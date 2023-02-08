import { SET_COUNTRIES } from "./actionTypes"
import { T_CountriesActions, T_CountriesState } from "./types"

export const initialCountriesState: T_CountriesState = {
    byId: {},
    allIds: []
}

export function countriesReducer(state: T_CountriesState = initialCountriesState, action: T_CountriesActions): T_CountriesState {
    switch (action.type) {
        case SET_COUNTRIES:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default countriesReducer