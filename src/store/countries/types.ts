import { SET_COUNTRIES } from "./actionTypes"

export type T_Country = {
    abbr: string
    name: string
}

export type T_CountriesState = {
    byName: {
        [key: T_Country['name']]: T_Country
    }
    allNames: T_Country['name'][]
}

export type T_SetCountries = (state: T_CountriesState) => {
    type: typeof SET_COUNTRIES,
    payload: T_CountriesState
}

export type T_CountriesActions = ReturnType<T_SetCountries>