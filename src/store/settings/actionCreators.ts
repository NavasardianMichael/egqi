import { SET_SETTINGS } from "./actionTypes"
import { T_setSettings } from "./types"

export const setSettings: T_setSettings = (settings) => {
    return {
        type: SET_SETTINGS,
        payload: settings
    }
}