import { SET_LISTS } from "./actionTypes"

export type T_Country = {
    name: string
}

export type T_Indicator = {
    name: string
}

export type T_Year = {
    name: number
}

export type T_ListsState = {
    countries: T_Country['name'][]
    indicators: T_Indicator['name'][]
    years: T_Year['name'][]
}

export type T_SetLists = (lists: T_ListsState) => {
    type: typeof SET_LISTS,
    payload: T_ListsState
}

export type T_ListsActions = ReturnType<T_SetLists>