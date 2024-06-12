import Dropdown from "components/ModelTab/Dropdown";
import { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { T_Country } from "store/countries/types";
import { selectIndicators } from "store/indicators/selectors";
import Selection from "./Selection";
import Chart from "./Chart";

const PlaygroundTab: FC = () => {
  const indicators = useSelector(selectIndicators);
  const selectedState = useState<T_Country["name"]>();
  const selectedCountriesState = useState<T_Country["name"][]>([]);

  const addCountry = useCallback(
    (name: T_Country["name"]) => {
      if(selectedCountriesState[0].includes(name)) return;
      selectedCountriesState[1]((prev) => [...prev, name]);
    },
    [selectedCountriesState]
  );

  const removeCountry = useCallback(
    (name: T_Country["name"]) => {
      selectedCountriesState[1]((prev) =>
        prev.filter((countryName) => countryName !== name)
      );
    },
    [selectedCountriesState]
  );

  if (!indicators.allNames.length)
    return <h6>Import data in the index tab to play with indices</h6>;

  return (
    <div
      className='d-flex flex-column align-items-start'
      style={{ gap: "1rem" }}
    >
      <div className='d-flex' style={{ gap: "5rem" }}>
        <Dropdown selectedState={selectedState} addCountry={addCountry} />
        <Selection
          selectedCountries={selectedCountriesState[0]}
          removeCountry={removeCountry}
        />
      </div>
      <Chart countries={selectedCountriesState[0]} />
    </div>
  );
};

export default PlaygroundTab;
