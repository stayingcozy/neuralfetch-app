import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";

const BarChart = ({ isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    console.log("Bar chart fake data: ", data);

    // Weekly Chart
    // Get time frame per each day to query
    // Map it out like daily (per day)
    // Take the median of each day
    // Highest category gets to be plotted (dog vs cat vs person)
    // const [data, setData] = useState([]);
    // const startOfDay = new Date();
    // startOfDay.setHours(0, 0, 0, 0);
    // const startOfDay_timestamp = Timestamp.fromDate(startOfDay)
    // var rawData = [];


  //   function transformData(originalData) {
  //   const newData = [
  //     {
  //       dayOfWeek: "Sunday",
  //       activity: originalData.map(item => ({
  //         item.dog
  //       })),
  //       activityColor: "hsl(296, 70%, 50%)",
  //       rest: ,
  //       restColor:  "hsl(340, 70%, 50%)",
  //     },
  //     {
  //       id: "cat",
  //       color: "#a4a9fc",
  //       data: originalData.map(item => ({
  //         x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
  //         y: item.cat
  //       })),
  //     },
  //     {
  //       id: "person",
  //       color: "#f1b9b7",
  //       data: originalData.map(item => ({
  //         x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
  //         y: item.person
  //       })),
  //     }
  //   ];

  //   return newData;
  // }

  return (
    <ResponsiveBar
      data={data}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
      indexBy="dayOfWeek"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "country", // changed
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "food", // changed
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;