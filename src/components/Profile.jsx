import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { ButtonBase, ListItemIcon, ListSubheader, ThemeProvider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Profile(props) {
  

  const backMobile = {
    position: 'absolute', top: '102px', left: '25px', zIndex: 1,
  }
  const backDesktop = {
    position: 'absolute', top: '102px', left: 'calc(30% + 25px)', zIndex: 1,
  }
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
        <ButtonBase onClick={() => props.setStateOfAppPage('camera')} sx={props.mobileView ? backMobile : backDesktop}>
          <ArrowBackIcon />
        </ButtonBase>
        <Divider variant="fullWidth" />
        <List disablePadding >
        <ListItem disablePadding secondaryAction={props.userID} >
            <ListItemButton onClick={() => {navigator.clipboard.writeText(props.userID).then(props.setStateOfSnacks(true,"Copied to clipboard", "success" )) }} >
              <ListItemText primary="Friend Code" />
            </ListItemButton>
          </ListItem>
          <Divider variant="fullWidth" />
          <ListItem disablePadding secondaryAction={<ArrowForwardIosIcon sx={{display:'flex'}} />} >
            <ListItemButton onClick={props.qrcodeEvent} >
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
