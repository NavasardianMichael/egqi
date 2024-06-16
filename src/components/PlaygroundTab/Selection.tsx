import { combineClassNames } from "helpers/functions/commons";
import { FC, memo } from "react";
import { T_Country } from "store/countries/types";
import styles from "./playgroundTab.module.css";

type Props = {
  removeCountry: (name: T_Country["name"]) => void;
  selectedCountries: T_Country["name"][];
};

const Selection: FC<Props> = ({ selectedCountries, removeCountry }) => {
  return (
    <div
      className="d-flex flex-wrap align-items-center"
      style={{ gap: ".5rem" }}
    >
      {selectedCountries?.map((country) => {
        return (
          <div
            key={country}
            className={combineClassNames([
              styles.country,
              "py-2 px-3 d-flex badge bg-light text-dark flex align-items-center",
            ])}
            style={{ gap: 10 }}
          >
            <span>{country}</span>
            <button
              className={combineClassNames([styles.removeBtn, "p-0 sr-only"])}
              onClick={() => removeCountry(country)}
            >
              &#x2715;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Selection);
