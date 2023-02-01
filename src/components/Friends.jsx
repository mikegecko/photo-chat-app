import {
    Checkbox,
  createTheme,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import { useState } from "react";

export default function Friends(props) {
    const [checked, setChecked] = useState(false);


    const handleToggle = (e) => {
        setChecked(!checked);
    }

  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#3e9dfc",
      },
      secondary: {
        main: "#1f1f1f",
      },
      neutral: {
        main: "#64748B",
      },
    },
  });
  if(props.isSending){
    return(
        <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          color: "white",
        }}
      >
        <Typography variant="h4" sx={{ paddingTop: "10px" }}>
          Chat
        </Typography>
        <List sx={{ width: "100%", color: "white", fontFamily: "Roboto" }}>
          <Divider variant="fullWidth" component="li" />
          <ListItem
            disablePadding
            secondaryAction={
              <Badge color="primary" badgeContent={0} showZero>
                <MailIcon />
              </Badge>
            }
          >
            <ListItemButton onClick={handleToggle}>
            <ListItemIcon>
                <Checkbox
                    sx={{color:'white'}}
                  edge="start"
                  checked={checked}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary="Friend_1" />
            </ListItemButton>
          </ListItem>
          <Divider variant="fullWidth" component="li" />
        </List>
      </Box>
    </ThemeProvider>
    )
  }
  else{
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
            <Typography variant="h4" sx={{ paddingTop: "10px" }}>
              Chat
            </Typography>
            <List sx={{ width: "100%", color: "white", fontFamily: "Roboto" }}>
              <Divider variant="fullWidth" component="li" />
              <ListItem
                disablePadding
                secondaryAction={
                  <Badge color="primary" badgeContent={0} showZero>
                    <MailIcon />
                  </Badge>
                }
              >
                <ListItemButton>
                  <ListItemText primary="Friend_1" />
                </ListItemButton>
              </ListItem>
              <Divider variant="fullWidth" component="li" />
            </List>
          </Box>
        </ThemeProvider>
      );
  }
}
