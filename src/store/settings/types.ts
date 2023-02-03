import { T_Indicator } from "store/lists/types"
import { SET_SETTINGS } from "./actionTypes"

export type T_SettingsState = {
    percentile: number
    weights: {
        [key: T_Indicator['name']]: number
    }
}

export type T_setSettings = (settings: Partial<T_SettingsState>) => {
    type: typeof SET_SETTINGS,
    payload: Partial<T_SettingsState>
}

export type T_SettingsActions = ReturnType<T_setSettings>