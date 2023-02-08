import { SET_YEARS } from "./actionTypes"
import { T_SetYears } from "./types"

export const setYears: T_SetYears = (years) => {
    return {
        type: SET_YEARS,
        payload: years
    }
}