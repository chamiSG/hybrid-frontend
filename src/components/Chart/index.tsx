import "./chart.scss";
import LineChart from 'react-apexcharts'
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IStakedHistorical } from "src/store/types";
import {formatDate} from 'src/helpers/format-date'
function Chart(props: any) {

  const { data, theme } = props;
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const isDark = theme == "dark" ? true : false;

  const dateArry: string[] = [];
  const valueArry: number[] = [];

  data?.map((item: IStakedHistorical) => {
    dateArry.unshift(formatDate(item.date));
    valueArry.unshift(item.value);
  });

  const options = {
    
    chart: {
      id: 'apexchart',
      toolbar: {
        show: false
      },
      stroke: {
        curve: 'smooth'
      },
    },
    colors: [isDark ? "#f5f5f5" : "#3a3a3a"],
    xaxis: {
      labels: {
        show: true,
        style: {
          colors: isDark ? "#f5f5f5" : "#3a3a3a",
          fontSize: "13",
          fontWeight: 600,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        },
      },
      categories: dateArry,
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: isDark ? "#f5f5f5" : "#3a3a3a",
          fontSize: "13",
          fontWeight: 600,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        },
      },
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    grid: {
      borderColor: isDark ? "#f5f5f5" : "#3a3a3a33"
    }
  };

  const series = [{
    name: 'Price',
    data: valueArry
  }]

  return (
    <>
      <LineChart options={options} series={series} type="area" width={!isVerySmallScreen ? 960 : 360} height={320} />
    </>
  );
}

export default Chart;

