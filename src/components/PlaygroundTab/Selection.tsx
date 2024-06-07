import { FC } from "react";
import { T_Country } from "store/countries/types";

type Props = {
  selectedCountriesState: [T_Country["name"][], React.Dispatch<React.SetStateAction<T_Country["name"][]>>];
};

const Selection: FC<Props> = ({ selectedCountriesState }) => {
  const [selectedCountries, setSelectedCountries] = selectedCountriesState;
console.log({setSelectedCountries});

  return (
    <div className='d-flex' style={{ gap: ".5rem" }}>
        {
            selectedCountries?.map(country => {
                return (
                    <span className="badge bg-light text-dark">
                      <button>
                      {country}
                      </button>
                    </span>
                )
            })
        }
    </div>
  );
};

export default Selection;
