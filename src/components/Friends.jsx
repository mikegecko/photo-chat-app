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
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import Badge from "@mui/material/Badge";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, usersRef } from "../App";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import QRScan from "./QRScan";

export default function Friends(props) {
  const [checked, setChecked] = useState(false);
  const [addFriendDialog, setAddFriendDialog] = useState(false);
  const [removeFriendDialog, setRemoveFriendDialog] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(false);
  const [acceptCode, setAcceptCode] = useState(null);
  const [declineCode, setDeclineCode] = useState(null);
  const [snack, setSnack] = useState(false);
  const [snackContent, setSnackContent] = useState();
  const [snackSeverity, setSnackSeverity] = useState();
  const [showScanner, setShowScanner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toRemove, setToRemove] = useState(null);
  const [dot, setDot] = useState(false);
  //Maybe lift this state up
  const [sendList, setSendList] = useState(props.userData.friends.map((el,index) => {
    if(el.accepted){
      return(false);
    }
  }));

  const setStateOfFriendCode = (friendCode) => {
    setFriendCode(friendCode);
    closeScannerEvent(false);
  }
  const closeScannerEvent = (e) => {
    setShowScanner(false);
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
  const confirmRemoveFriend = (e) => {
    setRequest(true);
    setRemoveFriendDialog(false);
    console.log(`Removing ${toRemove.name}`);
  }
  const handleRemoveFriend = (e) => {
    setToRemove(e);
    setRemoveFriendDialog(true);
    console.log(e);
  }
  const handleEditFriendsEvent = (e) => {
    setEditMode(!editMode);
  }
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
    //const friendId = e.target.id;
    setDeclineCode(e);
    setRequest(true);
  }
  const handleSnackClose = (e) => {
    setSnack(false);
    setSnackContent("");
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
            //console.log(doc.id);
          } else {
            console.log("Could not retrieve user");
          }
        });
        return i;
      } catch (error) {
        console.error(error);
      }
    }
    // Create messageChainID on friend accept
    async function createMessageChain(friendDoc) {
      try {
        const docRef = await addDoc(collection(db, "message_chains"), {
          timestamp: serverTimestamp(),
          // change props.friend to newly accepted friend
          users: [props.userID, friendDoc.id],
        });
        
        const newUserData = {
          ...props.userData,
          friends: [...props.userData.friends],
        };
        let userIndex = null;
        newUserData.friends.forEach((el,index) => {
          if(el.id === friendDoc.id){
            userIndex = index;
          }
        })
        newUserData.friends[userIndex].message_chain = docRef.id;
        props.setStateOfUserData(newUserData);
        await setFriendMessageChain(docRef.id, friendDoc);

        return docRef;
      } catch (error) {
        console.error(error);
      }
    }
    async function setFriendMessageChain (chainID, friendDoc) {
      const userRef = doc(db, "users", friendDoc.id);
      const friendSnap = await getDoc(userRef);
      if(friendSnap.exists()){
        let userIndex = null;
        friendSnap.data().friends.forEach((el,index) => {
          if(el.id === props.userID){
            userIndex = index;
          }
        })
        const newFriends = {friends: [...friendSnap.data().friends]};
        newFriends.friends[userIndex].message_chain = chainID;
        await setDoc( userRef, newFriends , {merge: true});
      }
      else{
        console.log("Error getting user for message_chain creation.")
      }
      
    }
    async function sendFriendRequest (friendDoc) {
      const userRef = doc(db, "users", friendDoc.id);
      if(!checkExistingFriendRequests(friendDoc)){
        await setDoc( userRef, {friends: [ ...friendDoc.data().friends, {accepted: false, id: props.userID, name: props.userData.name} ]}, {merge: true});
        setSnackContent("Friend request sent");
        setSnackSeverity("success");
        setSnack(true);
        console.log("Friend Request sent");
      }
      else{
        setSnackContent("You already sent this person a friend request");
        setSnackSeverity("error");
        setSnack(true);
        console.log("You already sent this person a friend request");
      }
    }
    async function checkAndSendFriendRequest () {
      const friend = await getUser(friendCode);
      if(!friend){
        setSnackSeverity("error");
        setSnackContent("Invalid Friend Code")
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
        // set new friend data to true
        await acceptFriendRequest(sender);
        // now we need to set user friend.accepted to true
        // Create messageChainId for messaging

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
        createMessageChain(sender);
      }
    }
    async function removeUserFromFriend (friendDoc) {
      const userRef = doc(db, "users", friendDoc.id);
      const newFriends = [...friendDoc.data().friends];
      let i;
      for (let index = 0; index < newFriends.length; index++) {
        const friend = newFriends[index];
        if(friend.id === props.userID){
          i = index;
        }
      }
      newFriends.splice(i,1);
      await setDoc( userRef, {friends: [...newFriends]}, {merge: true});
    }
    async function removeFriendFromUser (userDoc, removeId) {
      const newUserData = {
        ...props.userData,
        friends: [...props.userData.friends],
      };
      const newFriends = [...userDoc.data().friends];
      let i;
      for (let index = 0; index < newFriends.length; index++) {
        const friend = newFriends[index];
        if(friend.id === removeId){
          i = index;
        }
      }
      newFriends.splice(i,1);
      newUserData.friends = [...newFriends];
      props.setStateOfUserData(newUserData);
    }
    async function removeFriend(){
      const friend = await getUser(toRemove.id);
      const user = await getUser(props.userID);
      if(!friend){
        console.error("Error finding friend in DB");
      }else{
        await removeUserFromFriend(friend);
        await removeFriendFromUser(user, toRemove.id);
      }
    }
    async function declineFriend(){
      //console.log(declineCode);
      const sender = await getUser(declineCode);
      const user = await getUser(props.userID);
      if(!sender){
        console.error("Error finding sender in DB");
      }
      else{
        await removeFriendFromUser(user, declineCode);
      }
    }
    if(request && toRemove !== null){
      //Removing friend
      removeFriend();
    }
    if(request && friendCode !== null){
      checkAndSendFriendRequest();
    }
    if(request && acceptCode !== null){
      acceptAndSetFriend();
    }
    if(request && declineCode !== null){
      // Decline friend request
      declineFriend();
    }
    return () => {
      setDeclineCode(null);
      setAcceptCode(null);
      setFriendCode(null);
      setToRemove(null);
      setLoading(false);
      setRequest(false);
    }
  },[request])

  if(editMode){
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
          <Dialog sx={{zIndex: 99}} open={removeFriendDialog} onClose={() => setRemoveFriendDialog(false)}>
            <DialogTitle>Remove Friend</DialogTitle>
            <DialogContent>
              <DialogContentText>Would you like to remove {toRemove ? toRemove.name : '...'} as a friend?</DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-evenly'}}>
              <Button variant="contained" sx={{backgroundColor: '#8B0000'}} onClick={confirmRemoveFriend} >Confirm</Button>
              <Button variant="contained" onClick={() => setRemoveFriendDialog(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <Divider variant="fullWidth" />
          <List disablePadding sx={{ width: "100%"}} subheader={<ListSubheader sx={{textAlign: 'left', display: 'flex', justifyContent: 'space-between'}} >Friends<ButtonBase onClick={handleEditFriendsEvent} sx={{marginTop: '8px', marginBottom: '8px'}}><ModeEditOutlineOutlinedIcon /></ButtonBase></ListSubheader>}>
            <Divider variant="fullWidth" component="li" />
            {props.userData.friends.map((el, index) => {
              return (
                <div key={el.id}>
                  <ListItem
                    key={el.id}
                    disablePadding
                    secondaryAction={
                      <Badge color="primary" variant="dot" invisible={dot}> 
                        <MailIcon />
                      </Badge>
                    }
                  >
                    <ListItemButton id={index.toString()} onClick={() => handleRemoveFriend(el)}>
                      <ListItemIcon>
                        <RemoveCircleOutlineIcon sx={{color: '#8B0000'}} />
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
  }
  if(props.isSending) {
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
                      <Badge color="primary" variant="dot" invisible={dot}> 
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
            <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{width: '100%'}}>
              {snackContent}
            </Alert> 
          </Snackbar>
          <Dialog sx={{zIndex: 99}} open={addFriendDialog} onClose={() => setAddFriendDialog(false)}>
            <DialogTitle>Send Friend Request</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter friend code or scan QR code</DialogContentText>
              <TextField autoFocus={true} onChange={handleFriendCodeInput} value={friendCode ? friendCode : ""}  margin="dense" id="friendcode" label="Friend Code" type="text" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions sx={{gap: '0px'}}>
              <Button variant="contained" onClick={sendFriendRequest} >Add Friend</Button>
              {/* scannerEvent || props.qrscanEvent */}
              <Button variant="contained" onClick={scannerEvent} >QR Code</Button>
              <Button variant="contained" onClick={() => setAddFriendDialog(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
          {showScanner ? <QRScan closeScannerEvent={closeScannerEvent} setStateOfFriendCode={setStateOfFriendCode} /> : <></>}
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
                  <ListItem disablePadding secondaryAction={<Box sx={{display: 'flex', gap: '16px'}}><IconButton onClick={handleFriendAccept}><CheckIcon id={el.id} /></IconButton><IconButton id={el.id} onClick={() => handleFriendDecline(el.id)}><CloseIcon id={el.id} /></IconButton></Box>} >
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
          <List disablePadding sx={{ width: "100%"}} subheader={<ListSubheader sx={{textAlign: 'left', display: 'flex', justifyContent: 'space-between'}} >Friends<ButtonBase onClick={handleEditFriendsEvent} sx={{marginTop: '8px', marginBottom: '8px'}}><ModeEditOutlineOutlinedIcon /></ButtonBase></ListSubheader>}>
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
                        <Badge color="primary" variant="dot" invisible={dot} >
                          <MailIcon />
                        </Badge>
                      }
                    >
                      <ListItemButton onClick={() =>{ props.friendSelectEvent(index)}}>
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
