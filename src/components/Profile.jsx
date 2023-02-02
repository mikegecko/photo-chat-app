import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { ListItemIcon, ListSubheader, ThemeProvider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { theme } from "../theme/theme";

export default function Profile(props) {
  /*
        Mabe combine this with settings and find new use for profile click like a qr code/ uuid for adding friends
        What to display on this page:
        - Display name
        - email
        - account age
        - dark/light mode toggle
        - friend code
        - delete account
        - maybe some debug stuff?
    
        !!!! ADD LOADING SYSTEM FOR ALL ITEMS
    
    */
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
        <Typography
          variant="h4"
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          Account
        </Typography>
        <Divider variant="fullWidth" />
        <List disablePadding >
          <ListItem disablePadding secondaryAction={<LogoutIcon />}>
            <ListItemButton onClick={props.logoutEvent}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
          <Divider variant="fullWidth" component="li" />
        </List>
      </Box>
    </ThemeProvider>
  );
}
