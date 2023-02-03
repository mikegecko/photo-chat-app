import {
    createTheme,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Switch,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Settings(props) {

  const visible = { rotate: 180, scale: 1 };
  const hidden = { scale: 0 };

  const handleThemeEvent = (e) => {
    e.stopPropagation();
    props.setStateOfSettings('brightnessMode', !props.settings.brightnessMode)
  }
  const brightnessIconSelect = () => {
    return (
      <>
        <Box
        
          sx={{ position: "absolute", padding: '0px', display: 'flex' }}
          initial={{ scale: 0 }}
          animate={props.settings.brightnessMode ? hidden : visible}
          component={motion.div}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <DarkModeIcon sx={{color:"black"}} />
        </Box>
        <Box
          sx={{padding: '0px', display: 'flex' }}
          initial={{ scale: 0 }}
          animate={props.settings.brightnessMode ? visible : hidden}
          component={motion.div}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <LightModeIcon />
        </Box>
      </>
    );
  };

  return (
    <ThemeProvider theme={props.theme}>
    <Box

      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
      }}
      
    >
      <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
        Settings
      </Typography>
      <Divider variant="fullWidth" />
      <List disablePadding subheader={<ListSubheader sx={{textAlign: 'left'}}>Account Info</ListSubheader>}>
      <Divider variant="fullWidth" component="li" />
        <ListItem
          disablePadding
          secondaryAction={
            <ListItemText primary={props.user.user.displayName} />
          }
        >
          <ListItemButton>
            <ListItemText primary="Name" />
          </ListItemButton>
        </ListItem>
        <Divider variant="fullWidth" component="li" />
        <ListItem
          disablePadding
          secondaryAction={<ListItemText primary={props.user.user.email} />}
        >
          <ListItemButton>
            <ListItemText primary="Email" />
          </ListItemButton>
        </ListItem>
        
        <Divider variant="fullWidth" component="li" />
        <ListItem
          disablePadding
          secondaryAction={<ListItemText primary={props.userData.uid} />}
        >
          <ListItemButton>
            <ListItemText primary="UID" />
          </ListItemButton>
        </ListItem>
        <Divider variant="fullWidth" component="li" />
        <ListItem
          disablePadding
          secondaryAction={<ListItemText primary={props.userID} />}
        >
          <ListItemButton>
            <ListItemText primary="UserData" />
          </ListItemButton>
        </ListItem>
        <Divider variant="fullWidth" component="li" />
      </List>
      <List subheader={<ListSubheader sx={{textAlign: 'left'}} >Settings</ListSubheader>}>
      <Divider variant="fullWidth" component="li" />
        <ListItem disablePadding>
          <ListItemButton onClick={handleThemeEvent}>
            <ListItemIcon sx={{ color: "white" }}>
              {brightnessIconSelect()}
            </ListItemIcon>
            <ListItemText primary="Toggle Dark/Light Mode" />
            <Switch
              
              edge="end"
              onChange={handleThemeEvent}
              checked={props.settings.brightnessMode}
            />
          </ListItemButton>
        </ListItem>
        <Divider variant="fullWidth" component="li" />
      </List>

    </Box>
    </ThemeProvider>
  );
}
