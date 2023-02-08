import { T_Country } from "store/countries/types"
import { T_Indicator } from "store/indicators/types"
import { T_Year } from "store/years/types"

export type T_Row = {
    'Country Name': T_Country['name']
    [key: T_Year]: number
}

export type T_Sheets = {
    [key: T_Indicator['name']]: T_Row[]
}

export type T_NormalizedValues = {
    [key: T_Country['id']]: {
        [key: T_Indicator['name']]: {
            [key: T_Year]: number
        }
    }
}