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
import { useState } from "react";
import { motion } from "framer-motion";
import { theme } from "../theme/theme";

export default function Settings(props) {
  const [checked, setChecked] = useState(["brightnessMode"]);


  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const visible = { rotate: 180, scale: 1 };
  const hidden = { scale: 0 };

  const brightnessIconSelect = () => {
    return (
      <>
        <Box
          sx={{ position: "absolute" }}
          initial={{ scale: 0 }}
          animate={checked.indexOf("brightnessMode") ? hidden : visible}
          component={motion.div}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <DarkModeIcon />
        </Box>
        <Box
          initial={{ scale: 0 }}
          animate={checked.indexOf("brightnessMode") ? visible : hidden}
          component={motion.div}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <LightModeIcon />
        </Box>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        color: "white",
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
          secondaryAction={<ListItemText primary={props.userData.data().uid} />}
        >
          <ListItemButton>
            <ListItemText primary="UID" />
          </ListItemButton>
        </ListItem>
        <Divider variant="fullWidth" component="li" />
        <ListItem
          disablePadding
          secondaryAction={<ListItemText primary={props.userData.id} />}
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
          <ListItemButton onClick={() => handleToggle("brightnessMode")}>
            <ListItemIcon sx={{ color: "white" }}>
              {brightnessIconSelect()}
            </ListItemIcon>
            <ListItemText primary="Toggle Dark/Light Mode" />
            <Switch
              edge="end"
              onChange={() => handleToggle("brightnessMode")}
              checked={checked.indexOf("brightnessMode") !== -1}
            />
          </ListItemButton>
        </ListItem>
        <Divider variant="fullWidth" component="li" />
      </List>

    </Box>
    </ThemeProvider>
  );
}
