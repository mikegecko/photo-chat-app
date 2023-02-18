import { Box } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import "./App.css";
import { Alert, Avatar, Button, ButtonBase, CssBaseline, Divider, IconButton, Snackbar, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Webcam from "react-webcam";
import WebcamComponent from "./components/WebcamComponent";
import Capture from "./components/Capture";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./components/config";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getPerformance } from "firebase/performance";
import Login from "./components/Login";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Friends from "./components/Friends";
import Notifications from "./components/Notifications";
import Chat from "./components/Chat";
import { motion } from "framer-motion";
import { themeDark, themeLight } from "./theme/theme";
import QRcode from "./components/QRcode";
import SendIcon from '@mui/icons-material/Send';
import QRScan from "./components/QRScan";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const usersRef = collection(db, "users");
export const messageChainsRef = collection(db, "message_chains");

const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);
  const [capture, setCapture] = useState(null);
  const [rawCapture, setRawCapture] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [hideLogin, setHideLogin] = useState(false);
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [appPage, setAppPage] = useState("camera");
  const [cameraControls, setCameraControls] = useState(true);
  const [userID, setUserID] = useState();
  const [userData, setUserData] = useState();
  const [friend, setFriend] = useState();
  const [settings, setSettings] = useState({brightnessMode:getPreferredColorScheme(), });
  const [theme, setTheme] = useState(getPreferredColorScheme() ? themeLight : themeDark);
  const [sending, setSending] = useState(false);
  const [sendList, setSendList] = useState([]);
  const [mobileView, setMobileView] = useState(false);
  const [snack, setSnack] = useState(false);
  const [snackInfo, setSnackInfo] = useState({});
  const breakpoint = 768;
  const cameraRef = useRef(null);
  
  const pageSelector = (override) => {
    //decouple appPage from this
    let x = appPage;
    if(override){
      x = override;
      setAppPage(override);
    }
    switch (x) {
      case "camera":
        return (
          <WebcamComponent
            cameraRef={cameraRef}
            facingMode={facingMode}
            switchCameraEvent={switchCameraEvent}
            galleryEvent={galleryEvent}
          />
        );
      case "capture":
        if (capture) {
          return <Capture mobileView={mobileView} capture={capture} closeEvent={clearCaptureEvent} />;
        }
        break;
      case "profile":
        return (
          <Profile mobileView={mobileView} user={user} logoutEvent={logoutEvent} userData={userData} userID={userID} theme={theme} qrcodeEvent={qrcodeEvent} />
        );
      case "friends":
        return <Friends qrscanEvent={qrscanEvent} userData={userData} setStateOfSendList={setStateOfSendList} userID={userID} friend={friend} friendSelectEvent={friendSelectEvent} theme={theme} setStateOfUserData={setStateOfUserData} />;
      case "friends-sending":
        return <Friends isSending={true} setStateOfSendList={setStateOfSendList} sending={sending} friend={friend} capture={capture} userData={userData} userID={userID} theme={theme} setStateOfUserData={setStateOfUserData} />;
      case "chat":
        return <Chat key={friend} mobileView={mobileView} friend={friend} userData={userData} userID={userID} theme={theme} setStateOfUserData={setStateOfUserData} />
      case "notifications":
        return(<Notifications userData={userData} theme={theme} />)
      case "settings":
        return <Settings userID={userID} user={user} userData={userData} setStateOfSettings={setStateOfSettings} settings={settings} theme={theme} />;
      case "qrcode":
        return <QRcode qrcodeCloseEvent={qrcodeCloseEvent} mobileView={mobileView} userID={userID} width={width} height={height} />
      case "qrcodescan":
        //Temp for debugging qrscanner
        return <QRScan  />
      default:
        return (
          <WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />
        );
    }
  };

  const handleSnackClose = () => {
    setSnack(false);
    setSnackInfo({...snackInfo, content: ""});
  }

  const setStateOfSendList = (arr) => {
    setSendList([...arr]);
  }
  // Calling/setting this state will cause a DB update
  const setStateOfUserData = (userDataObj) => {
    if(!userData){
      return;
    }
    else{
      setUserData(userDataObj);
    }
  }
  const setStateOfSettings = (key, value) => {
    const newSettings = {...settings};
    newSettings[key] = value;
    setSettings(newSettings);
    //console.log(settings);
  }
  const iconStyle = (iconName) => {
    const activeStyle = {
      color: "white",
      height: "40px",
      width: "40px",
      opacity: "100%",
    };
    const inactiveStyle = {
      color: "white",
      height: "40px",
      width: "40px",
      opacity: "65%",
    };
    if (iconName === appPage) {
      return activeStyle;
    } else {
      return inactiveStyle;
    }
  };
  const iconScale = (iconName) => {
    const active = {
      scale: 1.17
    }
    const inactive = {
      scale: 1
    }
    if(iconName === appPage){
      return active;
    }
    else{
      return inactive;
    }
  }
  const arrowStyle = () => {
    const activeStyle = {
      color: "white",
      height: "40px",
      width: "40px",
      opacity: "100%",
    };
    const inactiveStyle = {
      color: "white",
      height: "40px",
      width: "40px",
      opacity: "65%",
    };
    if(appPage === 'capture' || appPage === 'friends-sending'){
      return(activeStyle);
    }
    else{
      return(inactiveStyle);
    }
  }
  const arrowControl = () => {
    if(appPage === 'capture' || appPage === 'friends-sending'){
      return(false);
    }
    else{return(true)}
  }
  const qrcodeEvent = () => {
    setCapture(null);
    setAppPage('qrcode');
    setCameraControls(false);
  }
  const qrcodeCloseEvent = (e) => {
    setAppPage("profile");
    setCameraControls(false);
    setSending(false);
  }
  const qrscanEvent = () => {
    // Temp for debugging qrscanner
    setCapture(null);
    setAppPage('qrcodescan');
    setCameraControls(false);
  }
  const clearCaptureEvent = (e) => {
    setCapture(null);
    setAppPage("camera");
    setCameraControls(true);
  };
  const captureEvent = (e) => {
    if (appPage !== "camera") {
      clearCaptureEvent();
    } else {
      const imgSrc = cameraRef.current.getScreenshot();
      setRawCapture(imgSrc);
      setCapture(imgSrc);
      setAppPage("capture");
      setCameraControls(false);
    }
  };
  const switchCameraEvent = (e) => {
    if (facingMode === "user") {
      setFacingMode("environment");
    } else if (facingMode === "environment") {
      setFacingMode("user");
    }
    return;
  };
  const galleryEvent = (e) => {
    let src = URL.createObjectURL(e.target.files[0]);
    setRawCapture(e.target.files[0]);
    setCapture(src);
    setAppPage("capture");
    setCameraControls(false);
  };
  const loginEvent = (e) => {
    signInWithGoogle();
  };
  const logoutEvent = (e) => {
    console.log("Logged out");
    setAppPage('camera');
    signOut(auth);
    setHideLogin(false);
  };
  const profileEvent = (e) => {
    setAppPage("profile");
    setCameraControls(false);
    setSending(false);
  };
  const settingsEvent = (e) => {
    setAppPage("settings");
    setCameraControls(false);
    setSending(false);
  };
  const friendsEvent = (e) => {
    setAppPage("friends");
    setCameraControls(false);
    setSending(false);
  };
  const friendSelectEvent = (friendIndex) => {
    if(!mobileView){
      //BUG: Cannot select other friend chats on desktop
      setFriend(friendIndex);
      setCameraControls(false);
      setSending(false);
      setAppPage('chat');
    } else{
      setFriend(friendIndex);
      setAppPage('chat');
      setCameraControls(false);
      setSending(false);
    }
  }
  const notificationEvent = (e) => {
    setAppPage('notifications');
    setCameraControls(false);
    setSending(false);
  }
  const nextEvent = (e) => {
    setAppPage('friends-sending');
    setCameraControls(false);
    setSending(false);
  }
  // Maybe refactor this
  const sendEvent = (e) => {
    if(appPage === 'friends-sending'){
      const obj = sendList.find(el => el.send === true);
      if(!obj){
        setSnackInfo({content:'Please select a friend', severity: 'info'});
        setSnack(true);
      }
      else{
        setSending(true);
        //get list of people to send to with message_chains
        console.log('Sending Pic');
      } 
    }
  }
  //Window Size stuff
  useEffect(() => {
    const handleResizeWindow = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResizeWindow);
    if(width > breakpoint) {
      setMobileView(false);
    } else{
      setMobileView(true);
    }
    return () => {
      //Cleanup
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  //
  useEffect(() => {
    if(width > breakpoint) {
      setMobileView(false);
    } else{
      setMobileView(true);
    }
  },[width])
  // Firestore functions for userData runs when user gets updated from google auth
  useEffect(() => {
    async function createUser () {
      const docRef = await addDoc(usersRef, {
        name: user.user.displayName,
        uid: user.user.uid,
        friends: [],
        settings:{},
        joined: serverTimestamp(),

      });
      return docRef;
    }
    async function getUser () {
      const q = query(usersRef, where("uid", "==", user.user.uid));
      const querySnapshot = await getDocs(q);
      let i;
      //This could cause bugs if there is more than one result for query
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          i = doc;
          console.log(doc.id);
        } else {
          console.log("Could not retrieve userData");
        }
      });
      return(i);
    }
    // Figure out how to avoid infinite loop
    async function subscribeToFirestore (userDoc) {
      const unsubscribe = onSnapshot(doc(usersRef, userDoc.id), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        //console.log(source, "data: ", doc.data());
        if(source === 'Server'){
          setUserData(doc.data());
        }
      })
    }
    async function getAndCreateUser () {
      const userT = await getUser();
      // If user does not exist userT is undefined
      if(!userT){
        await createUser();
        const userJ = await getUser();
        setUserID(userJ.id);
        setUserData(userJ.data());
        subscribeToFirestore(userJ);
      }
      else{
        setUserID(userT.id);
        setUserData(userT.data());
        subscribeToFirestore(userT);
      }
    }

    if (user) {
      getAndCreateUser();
      setHideLogin(true);
      
    } else {
      setHideLogin(false);
    }
  }, [user]);
  //Runs when userData changes ex. new message chain, 
  useEffect(() => {
    //This function sets the user document in firestore to the userData state
    async function updateUserData () {
      const userRef = doc(db, "users", userID);
      await setDoc( userRef, userData, {merge: true});
    }

    async function getUser () {
      const q = query(usersRef, where("uid", "==", user.user.uid));
      const querySnapshot = await getDocs(q);
      let i;
      //This could cause bugs if there is more than one result for query
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          i = doc;
          console.log(doc.id);
        } else {
          console.log("Could not retrieve userData");
        }
      });
      return(i);
    }
    async function updateRefreshUserData () {
      await updateUserData();
      const user = getUser();
      if(!user){
        console.log("Error refreshing userData");
      }
      else{
        //This will infinitely loop
        //setUserData(user.data());
      }
    }
    if(userData){
      updateRefreshUserData();
      console.log(userData);
    }
  },[userData])
  // Hook for sending images to users by using firebase cloud storage
  //Add checks for message_chain -> create new chain if one doesnt exist
  useEffect(() => {
    async function saveImageMessage(file){
      for (let index = 0; index < sendList.length; index++) {
        const element = sendList[index];
        if(element.send){
          try{
            const messageRef = await addDoc(collection(db, `message_chains/${element.message_chain}/messages`), {
              imageURL: LOADING_IMAGE_URL,
              sender: userID,
              timestamp: serverTimestamp(),
            });
            // Upload image to cloud storage
            const filePath = `${getAuth().currentUser.uid}/${messageRef.id}/${file.name}`;
            const newImageRef = ref(getStorage(), filePath);
            const fileSnapshot = await uploadBytesResumable(newImageRef, file);
            // Generate url
            const publicImageUrl = await getDownloadURL(newImageRef);
            // Update placeholder image with image URL
            await updateDoc(messageRef, {
              imageURL: publicImageUrl,
              storageUrl: fileSnapshot.metadata.fullPath,
            });
    
          } 
          catch(error){
            console.error(error);
          }
        }
      }
    }

    if(capture && sending){
      saveImageMessage(rawCapture);
      clearCaptureEvent();
      setSnackInfo({content: "Image Sent", severity: "success"});
      setSnack(true);
    }


    return () => {

    }
  },[sending])
  //Debug Hooks
  useEffect(() => {
    console.log('Cap: ');
    console.log(capture);
    console.log('Raw: ');
    console.log(rawCapture);
  }, [capture])
  useEffect(() => {
    console.log(sendList);
  },[sendList])
  //Theme control
  useEffect(() => {
    if(settings.brightnessMode){
      setTheme(themeDark);
    }
    else{
      setTheme(themeLight);
    }
  }, [settings])

  //----------------
  //
  //  DESKTOP VIEW
  //
  //----------------

  if (width > breakpoint) {
    return <Box className="App">
      <Login loading={loading} hidden={hideLogin} loginHandler={loginEvent} />
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "80px",
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: '2rem',
          paddingRight: '2rem',
          zIndex: 2,
        }}
      >
        <Box sx={{display: 'flex' , flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <ButtonBase onClick={profileEvent}
        initial={{ scale: 0 }}
        animate={iconScale('profile')}
        component={motion.div}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <Avatar
            sx={{ height: "52px", width: "52px" }}
            src={user ? user.user.photoURL : null}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
        </ButtonBase>
        <Typography variant="h5" sx={{backgroundColor: "#004D9B", paddingLeft: '1rem' }}>
          {userData ? userData.name : ""}
        </Typography>
        </Box>
        <Box sx={{
          fontFamily: 'Pacifico',
          letterSpacing: '',
          fontSize: 44
        }}>
          PicFlo
        </Box>
      </Box>
      <Box>
        <ButtonBase
          aria-label="upload picture"
          component="label"
          sx={{
            display: cameraControls ? "block" : "none",
            position: "absolute",
            top: "105px",
            left: "calc(30% + 20px)",
            opacity: "54%",
            zIndex: 5,
          }}
        >
          <input hidden accept="image/*" type="file" onChange={galleryEvent} />
          <PhotoLibraryIcon
            sx={{ color: "white", height: "30px", width: "30px" }}
          />
        </ButtonBase>
      </Box>
      <Box sx={{display: 'flex' , minHeight: 'calc(100% - 160px)', height: 'calc(100% - 160px)', maxHeight: 'calc(100% - 160px)',  width: '100%', maxWidth: '100%' }}>
        <Box sx={{width: '30%', minWidth: '30%'}}>
           {userData ? capture ? <Friends isSending={true} setStateOfSendList={setStateOfSendList} sending={sending} friend={friend} capture={capture} userData={userData} userID={userID} theme={theme} setStateOfUserData={setStateOfUserData} /> : <Friends qrscanEvent={qrscanEvent} friend={friend} userData={userData} setStateOfSendList={setStateOfSendList} userID={userID} friendSelectEvent={friendSelectEvent} theme={theme} setStateOfUserData={setStateOfUserData} /> : <></>}
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{width: '100%', maxHeight: '100%'}}>
          {pageSelector()}
        </Box>
      </Box>
      
      <Box
        sx={{
          minHeight: "80px",
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ButtonBase onClick={settingsEvent}
        initial={{ scale: 0 }}
        animate={iconScale('settings')}
        component={motion.div}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <SettingsIcon sx={iconStyle("settings")} />
        </ButtonBase>
        <ButtonBase onClick={captureEvent}>
          <PanoramaFishEyeIcon
            sx={{ color: "white", height: "70px", width: "70px" }}
          />
        </ButtonBase>
          {(() => {
            if(appPage === 'friends-sending'){
              return(
                <ButtonBase disabled={arrowControl()} onClick={sendEvent}>
                  <SendIcon sx={arrowStyle()} />
                </ButtonBase>
                  )
            }
            else{
              
              return(
                <ButtonBase disabled={arrowControl()} onClick={nextEvent}>
                  <ArrowForwardIcon sx={arrowStyle()}/>
                </ButtonBase>
              )
            }
          })()}
      </Box>
      </ThemeProvider>
    </Box>;
  }
  //----------------
  //
  //  MOBILE VIEW
  //
  //----------------
  return (
    <Box className="App" >
      <Login loading={loading} hidden={hideLogin} loginHandler={loginEvent} />
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
      
        sx={{
          minHeight: "80px",
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 2,
        }}
      >
        <ButtonBase onClick={notificationEvent}
        initial={{ scale: 0 }}
        animate={iconScale('notifications')}
        component={motion.div}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <NotificationsIcon
            key="notifications"
            sx={iconStyle("notifications")}
          />
        </ButtonBase>
        <ButtonBase onClick={profileEvent}
        initial={{ scale: 0 }}
        animate={iconScale('profile')}
        component={motion.div}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <Avatar
            sx={{ height: "52px", width: "52px" }}
            src={user ? user.user.photoURL : null}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
        </ButtonBase>
        <ButtonBase onClick={friendsEvent}
          initial={{ scale: 0 }}
          animate={iconScale('friends')}
          component={motion.div}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}

          >
          <PeopleIcon sx={iconStyle("friends")} />
        </ButtonBase>
      </Box>
      <Box>
        <ButtonBase
          onClick={switchCameraEvent}
          sx={{
            display: cameraControls ? "block" : "none",
            position: "absolute",
            top: "105px",
            right: "20px",
            opacity: "54%",
            zIndex: 5,
          }}
        >
          <FlipCameraAndroidIcon
            sx={{ color: "white", height: "30px", width: "30px" }}
          />
        </ButtonBase>
        <ButtonBase
          aria-label="upload picture"
          component="label"
          sx={{
            display: cameraControls ? "block" : "none",
            position: "absolute",
            top: "105px",
            left: "20px",
            opacity: "54%",
            zIndex: 5,
          }}
        >
          <input hidden accept="image/*" type="file" onChange={galleryEvent} />
          <PhotoLibraryIcon
            sx={{ color: "white", height: "30px", width: "30px" }}
          />
        </ButtonBase>
      </Box>
      {pageSelector()}
      {/* <Button variant="outlined" color="primary" onClick={debugHandler}>Click me</Button> */}
      <Snackbar sx={{marginBottom: '80px'}} open={snack} autoHideDuration={5000} onClose={handleSnackClose} action={<IconButton onClick={handleSnackClose}><CloseIcon /></IconButton>} >
            <Alert onClose={handleSnackClose} severity={snackInfo.severity} sx={{width: '100%'}}>
              {snackInfo.content}
            </Alert> 
          </Snackbar>
      <Box
        sx={{
          minHeight: "80px",
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ButtonBase onClick={settingsEvent}
        initial={{ scale: 0 }}
        animate={iconScale('settings')}
        component={motion.div}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <SettingsIcon sx={iconStyle("settings")} />
        </ButtonBase>
        <ButtonBase onClick={captureEvent}>
          <PanoramaFishEyeIcon
            sx={{ color: "white", height: "70px", width: "70px" }}
          />
        </ButtonBase>
          {(() => {
            if(appPage === 'friends-sending'){
              return(
                <ButtonBase disabled={arrowControl()} onClick={sendEvent}>
                  <SendIcon sx={arrowStyle()} />
                </ButtonBase>
                  )
            }
            else{
              
              return(
                <ButtonBase disabled={arrowControl()} onClick={nextEvent}>
                  <ArrowForwardIcon sx={arrowStyle()}/>
                </ButtonBase>
              )
            }
          })()}
      </Box>
      </ThemeProvider>
    </Box>
  );
}
function getPreferredColorScheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode
    return(true)
  }
else{
  //light mode
  return(false)
}
}
export default App;
