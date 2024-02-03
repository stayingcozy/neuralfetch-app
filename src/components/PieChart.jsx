import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { collection } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useEffect, useState } from 'react';

// import { mockPieData as data } from "../data/mockData";
import { UserAuth } from './AuthCheck';
import { fetchWeekData } from '../lib/fetchFirebaseData';

const PieChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // console.log("Pie chart fake data: ", data);

  // Firebase activity data
  // const uid = auth.currentUser.uid;
  const { user, _ } = UserAuth(); //user.uid
  const uid = user.uid;

  const actRef = collection(db, 'users', `${uid}`, 'activity');

  // weekly Chart
  const [data, setData] = useState([]);

  // week days
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function transformData(originalData) {

    let totalSum = [0, 0, 0];
    let totalRestSum = [0, 0, 0];

    for (let i=originalData.length-1; i>-1; i--) {

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

      // let dayIndex = dayNames[i].getDay();
      // let dayName = weekDays[dayIndex];

      totalSum[0] += sumPerson;
      totalRestSum[0] += restsumPerson;
      totalSum[1] += sumDog;
      totalRestSum[1] += restSumDog;
      totalSum[2] += sumCat;
      totalRestSum[2] += restsumCat;
    }

    let maxIndex = totalSum.reduce((maxIndex, current, index, arr) => current > arr[maxIndex] ? index : maxIndex, 0);

    let totAct = totalSum[maxIndex];
    let totRest = totalRestSum[maxIndex];

    // Combine all together 
    const totData = [
      {
        color: "hsl(96, 70%, 50%)",
        id: "activity",
        label: "activity",
        value: totAct,
      },
      {
        color: "hsl(229, 70%, 50%)", 
        id: "rest",
        label: "rest",
        value: totRest,
      },
    ];

    return totData;

  }

  const fetchData = async () => {

    try {
      const rawData = await fetchWeekData(actRef);
      const transformedData = transformData(rawData); // index 0 is today's date
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching Line Chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <ResponsivePie
      data={data}
      colors={["hsl(96, 70%, 50%)", "hsl(229, 70%, 50%)"]}
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
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends = {isDashboard ? undefined : [
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;