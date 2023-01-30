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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, "users");

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);
  const [capture, setCapture] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [hideLogin, setHideLogin] = useState(false);
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [appPage, setAppPage] = useState("camera");
  const [cameraControls, setCameraControls] = useState(true);
  const [userData, setUserData] = useState();
  const breakpoint = 768;
  const cameraRef = useRef(null);

  const pageSelector = () => {
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
          <Profile user={user} logoutEvent={logoutEvent} userData={userData} />
        );
      case "friends":
        return <Friends />;
      case "notifications":
        break;
      case "settings":
        return <Settings />;
      default:
        return (
          <WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />
        );
    }
  };
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
  };
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
    
    async function createUser () {
      const docRef = await addDoc(collection(db, "users"), {
        name: user.user.displayName,
        uid: user.user.uid,
        friends: {},
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
      setUserData(userT);
      if(!userT){
        const userY = await createUser();
        setUserData(userY);
      }
    }

    if (user) {
      getAndCreateUser();
      setHideLogin(true);
      console.log(userData);
    } else {
      setHideLogin(false);
    }
  }, [user]);

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
        <ButtonBase>
          <NotificationsIcon
            key="notifications"
            sx={iconStyle("notifications")}
          />
        </ButtonBase>
        <ButtonBase onClick={profileEvent}>
          <Avatar
            sx={{ height: "52px", width: "52px" }}
            src={user ? user.user.photoURL : null}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
        </ButtonBase>
        <ButtonBase onClick={friendsEvent}>
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
      {/* {capture ? <Capture capture={capture} closeEvent={clearCaptureEvent} /> : <WebcamComponent cameraRef={cameraRef} facingMode={facingMode} />} */}
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
        <ButtonBase onClick={settingsEvent}>
          <SettingsIcon sx={iconStyle("settings")} />
        </ButtonBase>
        <ButtonBase onClick={captureEvent}>
          <PanoramaFishEyeIcon
            sx={{ color: "white", height: "70px", width: "70px" }}
          />
        </ButtonBase>
        <ButtonBase>
          <ArrowForwardIcon
            sx={{ color: "white", height: "40px", width: "40px" }}
          />
        </ButtonBase>
      </Box>
    </div>
  );
}

export default App;
