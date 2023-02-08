import { SET_INDICES } from "./actionTypes"
import { T_SetIndices } from "./types"

export const setIndices: T_SetIndices = (indicesState) => {
    return {
        type: SET_INDICES,
        payload: indicesState
    }
}