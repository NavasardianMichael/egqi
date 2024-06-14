import Dropdown from "components/ModelTab/Dropdown";
import { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { T_Country } from "store/countries/types";
import { selectIndicators } from "store/indicators/selectors";
import Selection from "./Selection";
import Chart from "./Chart";
import { T_Indices } from "store/indices/types";
import IndexTypes from "./IndexTypes";

const PlaygroundTab: FC = () => {
  const indicators = useSelector(selectIndicators);
  const selectedState = useState<T_Country["name"]>();
  const selectedCountriesState = useState<T_Country["name"][]>([]);
  const selectedIndexTypeState = useState<keyof T_Indices | null>(null);

  const addCountry = useCallback(
    (name: T_Country["name"]) => {
      if (selectedCountriesState[0].includes(name)) return;
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
      className="d-flex flex-column align-items-start"
      style={{ gap: "1rem" }}
    >
      <div className="d-flex" style={{ gap: "5rem" }}>
        <Dropdown
          selectedState={selectedState}
          addCountry={addCountry}
          noDataPlaceholder="Select Countries to Visualize"
        />
        <Selection
          selectedCountries={selectedCountriesState[0]}
          removeCountry={removeCountry}
        />
      </div>

      <IndexTypes selectedIndexTypeState={selectedIndexTypeState} />

      <Chart
        countries={selectedCountriesState[0]}
        selectedIndexType={selectedIndexTypeState[0]}
      />
    </div>
  );
};

export default PlaygroundTab;
