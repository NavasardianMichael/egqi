import { SET_LISTS } from "./actionTypes"
import { T_SetLists } from "./types"

export const setLists: T_SetLists = (lists) => {
    return {
        type: SET_LISTS,
        payload: lists
    }
}