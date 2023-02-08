import { SET_YEARS } from "./actionTypes"

export type T_Year = number

export type T_YearsState = T_Year[]

export type T_SetYears = (years: T_YearsState) => {
    type: typeof SET_YEARS,
    payload: T_YearsState
}

export type T_YearsActions = ReturnType<T_SetYears>