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

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerWidth);
  const [capture, setCapture] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
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

  if (width > breakpoint) {
    //Desktop view
    return <div className="App"></div>;
  }
  //Mobile View
  return (
    <div className="App">
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

export default App;
