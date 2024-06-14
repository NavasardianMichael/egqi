import { LineChart, LineChartProps, ScatterChart } from "@mui/x-charts";
import { INDICES_TYPES } from "helpers/constants.ts/indices";
import { FC, memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { T_Country } from "store/countries/types";
import { selectIndices } from "store/indices/selectors";
import { T_Indices } from "store/indices/types";
import { selectYears } from "store/years/selectors";

type Props = {
  countries: T_Country["name"][];
  selectedIndexType: keyof T_Indices | null;
};

const Chart: FC<Props> = ({ countries, selectedIndexType }) => {
  const CHART_COMPONENTS_BY_TYPE = {
    line: LineChart,
    scatter: ScatterChart,
  };
  const selectedChartType = "line";
  const SelectedChart = CHART_COMPONENTS_BY_TYPE[selectedChartType];
  const indices = useSelector(selectIndices);
  const years = useSelector(selectYears);

  const chartData: LineChartProps = useMemo(() => {
    return {
      series: countries.map((country) => {
        return {
          data: years.map(
            (year) =>
              indices[country].byYear[year][
                selectedIndexType ?? INDICES_TYPES[0]
              ].value
          ),
          label: country,
        };
      }),
      xAxis: [{ data: years, valueFormatter: (v) => v.toString() }],
    };
  }, [countries, indices, selectedIndexType, years]);

  return (
    <SelectedChart
      {...chartData}
      height={500}
      slotProps={{
        legend: {
          itemMarkWidth: 50,
          itemGap: 20,
        },
      }}
    />
  );
};

export default memo(Chart);
