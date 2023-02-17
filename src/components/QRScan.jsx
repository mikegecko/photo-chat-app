import { ButtonBase, Typography } from "@mui/material";
import { Box } from "@mui/system";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function QRScan(props) {
  const vidRef = useRef(null);
  const [qrScanner, setQrScanner] = useState();
  const [hasCamera, setHasCamera] = useState();
  const [loading, setLoading] = useState(true);

  const scanErrorHandler = (err) => {
    console.error(err);
  };

  useEffect(() => {
    setLoading(true);
    const scan = new QrScanner(
      vidRef.current,
      (result) => props.setStateOfFriendCode(result.data),
      {
        preferredCamera: "environment",
        returnDetailedScanResult: true,
        onDecodeError: (error) => scanErrorHandler(error),
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    setQrScanner(scan);
    // async function cameraCheck() {
    //   const result = await QrScanner.hasCamera().then();
    //   return result;
    // }
    scan.start();
    // if (!cameraCheck()) {
    //   setHasCamera(false);
    // } else {
    //   setHasCamera(true);
    // }
    setLoading(false);
    return () => {
      scan.stop();
    };
  }, []);
  useEffect(() => {
    // qrScanner.start();
    // return () => {
    //     qrScanner.stop();
    // }
    console.log(hasCamera);
  }, [hasCamera]);

    return (
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          top: "80px",
          height: "calc(100% - 80px)",
          width: "100%",
          backgroundColor: "#1f1f1f",
          zIndex: 1000,
        }}
      >
        <ButtonBase
          onClick={props.closeScannerEvent}
          sx={{
            position: "absolute",
            top: "25px",
            left: "20px",
            opacity: "54%",
            zIndex: 1005,
          }}
        >
          <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
        </ButtonBase>
        <Typography variant="h4" sx={{position: 'absolute' ,top: '50%'}}>No Camera</Typography>
        <video ref={vidRef}></video>
        
      </Box>
    );
}
