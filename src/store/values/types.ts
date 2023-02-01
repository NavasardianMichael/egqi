import { T_Country, T_Indicator, T_Year } from "store/lists/types"
import { SET_VALUES } from "./actionTypes"

export type T_Value = {
    value: string
}

export type T_ValuesState = {
    [key: T_Country['name']]: {
        [key: T_Indicator['name']]: {
            [key: T_Year['name']]: T_Value['value']
        }
    }
}

export type T_setValues = (lists: T_ValuesState) => {
    type: typeof SET_VALUES,
    payload: T_ValuesState
}

export type T_ValuesActions = ReturnType<T_setValues>