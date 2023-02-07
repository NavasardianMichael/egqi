import { T_Indicator } from "store/lists/types"
import { SET_SETTINGS } from "./actionTypes"

export type T_IndicatorSettings = {
    name: T_Indicator['name']
    percentile: number
    weight: number
    subindex: number
}

export type T_SettingsState = {
    [key: T_Indicator['name']]: T_IndicatorSettings
}

export type T_setSettings = (settings: Partial<T_SettingsState>) => {
    type: typeof SET_SETTINGS,
    payload: Partial<T_SettingsState>
}

export type T_SettingsActions = ReturnType<T_setSettings>