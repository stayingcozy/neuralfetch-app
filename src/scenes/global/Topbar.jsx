import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
// import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcons from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcons from "@mui/icons-material/DarkModeOutlined";
// import NotificationsOutlinedIcons from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcons from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcons from "@mui/icons-material/PersonOutlined";
// import SearchIcon from "@mui/icons-material/Search";
import {  useNavigate } from 'react-router-dom';

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    const handleProfileMenuOpen = async () => {
        navigate('/account');
    };

    const handleSettingsMenuOpen = async () => {
        navigate('/settings');
    };

    return (
    <Box display="flex" justifyContent="space-between" p={2}>

        {/* Search Bar */}
        <Box 
            display="flex" 
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
        >
            {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search"></InputBase>
            <IconButton type="button" sx={{ p: 1}}>
                <SearchIcon />
            </IconButton> */}
        </Box>

        {/* Icons */}
        <Box display="flex"> 
            <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                    <DarkModeOutlinedIcons />
                ) : (
                    <LightModeOutlinedIcons />
                )}
            </IconButton>
            {/* <IconButton>
                <NotificationsOutlinedIcons />
            </IconButton> */}
            <IconButton onClick={handleSettingsMenuOpen}>
                <SettingsOutlinedIcons />
            </IconButton>
            <IconButton onClick={handleProfileMenuOpen}>
                <PersonOutlinedIcons />
            </IconButton>
        </Box>
    </Box>
    );
}

export default Topbar;