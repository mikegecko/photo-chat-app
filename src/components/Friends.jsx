import {
  Button,
  ButtonBase,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
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
  const [addFriendDialog, setAddFriendDialog] = useState(false);
  const [friendCode, setFriendCode] = useState(null);

  const handleToggle = (e) => {
    setChecked(!checked);
  };

  const handleAddFriendEvent = (e) => {
    //Send a friend request to another user
    /*
      1. Open dialog for entering friend code or scanning qr code
      2. On submit check if valid friend code 
        - add error if fail
      3. change friend DB to include a new friend request
    */
   setAddFriendDialog(true);
  }

  const handleFriendCodeInput = (e) => {
    setFriendCode(e.target.value);
  }
  const sendFriendRequest = () => {
    console.log(friendCode);
  }
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
            {props.userData.friends.map((el, index) => {
              return (
                <div key={el.id}>
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
                </div>
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
          <Dialog open={addFriendDialog} onClose={() => setAddFriendDialog(false)}>
            <DialogTitle>Send Friend Request</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter friend code or scan QR code</DialogContentText>
              <TextField onChange={handleFriendCodeInput} autoFocus margin="dense" id="friendcode" label="Friend Code" type="text" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions sx={{gap: '8px'}}>
              <Button variant="text" onClick={sendFriendRequest} >Add Friend</Button>
              <Button variant="text" >QR Code</Button>
              <Button variant="outlined" onClick={() => setAddFriendDialog(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px"}}>
            Friends
          </Typography>
          <List disablePadding sx={{ width: "100%", fontFamily: "Roboto" }}>
            <Divider variant="fullWidth" component="li" />
            <ListItem disablePadding secondaryAction={<PersonAddIcon sx={{display:'flex'}} />}>
              <ListItemButton onClick={handleAddFriendEvent}>
                <ListItemText primary="Add Friend" />
              </ListItemButton>
            </ListItem>
            <Divider variant="fullWidth" component="li" />

            {!props.userData.friends[0] ? <ListItem ><ListItemText primary="No Friends ☹️" /></ListItem> : props.userData.friends.map((el, index) => {
              return (
                <div key={el.id}>
                  <ListItem
                    key={el.id}
                    disablePadding
                    secondaryAction={
                      <Badge color="primary" badgeContent={0} showZero >
                        <MailIcon />
                      </Badge>
                    }
                  >
                    <ListItemButton onClick={() => props.friendSelectEvent(index)}>
                      <ListItemText primary={el.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </div>
              );
            })}
          </List>
        </Box>
      </ThemeProvider>
    );
  }
}
