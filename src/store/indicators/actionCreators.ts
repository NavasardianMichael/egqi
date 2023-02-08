import { SET_INDICATORS } from "./actionTypes"
import { T_SetIndicators } from "./types"

export const setIndicators: T_SetIndicators = (indicators) => {
    return {
        type: SET_INDICATORS,
        payload: indicators
    }
}