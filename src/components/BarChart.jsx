import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { collection } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useEffect, useState } from 'react';

import { UserAuth } from './AuthCheck';
import { getWeekDateNames, fetchWeekData } from '../lib/fetchFirebaseData';

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // console.log("Bar chart fake data: ", data);

  // Firebase activity data
  // const uid = auth.currentUser.uid;
  const { user, _ } = UserAuth(); //user.uid
  const uid = user.uid;

  const actRef = collection(db, 'users', `${uid}`, 'activity');

  // weekly Chart
  const [data, setData] = useState([]);

  // week days
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function transformData(originalData, dayNames) {
    let newDataPerson = [];
    let newDataDog = [];
    let newDataCat = [];

    let totalSum = [0, 0, 0];

    for (let i=originalData.length-1; i>-1; i--) {
      // console.log("index: ", i);
      // console.log("originalData[i]: ", originalData[i]);

      const cateData = [
        {
          id: "dog",
          data: originalData[i].map(item => ({
            x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
            y: item.dog
          })),
        },
        {
          id: "cat",
          data: originalData[i].map(item => ({
            x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
            y: item.cat
          })),
        },
        {
          id: "person",
          data: originalData[i].map(item => ({
            x: item.timestamp.toDate().toLocaleTimeString('en-US'), 
            y: item.person
          })),
        }
      ];

      let sumDog = 0;
      let restSumDog = 0;
      let sumCat = 0;
      let restsumCat = 0;
      let sumPerson = 0;
      let restsumPerson = 0;

      let actRestCut = 1;
      
      cateData.forEach(obj => {
        obj.data.forEach(item => {
          if (obj.id === 'dog') {
            if (item.y>actRestCut) {
              sumDog += 1;
            } else {
              restSumDog += 1;
            }
          } else if (obj.id === 'cat') {
            if (item.y>actRestCut) {
              sumCat += 1;
            } else {
              restsumCat += 1;
            }
          } else if (obj.id === 'person') {
            if (item.y>actRestCut) {
              sumPerson += 1;
            } else {
              restsumPerson += 1;
            }
          }
        });
      });

      let dayIndex = dayNames[i].getDay();
      let dayName = weekDays[dayIndex];

      totalSum[0] += sumPerson;
      totalSum[1] += sumDog;
      totalSum[2] += sumCat;


      newDataPerson.push({
        dayOfWeek: dayName,
        activity: sumPerson,
        activityColor: "hsl(96, 70%, 50%)",
        rest: restsumPerson,
        restColor:  "hsl(229, 70%, 50%)",
      })
      newDataDog.push({
        dayOfWeek: dayName,
        activity: sumDog,
        activityColor: "hsl(96, 70%, 50%)",
        rest: restSumDog,
        restColor:  "hsl(229, 70%, 50%)",
      })
      newDataCat.push({
        dayOfWeek: dayName,
        activity: sumCat,
        activityColor: "hsl(96, 70%, 50%)",
        rest: restsumCat,
        restColor:  "hsl(229, 70%, 50%)",
      })
    }

    let maxIndex = totalSum.reduce((maxIndex, current, index, arr) => current > arr[maxIndex] ? index : maxIndex, 0);

    if (maxIndex === 0) {
      return newDataPerson;
    } else if (maxIndex === 1) {  
      return newDataDog;
    } else {
      return newDataCat;
    }
  }

  const fetchData = async () => {

    try {
      const rawData = await fetchWeekData(actRef);
      const dayNames = getWeekDateNames();
      const transformedData = transformData(rawData, dayNames); // index 0 is today's date
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching Line Chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ResponsiveBar
      data={data}
      colors={["hsl(96, 70%, 50%)", "hsl(229, 70%, 50%)"]}
      // colors={{ scheme: "nivo" }}
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
      keys={["activity", "rest"]}
      indexBy= "dayOfWeek" 
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
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
        tickRotation: -45,
        legend: isDashboard ? undefined : "Day", // changed
        legendPosition: "middle",
        legendOffset: 32,
        tickLabelFontSize: 8,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Activity & Rest", // changed
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
        return e.id + ": " + e.formattedValue + " during day: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;