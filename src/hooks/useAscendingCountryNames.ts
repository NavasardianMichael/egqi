import { useMemo } from "react"
import { useSelector } from "react-redux"
import { selectCountriesState } from "store/countries/selectors"
import { T_CountriesState } from "store/countries/types"

export const useAscendingCountryNames = (): T_CountriesState => {
    const countries = useSelector(selectCountriesState)

    return useMemo(() => {
        return {
            allNames: [...countries.allNames].sort(),
            byName: countries.byName
        }
    }, [countries])
}