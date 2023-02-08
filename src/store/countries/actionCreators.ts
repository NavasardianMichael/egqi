import { SET_COUNTRIES } from "./actionTypes"
import { T_SetCountries } from "./types"

export const setCountriesState: T_SetCountries = (countries) => {
    return {
        type: SET_COUNTRIES,
        payload: countries
    }
}