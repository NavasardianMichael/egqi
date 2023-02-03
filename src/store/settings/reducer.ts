import { SET_SETTINGS } from "./actionTypes"
import { T_SettingsActions, T_SettingsState } from "./types"

export const initialListsState: T_SettingsState = {
    percentile: 3,
    weights: {}
}

export function settingReducer(state: T_SettingsState = initialListsState, action: T_SettingsActions): T_SettingsState {
    switch (action.type) {
        case SET_SETTINGS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default settingReducer