import { Box } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import "./App.css";
import { Avatar, Button, ButtonBase, CssBaseline, IconButton, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import WebcamComponent from "./components/WebcamComponent";
import Capture from "./components/Capture";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./components/config";
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const usersRef = collection(db, "users");
export const messageChainsRef = collection(db, "message_chains");

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);
  const [capture, setCapture] = useState(null);
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
  const breakpoint = 768;
  const cameraRef = useRef(null);
  
  const pageSelector = () => {
    //decouple appPage from this
    switch (appPage) {
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
          return <Capture capture={capture} closeEvent={clearCaptureEvent} />;
        }
        break;
      case "profile":
        return (
          <Profile user={user} logoutEvent={logoutEvent} userData={userData} userID={userID} theme={theme} qrcodeEvent={qrcodeEvent} />
        );
      case "friends":
        return <Friends userData={userData} friendSelectEvent={friendSelectEvent} theme={theme} />;
      case "friends-sending":
        return <Friends isSending={true} capture={capture} userData={userData} theme={theme} />;
      case "chat":
        
        //This done broke af --FIX LATER--
        return <Chat friend={friend} userData={userData} userID={userID} theme={theme} setStateOfUserData={setStateOfUserData} />
        break;
      case "notifications":
        return(<Notifications theme={theme} />)
      case "settings":
        return <Settings userID={userID} user={user} userData={userData} setStateOfSettings={setStateOfSettings} settings={settings} theme={theme} />;
      case "qrcode":
        return <QRcode userID={userID} width={width} />
      default:
        return (
          <WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />
        );
    }
  };
  //Debug handler for temp button
  const debugHandler = (e) => {
    setStateOfUserData('friends', {name: 'Somename', id:"2fg2ef3", })
  }
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
  };
  const settingsEvent = (e) => {
    setAppPage("settings");
    setCameraControls(false);
  };
  const friendsEvent = (e) => {
    setAppPage("friends");
    setCameraControls(false);
  };
  const friendSelectEvent = (friendIndex) => {
    setFriend(friendIndex);
    setAppPage('chat');
    setCameraControls(false);
  }
  const notificationEvent = (e) => {
    setAppPage('notifications');
    setCameraControls(false);
  }
  const sendEvent = (e) => {
    setAppPage('friends-sending');
    setCameraControls(false);
  }
  useEffect(() => {
    const handleResizeWindow = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  // Firestore functions for userData
  useEffect(() => {
    async function createUser () {
      const docRef = await addDoc(usersRef, {
        name: user.user.displayName,
        uid: user.user.uid,
        friends: [],
        friendRequests: {},
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
    async function getAndCreateUser () {
      const userT = await getUser();
      // If user does not exist userT is undefined
      if(!userT){
        await createUser();
        const userJ = await getUser();
        setUserID(userJ.id);
        setUserData(userJ.data());
      }
      else{
        setUserID(userT.id);
        setUserData(userT.data());
      }
    }

    if (user) {
      getAndCreateUser();
      setHideLogin(true);
      
    } else {
      setHideLogin(false);
    }
  }, [user]);
  //Debugging state
  useEffect(() => {
    if(userData){
      console.log(userData);
    }
  },[userData])
  //Theme control
  useEffect(() => {
    if(settings.brightnessMode){
      setTheme(themeDark);
    }
    else{
      setTheme(themeLight);
    }
  }, [settings])
  if (width > breakpoint) {
    //Desktop view
    return <div className="App"></div>;
  }
  //Mobile View
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
        <ButtonBase disabled={arrowControl()} onClick={sendEvent}>
          <ArrowForwardIcon
            sx={arrowStyle()}
          />
        </ButtonBase>
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
