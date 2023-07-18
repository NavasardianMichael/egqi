import { combineClassNames } from "helpers/functions/commons"
import { useAscendingCountryNames } from "hooks/useAscendingCountryNames"
import { Fragment, MouseEventHandler, useState } from "react"
import { T_Country } from "store/countries/types"
import styles from './modelTab.module.css'

type Props = {
    selectedState: ReturnType<typeof useState<T_Country['name']>>
}

function Dropdown({selectedState}: Props) {

    const countries = useAscendingCountryNames()
    const [selectedCountryName, setSelectedCountryName] = selectedState
    
    
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        setSelectedCountryName(e.currentTarget.name)
    }

    return (
        <div className={combineClassNames(["dropdown", styles.countries_list])}>
            <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {selectedCountryName && <img src={`https://flagcdn.com/${countries.byName[selectedCountryName].abbr}.svg`} alt={`flag of ${selectedCountryName}`} />}
                {selectedCountryName ?? 'Select Country to Simulate'}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {
                    countries.allNames.map(countryName => {
                        return (
                            <Fragment key={countryName}>
                                <button
                                    name={countryName}
                                    onClick={handleClick} 
                                    className="dropdown-item"
                                >
                                    <img 
                                        src={`https://flagcdn.com/${countries.byName[countryName].abbr}.svg`} 
                                        alt={`flag of ${countryName}`}
                                    />
                                    {countryName}
                                </button>
                                <div className="dropdown-divider"></div>
                            </Fragment>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Dropdown