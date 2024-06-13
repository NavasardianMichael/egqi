import { LineChart, LineChartProps, ScatterChart } from "@mui/x-charts";
import { FC, useMemo } from "react";
import { useSelector } from 'react-redux';
import { T_Country } from "store/countries/types";
import { selectIndices } from 'store/indices/selectors';
import { selectYears } from 'store/years/selectors';

type Props = {
  countries: T_Country["name"][]
};

const Chart: FC<Props> = ({ countries }) => {
  const CHART_COMPONENTS_BY_TYPE = {
    line: LineChart,
    scatter: ScatterChart
  }
  const selectedChartType = 'line'
  const SelectedChart = CHART_COMPONENTS_BY_TYPE[selectedChartType]
  const indices = useSelector(selectIndices)
  const years = useSelector(selectYears)

  const chartData: LineChartProps = useMemo(() => {
    return {
      series: countries.map(country => {
        return {
          data: years.map(year => indices[country].byYear[year].eoqi.value),
          label: country,
        }
      }),
      xAxis: [{ data: years, valueFormatter: (v) => v.toString() }],
    }
  }, [countries, indices, years])
  
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

export default Chart;
