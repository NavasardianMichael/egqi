import { SET_INDICATORS } from "./actionTypes"

export type T_Indicator = {
    abbr: string
    name: string
    percentile: number
    weight: number
    subindex: 0 | 1
    affect: 1 | -1
    min: number
    max: number
}

export type T_IndicatorsState = {
    byName: {
        [key: T_Indicator['name']]: T_Indicator
    }
    allNames: T_Indicator['name'][]
}

export type T_SetIndicators = (indicators: Partial<T_IndicatorsState>) => {
    type: typeof SET_INDICATORS,
    payload: Partial<T_IndicatorsState>
}

export type T_IndicatorsActions = ReturnType<T_SetIndicators>