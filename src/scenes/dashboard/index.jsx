import { Box, Typography, useTheme } from "@mui/material"; // Button, IconButton
import { useState } from 'react';
import { tokens } from "../../theme";
// import { mockTransactions } from "../../data/mockData";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import TrafficIcon from "@mui/icons-material/Traffic";
// import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
// import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
// import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import CaddyDataFetch from '../../components/CaddyDataFetch';
// import Card from "@material-ui/core/Card";
import CardMedia from '@material-ui/core/CardMedia';
// import SignOut from "../../components/SignOut";
import PostCreation from "../../components/PostCreation";
import PostManager from "../../components/PostManager";
import getMonthDayYear from "../../lib/getMonthDayYear";
import PieChart from "../../components/PieChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [httpsSrcURL, setHttpsSrcURL] = useState('');

  // get date
  const todaysDate = getMonthDayYear();

  return (
    
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Header title="DASHBOARD" subtitle="Welcome to your dashboard" /> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        
        <Box 
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
        >
          <CardMedia
            component="iframe" 
            src={httpsSrcURL}
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Today's Activity
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>


        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Weekly Activity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Activity & Rest
          </Typography>
          <Box m="1px">
          <Box height="40vh">
            <PieChart isDashboard={true} />
          </Box>
        </Box>
        </Box>

        {/* ROW 4 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <PostManager date={todaysDate} />  
        </Box>
      </Box>
      <CaddyDataFetch setHttpsSrcURL={setHttpsSrcURL} />
      <PostCreation date={todaysDate} />
    </Box>
  );
};

export default Dashboard;