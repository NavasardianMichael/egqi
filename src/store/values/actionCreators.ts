import { SET_VALUES } from "./actionTypes"
import { T_setValues } from "./types"

export const setLists: T_setValues = (values) => {
    return {
        type: SET_VALUES,
        payload: values
    }
}