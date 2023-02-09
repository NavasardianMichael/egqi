import { T_Country } from "store/countries/types"
import { T_Year } from "store/years/types"
import { SET_INDICES } from "./actionTypes"

export type T_Indices = {
    egqi: number
    egqgi: number
    egqei: number
}

export type T_IndicesState = {
    [key: T_Country['name']]: {
        byYear: {
            [key: T_Year]: T_Indices
        }
        means: T_Indices
    }
}

export type T_SetIndices = (indices: T_IndicesState) => {
    type: typeof SET_INDICES,
    payload: T_IndicesState
}

export type T_IndicesActions = ReturnType<T_SetIndices>