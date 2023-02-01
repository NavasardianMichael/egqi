import { SET_VALUES } from "./actionTypes"
import { T_ValuesActions, T_ValuesState } from "./types"

export const initialListsState: T_ValuesState = {}

export function valuesReducer(state: T_ValuesState = initialListsState, action: T_ValuesActions): T_ValuesState {
    switch (action.type) {
        case SET_VALUES:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default valuesReducer