import { ButtonBase, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ThemeProvider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function Notifications(props) {
  //This is all placeholder
  // This will hold the following
  /*
    - Any incoming friend requests
    -
  */
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
        <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          Notifications
        </Typography>
        <ButtonBase onClick={() => props.setStateOfAppPage('camera')} sx={props.mobileView ? backMobile : backDesktop}>
          <ArrowBackIcon />
        </ButtonBase>
        <Divider variant="fullWidth" />
        <List disablePadding >
          {props.userData.friends.map((el,index) => {
            if(!el.accepted){
              return(
                <div key={index}>
                <ListItem disablePadding secondaryAction={<IconButton><CloseIcon sx={{opacity: '100%', color:''}} /></IconButton>} >
                  <ListItemButton onClick={() => props.setStateOfAppPage('friends')} >
                    <ListItemText primary={el.name + ' sent you a friend request.'} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
                </div>
                )
            }
            if(el.unread){
              return(
                <div key={index}>
                <ListItem disablePadding secondaryAction={<IconButton><CloseIcon sx={{opacity: '100%', color:''}} /></IconButton>} >
                  <ListItemButton onClick={() => props.setStateOfAppPage('friends')} >
                    <ListItemText primary={el.name + ' sent you a message.'} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
                </div>
              )
            }
          })}
        </List>
      </Box>
    </ThemeProvider>
  );
}
