import { SET_YEARS } from "./actionTypes"
import { T_YearsActions, T_YearsState } from "./types"

export const initialYearsState: T_YearsState = []

export function yearsReducer(state: T_YearsState = initialYearsState, action: T_YearsActions): T_YearsState {
    switch (action.type) {
        case SET_YEARS:
            return [
                ...state,
                ...action.payload
            ]
        default:
            return state
    }
}

export default yearsReducer