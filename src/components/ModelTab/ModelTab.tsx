import { useState } from "react"
import { useSelector } from "react-redux"
import { T_Country } from "store/countries/types"
import { selectIndicators } from "store/indicators/selectors"
import Dropdown from "./Dropdown"
import Table from "./Table"

type Props = {}

function ModelTab({}: Props) {

    const indicators = useSelector(selectIndicators)
    const selectedState = useState<T_Country['name']>()

    if(!indicators.allNames.length) return (
      <h5>Import data in the index tab to process the model</h5>
    )

  return (
    <div className="d-flex flex-column" style={{gap: 30}}>
      <Dropdown selectedState={selectedState} />
      { selectedState[0] && <Table selectedCountry={selectedState[0]} /> }      
    </div>
  )
}

export default ModelTab