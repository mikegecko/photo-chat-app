import { Box } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import "./App.css";
import { Avatar, Button, ButtonBase, IconButton } from "@mui/material";
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
} from 'firebase/auth';
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
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';
import Login from "./components/Login";
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import Profile from "./components/Profile";
import Settings from "./components/Settings";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);
  const [capture, setCapture] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [hideLogin, setHideLogin] = useState(false);
  const [signInWithGoogle , user , loading , error] = useSignInWithGoogle(auth);
  const [appPage, setAppPage] = useState('camera');
  const [cameraControls, setCameraControls] = useState(true);
  const breakpoint = 768;
  const cameraRef = useRef(null);

  const pageSelector = () => {
    
    switch (appPage) {
      case 'camera':
        return(<WebcamComponent cameraRef={cameraRef} facingMode={facingMode} switchCameraEvent={switchCameraEvent} galleryEvent={galleryEvent} />)
        break;
      case 'capture':
        if(capture){
          return(<Capture capture={capture} closeEvent={clearCaptureEvent} />)
        }
        break;
      case 'profile':
        return(<Profile />);
        break;
      case 'friends':
        
        break;
      case 'notifications':

        break;
      case 'settings':
        return(<Settings />)
        break;
      default:
        return(<WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />);
        break;
    }
  }
  const clearCaptureEvent = (e) => {
    setCapture(null);
    setAppPage('camera');
    setCameraControls(true);
  }
  const captureEvent = (e) => {
    if(appPage !== 'camera'){
      clearCaptureEvent();
    }
    else{
      const imgSrc = cameraRef.current.getScreenshot();
      setCapture(imgSrc);
      setAppPage('capture');
      setCameraControls(false);
    }
  };
  const switchCameraEvent = (e) => {
    if(facingMode === 'user'){
      setFacingMode('environment');
    }
    else if(facingMode === 'environment'){
      setFacingMode('user');
    }
    return;
  }
  const galleryEvent = (e) => {
    let src = URL.createObjectURL(e.target.files[0])
    setCapture(src);
    setAppPage('capture');
    setCameraControls(false);
  }
  const loginEvent = (e) => {
    signInWithGoogle();
  }
  const profileEvent = (e) => {
    setAppPage('profile');
    setCameraControls(false);
  }
  const settingsEvent = (e) => {
    setAppPage('settings');
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
  useEffect(() => {
    console.log(user);
    if(user){
      setHideLogin(true);
    }
  },[user])

  if (width > breakpoint) {
    //Desktop view
    return <div className="App"></div>;
  }
  //Mobile View
  return (
    <div className="App">
      <Login loading={loading} hidden={hideLogin} loginHandler={loginEvent} />
      <Box
        sx={{
          minHeight:"80px",
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 2,
        }}
      >
        <ButtonBase>
          <NotificationsIcon
            sx={{ color: "white", height: "40px", width: "40px" }}
          />
        </ButtonBase>
        <ButtonBase onClick={profileEvent} >
          <Avatar sx={{height:'52px', width: '52px'}} src={user ? user.user.photoURL : null} />
        </ButtonBase>
        <ButtonBase>
          <PeopleIcon sx={{ color: "white", height: "40px", width: "40px" }} />
        </ButtonBase>
      </Box>
      <Box>
        <ButtonBase
          onClick={switchCameraEvent}
          sx={{
            display: cameraControls ? 'block' : 'none',
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
            display: cameraControls ? 'block' : 'none',
            position: "absolute",
            top: "105px",
            left: "20px",
            opacity: "54%",
            zIndex: 5,
          }}
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={galleryEvent}
          />
          <PhotoLibraryIcon
            sx={{ color: "white", height: "30px", width: "30px" }}
          />
        </ButtonBase>
      </Box>
      {pageSelector()}
      {/* {capture ? <Capture capture={capture} closeEvent={clearCaptureEvent} /> : <WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />} */}
      <Box
        sx={{
          minHeight:"80px",
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ButtonBase onClick={settingsEvent}>
          <SettingsIcon
            sx={{ color: "white", height: "40px", width: "40px" }}
          />
        </ButtonBase>
        <ButtonBase onClick={captureEvent}>
          <PanoramaFishEyeIcon
            sx={{ color: "white", height: "70px", width: "70px" }}
          />
        </ButtonBase>
        <ButtonBase >
          <ArrowForwardIcon
            sx={{ color: "white", height: "40px", width: "40px" }}
          />
        </ButtonBase>
      </Box>
    </div>
  );
}

export default App;
