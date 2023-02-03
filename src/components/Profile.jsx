import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { ListItemIcon, ListSubheader, ThemeProvider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Profile(props) {
  

  return (
    <ThemeProvider theme={props.theme}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
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
        <ListItem disablePadding secondaryAction={props.userID} >
            <ListItemButton >
              <ListItemText primary="Friend Code" />
            </ListItemButton>
          </ListItem>
          <Divider variant="fullWidth" />
          <ListItem disablePadding secondaryAction={<ArrowForwardIosIcon sx={{display:'flex'}} />} >
            <ListItemButton >
              <ListItemText primary="QR Friend Code" />
            </ListItemButton>
          </ListItem>
          <Divider variant="fullWidth" />
          <ListItem disablePadding secondaryAction={<LogoutIcon sx={{display:'flex'}} />}>
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
