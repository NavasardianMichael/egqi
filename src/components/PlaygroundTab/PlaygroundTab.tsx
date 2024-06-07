import Dropdown from 'components/ModelTab/Dropdown'
import { FC, useState } from "react"
import { useSelector } from "react-redux"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
import Selection from './Selection'

const PlaygroundTab: FC = () => {

    const indicators = useSelector(selectIndicators)
    const selectedState = useState<T_Country['name']>()
    const selectedCountriesState = useState<T_Country['name'][]>([])

    if(!indicators.allNames.length) return (
      <h6>Import data in the index tab to play with indices</h6>
    )

  return (
    <div className="d-flex flex-column" style={{gap: '1rem'}}>
      <Dropdown selectedState={selectedState} />
      <Selection selectedCountriesState={selectedCountriesState} />
      {/* { selectedState[0] && <Table selectedCountry={selectedState[0]} /> }       */}
    </div>
  )
}

export default PlaygroundTab