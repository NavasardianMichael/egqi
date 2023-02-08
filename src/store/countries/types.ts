import { SET_COUNTRIES } from "./actionTypes"

export type T_Country = {
    id: string
    name: string
}

export type T_CountriesState = {
    byId: {
        [key: T_Country['id']]: T_Country
    }
    allIds: T_Country['id'][]
}

export type T_SetCountries = (state: T_CountriesState) => {
    type: typeof SET_COUNTRIES,
    payload: T_CountriesState
}

export type T_CountriesActions = ReturnType<T_SetCountries>