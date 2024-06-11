import { BarChart } from "@mui/x-charts";
import { FC } from "react";
import { T_Country } from "store/countries/types";

type Props = {
  selectedCountriesState: [
    T_Country["name"][],
    React.Dispatch<React.SetStateAction<T_Country["name"][]>>
  ];
};

const Chart: FC<Props> = ({ selectedCountriesState }) => {
  const [selectedCountries, setSelectedCountries] = selectedCountriesState;
  console.log({
    selectedCountriesState,
    selectedCountries,
    setSelectedCountries,
  });

  return (
    <BarChart
      series={[
        { data: [35, 44, 24, 34] },
        { data: [51, 6, 49, 30] },
        { data: [15, 25, 30, 50] },
        { data: [60, 50, 15, 25] },
      ]}
      height={290}
      xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
};

export default Chart;
