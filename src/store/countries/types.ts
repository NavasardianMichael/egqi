import { COL_NAMES, COL_SORT_TYPES } from "helpers/constants/indices"
import { T_IndicesState } from "store/indices/types"
import { SET_COUNTRIES, SORT_COUNTRIES } from "./actionTypes"

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

export type T_SortCountries = (options: { col: keyof typeof COL_NAMES, order: keyof typeof COL_SORT_TYPES, indices: T_IndicesState }) => {
    type: typeof SORT_COUNTRIES,
    payload: typeof options
}

export type T_CountriesActions = ReturnType<T_SetCountries> | ReturnType<T_SortCountries>