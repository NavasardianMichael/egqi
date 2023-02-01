import { SET_LISTS } from "./actionTypes"
import { T_ListsActions, T_ListsState } from "./types"

export const initialListsState: T_ListsState = {
    countries: [],
    indicators: [],
    years: [],
}

export function listsReducer(state: T_ListsState = initialListsState, action: T_ListsActions): T_ListsState {
    switch (action.type) {
        case SET_LISTS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default listsReducer