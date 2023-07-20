import { SET_APP_STATE } from "./actionTypes"
import { T_SetAppState } from "./types"

export const setAppState: T_SetAppState = (app) => {
    return {
        type: SET_APP_STATE,
        payload: app
    }
}