import { T_Country } from "store/countries/types"
import { T_Indicator } from "store/indicators/types"
import { T_Year } from "store/years/types"
import { SET_INDICES } from "./actionTypes"

export type T_Pair = {
    value: number
    ranking: number
}

export type T_Indices = {
    egqi: T_Pair
    egqgi: T_Pair
    egqei: T_Pair
}

export type T_IndicesByIndicator = {
    [key: T_Indicator['name']]: {
        byYear: {
            [key: T_Year]: {
                original: T_Pair
                normalized: T_Pair
            }
        },
        average: T_Pair
    }
}

export type T_IndicesByYear = {
    [key: T_Country['name']]: T_Indices
}

export type T_IndicesState = {
    [key: T_Country['name']]: {
        byIndicator: T_IndicesByIndicator
        byYear: T_IndicesByYear
        means: T_Indices
    }
}

export type T_SetIndices = (indices: T_IndicesState) => {
    type: typeof SET_INDICES,
    payload: T_IndicesState
}

export type T_IndicesActions = ReturnType<T_SetIndices>