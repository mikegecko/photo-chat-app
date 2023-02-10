import { Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ThemeProvider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { theme } from "../theme/theme";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function Notifications(props) {
  //This is all placeholder
  // This will hold the following
  /*
    - Any incoming friend requests
    -
  */
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
        <Divider variant="fullWidth" />
        <List disablePadding >
          {props.userData.friends.map((el,index) => {
            if(!el.accepted){
              return(
                <>
                <ListItem disablePadding secondaryAction={<IconButton><CloseIcon sx={{opacity: '100%', color:''}} /></IconButton>} >
                  <ListItemButton >
                    <ListItemText primary={el.name + ' sent you a friend request.'} />
                  </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
                </>
                )
            }
          })}
        </List>
      </Box>
    </ThemeProvider>
  );
}
