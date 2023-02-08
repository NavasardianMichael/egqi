import { SET_INDICATORS } from "./actionTypes"
import { T_IndicatorsActions, T_IndicatorsState } from "./types"

export const initialIndicatorsState: T_IndicatorsState = {
    byName: {},
    allNames: []
}

export function indicatorsReducer(state: T_IndicatorsState = initialIndicatorsState, action: T_IndicatorsActions): T_IndicatorsState {
    switch (action.type) {
        case SET_INDICATORS:
            return {
                ...state
            }
        default:
            return state
    }
}

export default indicatorsReducer