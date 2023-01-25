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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);
  const [capture, setCapture] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [loading,setLoading] = useState(false);
  const [hideLogin, setHideLogin] = useState(false);
  const breakpoint = 768;
  const cameraRef = useRef(null);

  
  const clearCaptureEvent = (e) => {
    setCapture(null);
    
  }
  const captureEvent = (e) => {
    const imgSrc = cameraRef.current.getScreenshot();
    setCapture(imgSrc);
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
  }
  const loginEvent = (e) => {
    setLoading(true);
    
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
  useEffect(()=> {
    signIn();
  },[loading])

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
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ButtonBase>
          <NotificationsIcon
            sx={{ color: "white", height: "40px", width: "40px" }}
          />
        </ButtonBase>
        <Avatar />
        <ButtonBase>
          <PeopleIcon sx={{ color: "white", height: "40px", width: "40px" }} />
        </ButtonBase>
      </Box>
      <Box sx={{display:'flex'}}>
        <ButtonBase
          onClick={switchCameraEvent}
          sx={{
            display: capture ? 'none' : 'block',
            position: "absolute",
            top: "105px",
            right: "20px",
            opacity: "54%",
            zIndex: 5,
          }}
        >
          <FlipCameraAndroidIcon sx={{ color:'white', height: "30px", width: "30px" }} />
        </ButtonBase>
        <ButtonBase
          aria-label="upload picture"
          component='label'
          sx={{
          display: capture ? 'none' : 'block',
          position: "absolute",
          top: "105px",
          left: "20px",
          opacity: "54%",
          zIndex: 5,}}>
          <input hidden accept="image/*" type="file" onChange={galleryEvent} />
          <PhotoLibraryIcon sx={{ color:'white', height: "30px", width: "30px" }} />
        </ButtonBase>
        
      </Box>
      {capture ? <Capture capture={capture} closeEvent={clearCaptureEvent} /> : <WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />}
      <Box
        sx={{
          height: "80px",
          width: "100%",
          bgcolor: "#004D9B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ButtonBase>
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

async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    // userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    // userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    // userNameElement.removeAttribute('hidden');
    // userPicElement.removeAttribute('hidden');
    // signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    // signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    // saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    // userNameElement.setAttribute('hidden', 'true');
    // userPicElement.setAttribute('hidden', 'true');
    // signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    // signInButtonElement.removeAttribute('hidden');
  }
}
// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}
 // Returns the signed-in user's profile Pic URL.
 function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}
export default App;
