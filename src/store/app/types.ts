import { SET_APP_STATE } from "./actionTypes"

export type T_AppState = {
    isProcessing: boolean
}

export type T_SetAppState = (app: Partial<T_AppState>) => {
    type: typeof SET_APP_STATE,
    payload: typeof app
}

export type T_AppActions = ReturnType<T_SetAppState>