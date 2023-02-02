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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Badge from "@mui/material/Badge";
import { useState } from "react";

export default function Friends(props) {
  const [checked, setChecked] = useState(false);

  const handleToggle = (e) => {
    setChecked(!checked);
  };

  if (props.isSending) {
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
            Friends
          </Typography>
          <List sx={{ width: "100%", fontFamily: "Roboto" }}>
            <Divider variant="fullWidth" component="li" />
            {props.userData.data().friends.map((el, index) => {
              return (
                <>
                  <ListItem
                    key={el.id}
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
                          edge="start"
                          checked={checked}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={el.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </>
              );
            })}
          </List>
        </Box>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={props.theme}>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px"}}>
            Friends
          </Typography>
          <List disablePadding sx={{ width: "100%", fontFamily: "Roboto" }}>
            <Divider variant="fullWidth" component="li" />
            <ListItem disablePadding secondaryAction={<PersonAddIcon />}>
              <ListItemButton>
                <ListItemText primary="Add Friend" />
              </ListItemButton>
            </ListItem>
            <Divider variant="fullWidth" component="li" />

            {!props.userData.data().friends[0] ? "No Friends :(" : props.userData.data().friends.map((el, index) => {
              return (
                <>
                  <ListItem
                    key={el.id}
                    disablePadding
                    secondaryAction={
                      <Badge color="primary" badgeContent={0} showZero>
                        <MailIcon />
                      </Badge>
                    }
                  >
                    <ListItemButton onClick={() => props.friendSelectEvent(el)}>
                      <ListItemText primary={el.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </>
              );
            })}
          </List>
        </Box>
      </ThemeProvider>
    );
  }
}
