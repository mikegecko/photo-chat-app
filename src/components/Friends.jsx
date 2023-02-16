import {
  Alert,
  Button,
  ButtonBase,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MailIcon from "@mui/icons-material/Mail";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Badge from "@mui/material/Badge";
import { useEffect, useState } from "react";
import { doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, usersRef } from "../App";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import QRScan from "./QRScan";

export default function Friends(props) {
  const [checked, setChecked] = useState(false);
  const [addFriendDialog, setAddFriendDialog] = useState(false);
  const [friendCode, setFriendCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(false);
  const [acceptCode, setAcceptCode] = useState(null);
  const [snack, setSnack] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  //Maybe lift this state up
  const [sendList, setSendList] = useState(props.userData.friends.map((el,index) => {
    if(el.accepted){
      return(false);
    }
  }));

  const setStateOfFriendCode = (friendCode) => {
    setFriendCode(friendCode);
  }

  const scannerEvent = (e) => {
    setShowScanner(true);
  }
  const handleToggle = (e) => {
    const index = e;
    const newList = [...sendList];
    newList[index] = !newList[index];
    setSendList(newList);
  };

  const handleAddFriendEvent = (e) => {
   setAddFriendDialog(true);
  }

  const handleFriendCodeInput = (e) => {
    setFriendCode(e.target.value);
  }
  const sendFriendRequest = (e) => {
    setRequest(true);
    setAddFriendDialog(false);
  }
  const handleFriendAccept = (e) => {
    setAcceptCode(e.target.id);
    setRequest(true);
  }
  const handleFriendDecline = (e) => {
    //
  }
  const handleSnackClose = (e) => {
    setSnack(false);
  }
  const checkExistingFriendRequests = (friendDoc) => {
    const fr = friendDoc.data();
    if(fr.friends.some(e => e.id === props.userID)){
      return true;
    }
    return false;
  }
  const subHeadCtrl = () =>{
    let flag = false;
    props.userData.friends.forEach((el,index) => {
      if(!el.accepted){
        flag = true;
      }
      else{
        return;
      }
    });
    if(flag){
      return(
        <ListSubheader sx={{textAlign: 'left'}} >Friend Requests</ListSubheader>
      )
    }
    else{
      return;
    }
  }
  //Handles passing sendList data to main component
  useEffect(() => {
    //console.log(sendList);
    //Convert bool to userData
    function convertSendList() {
      //This array holds friend data and a new value called send dependent upon checkbox value
      let convertArr = [];
      props.userData.friends.forEach((el,index) => {
        if(el.accepted){
          convertArr.push(el);
          convertArr.find(x => x.id === el.id).index = index;
        }
      })
      convertArr.forEach((el,index) => {
        if(sendList[index]){
          convertArr[index].send = true;    
        }
        else{
          convertArr[index].send = false;
        }
      })
      //Check if message_chain exists -> this check needs to be in App.js
      for (let index = 0; index < convertArr.length; index++) {
        const element = convertArr[index];
        if(!element.message_chain){
          //If message_chain doesn't exist we need to create a new one
        }
      }
      props.setStateOfSendList(convertArr);
    }
    convertSendList();
    return () => {
      //Cleanup
    }
  }, [sendList])
  // This handles sending friend requests and checking friend code
  useEffect(() => {
    setLoading(true);
    // This returns the userData object from DB - maybe rename to something more accurate
    async function getUser (userid) {
      try {
        const q = query(usersRef, where("__name__", "==", userid));
        const querySnapshot = await getDocs(q);
        let i;
        //This could cause bugs if there is more than one result for query
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            i = doc;
            console.log(doc.id);
          } else {
            console.log("Could not retrieve user");
          }
        });
        return i;
      } catch (error) {
        console.error(error);
      }
    }
    async function sendFriendRequest (friendDoc) {
      const userRef = doc(db, "users", friendDoc.id);
      if(!checkExistingFriendRequests(friendDoc)){
        await setDoc( userRef, {friends: [ ...friendDoc.data().friends, {accepted: false, id: props.userID, name: props.userData.name} ]}, {merge: true});
      }
      else{
        console.log("You already sent this person a friend request");
      }
    }
    async function checkAndSendFriendRequest () {
      const friend = await getUser(friendCode);
      if(!friend){
        setSnack(true);
        console.log("Invalid Friend Code");
      }
      else{
        console.log(friend.data());
        await sendFriendRequest(friend);
      }
    }
    async function acceptFriendRequest (userDoc) {
      const userRef = doc(db, "users", userDoc.id);
      await setDoc( userRef, {friends: [...userDoc.data().friends, {accepted: true, id: props.userID, name: props.userData.name} ]}, {merge: true});
    }
    async function acceptAndSetFriend () {
      const sender = await getUser(acceptCode);
      if(!sender){
        console.log("Error accepting request: sender not found")
      }
      else{
        await acceptFriendRequest(sender);
        // now we need to set our friend.accepted to true
        const newUserData = {
          ...props.userData,
          friends: [...props.userData.friends],
        };
        for(let i = 0; i < newUserData.friends.length; i++){
          if(newUserData.friends[i].id === acceptCode){
            newUserData.friends[i].accepted = true;
          }
        }
        props.setStateOfUserData(newUserData);
      }
    }

    if(request && friendCode !== null){
      checkAndSendFriendRequest();
    }
    if(request && acceptCode !== null){
      acceptAndSetFriend();
    }
    return () => {
      setFriendCode(null);
      setLoading(false);
      setRequest(false);
    }
  },[request])


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
                    <ListItemButton id={index.toString()} onClick={() => handleToggle(index)}>
                      <ListItemIcon>
                        <Checkbox
                          id={index.toString()}
                          edge="start"
                          checked={sendList[index]}
                          onChange={() => handleToggle(index)}
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
          <Snackbar sx={{marginBottom: '80px'}} open={snack} autoHideDuration={5000} onClose={handleSnackClose} action={<IconButton onClick={handleSnackClose}><CloseIcon /></IconButton>} >
            <Alert onClose={handleSnackClose} severity="error" sx={{width: '100%'}}>
              Invalid Friend Code!
            </Alert> 
            </Snackbar>
          <Dialog open={addFriendDialog} onClose={() => setAddFriendDialog(false)}>
            <DialogTitle>Send Friend Request</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter friend code or scan QR code</DialogContentText>
              <TextField onChange={handleFriendCodeInput} autoFocus margin="dense" id="friendcode" label="Friend Code" type="text" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions sx={{gap: '8px'}}>
              <Button variant="text" onClick={sendFriendRequest} >Add Friend</Button>
              <Button variant="text" onClick={scannerEvent} >QR Code</Button>
              <Button variant="outlined" onClick={() => setAddFriendDialog(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
          {showScanner ? <QRScan setStateOfFriendCode={setStateOfFriendCode} /> : <></>}
          <Typography variant="h4" sx={{ paddingTop: "10px", paddingBottom: "10px"}}>
            Friends
          </Typography>
          <Divider variant="fullWidth" />
          <List disablePadding subheader={subHeadCtrl()}>
          <Divider variant="fullWidth" component="li" />
            {props.userData.friends.map((el,index) => {
              if(!el.accepted){
                return(
                  <div key={el.id}>
                  <ListItem disablePadding secondaryAction={<Box sx={{display: 'flex', gap: '16px'}}><IconButton onClick={handleFriendAccept}><CheckIcon id={el.id} /></IconButton><IconButton onClick={handleFriendDecline}><CloseIcon id={el.id} /></IconButton></Box>} >
                    <ListItemButton id={el.id} >
                      <ListItemText primary={el.name} />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                  </div>
                )
              }
            })}
          </List>
          <List disablePadding sx={{ width: "100%"}} subheader={<ListSubheader sx={{textAlign: 'left'}} >Friends</ListSubheader>}>
          <Divider variant="fullWidth" component="li" />
            <ListItem disablePadding secondaryAction={<PersonAddIcon sx={{display:'flex'}} />}>
              <ListItemButton onClick={handleAddFriendEvent}>
                <ListItemText primary="Add Friend" />
              </ListItemButton>
            </ListItem>
            <Divider variant="fullWidth" component="li" />
            {!props.userData.friends[0] ? <ListItem ><ListItemText primary="No Friends ☹️" /></ListItem> : props.userData.friends.map((el, index) => {
              if(el.accepted){
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
              }
            })}
          </List>
        </Box>
      </ThemeProvider>
    );
  }
}
