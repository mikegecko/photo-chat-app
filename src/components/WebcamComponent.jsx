import { Box } from "@mui/system";
import { Avatar, Button, ButtonBase, IconButton } from "@mui/material";
import Webcam from "react-webcam";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

export default function WebcamComponent(props) {
  const videoConstraints = {
    facingMode: props.facingMode ? props.facingMode : "user",
  };

  return (
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        ref={props.cameraRef}
        videoConstraints={videoConstraints}
      ></Webcam>
  );
}
