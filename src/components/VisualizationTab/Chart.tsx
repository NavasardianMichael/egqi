import { LineChart, LineChartProps, ScatterChart } from "@mui/x-charts";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { T_Country } from "store/countries/types";
import { selectIndices } from "store/indices/selectors";
import { T_Indices } from "store/indices/types";
import { selectYears } from "store/years/selectors";

type Props = {
  countries: T_Country["name"][];
  selectedIndexType: keyof T_Indices;
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
      skipAnimation: true,
      series: countries.map((country) => {
        return {
          connectNulls: true,
          data: years.map((year) => {
            return indices[country].byYear[year][selectedIndexType].value;
          }),
          label: country,
        };
      }),
      xAxis: [
        {
          data: years,
          valueFormatter: (v) => v.toString(),
          min: 2005,
          max: 2022,
          tickNumber: 18,
        },
      ],
    };
  }, [countries, indices, selectedIndexType, years]);

  return (
    <SelectedChart
      {...chartData}
      height={450}
      slotProps={{
        legend: {
          itemMarkWidth: 50,
          itemGap: 20,
        },
      }}
    />
  );
};

export default Chart;
