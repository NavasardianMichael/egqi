import { SET_INDICES } from "./actionTypes"
import { T_IndicesActions, T_IndicesState } from "./types"

export const initialIndicesState: T_IndicesState = {}

export function indicesReducer(state: T_IndicesState = initialIndicesState, action: T_IndicesActions): T_IndicesState {
    switch (action.type) {
        case SET_INDICES:
            return {
                ...action.payload
            }
        default:
            return state
    }
}

export default indicesReducer