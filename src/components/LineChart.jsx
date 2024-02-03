import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from 'react';
import { UserAuth } from './AuthCheck';

import { collection } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { fetchWeekData } from '../lib/fetchFirebaseData';

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Firebase activity data
  // const uid = auth.currentUser.uid;
  const { user, _ } = UserAuth(); //user.uid
  const uid = user.uid;

  const actRef = collection(db, 'users', `${uid}`, 'activity');

  // Daily Chart
  const [data, setData] = useState([]);

  function transformData(originalData) {
    const newData = [
      {
        id: "dog",
        color: "#4cceac",
        data: originalData.map(item => ({
          x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
          y: item.dog
        })),
      },
      {
        id: "cat",
        color: "#a4a9fc",
        data: originalData.map(item => ({
          x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
          y: item.cat
        })),
      },
      {
        id: "person",
        color: "#f1b9b7",
        data: originalData.map(item => ({
          x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
          y: item.person
        })),
      }
    ];
  
    return newData;
  }

  const fetchData = async () => {

    try {
      const rawData = await fetchWeekData(actRef);
      const transformedData = transformData(rawData[0]); // index 0 is today's date
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching Line Chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  ////////////////////////////

  return (
    <ResponsiveLine
      data={data}
      theme={{
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
              fontSize: 4,
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      // colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      colors= {{ datum: "color" }} // no need to be different for dashboard
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 10,
        tickRotation: -45,
        legend: "Time of Day", //isDashboard ? undefined : "time", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Activity", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;