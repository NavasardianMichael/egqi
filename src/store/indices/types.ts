import { T_Country } from "store/countries/types"
import { T_Indicator } from "store/indicators/types"
import { T_Year } from "store/years/types"
import { SET_INDICES } from "./actionTypes"

export type T_Indices = {
    egqi: number
    egqgi: number
    egqei: number
    egqemr: number
}

export type T_IndicesByIndicator = {
    [key: T_Indicator['name']]: {
        [key: T_Year]: number
    }
}

export type T_IndicesState = {
    [key: T_Country['name']]: {
        byIndicator: T_IndicesByIndicator
        means: T_Indices
    }
}

export type T_SetIndices = (indices: T_IndicesState) => {
    type: typeof SET_INDICES,
    payload: T_IndicesState
}

export type T_IndicesActions = ReturnType<T_SetIndices>