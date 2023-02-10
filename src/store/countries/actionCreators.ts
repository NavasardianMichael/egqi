import { SET_COUNTRIES, SORT_COUNTRIES } from "./actionTypes"
import { T_SetCountries, T_SortCountries } from "./types"

export const setCountriesState: T_SetCountries = (countries) => {
    return {
        type: SET_COUNTRIES,
        payload: countries
    }
}

export const sortCountries: T_SortCountries = (options) => {
    return {
        type: SORT_COUNTRIES,
        payload: options
    }
}