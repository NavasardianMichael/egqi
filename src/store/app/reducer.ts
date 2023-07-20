import { SET_APP_STATE } from "./actionTypes"
import { T_AppActions, T_AppState } from "./types"

const initialAppState: T_AppState = {
    isProcessing: false
}

export function appReducer(state: T_AppState = initialAppState, action: T_AppActions): T_AppState {
    switch (action.type) {
        case SET_APP_STATE:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default appReducer