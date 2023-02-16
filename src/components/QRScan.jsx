import { ButtonBase, Typography } from "@mui/material";
import { Box } from "@mui/system";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function QRScan(props) {
  const vidRef = useRef(null);
  const [qrScanner, setQrScanner] = useState();
  const [hasCamera, setHasCamera] = useState();

  const scanErrorHandler = (err) => {
    console.error(err);
  };

  useEffect(() => {
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
    async function cameraCheck() {
      const result = await QrScanner.hasCamera().then();
      return result;
    }
    scan.start();
    if (!cameraCheck()) {
      setHasCamera(false);
    } else {
      setHasCamera(true);
    }
    return () => {
      scan.stop();
    };
  }, []);
  useEffect(() => {
    // qrScanner.start();
    // return () => {
    //     qrScanner.stop();
    // }
    console.log(qrScanner);
  }, [qrScanner]);

  if (hasCamera) {
    return <Box
        sx={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        top: "80px",
        height: "calc(100% - 160px)",
        width: '100%',
        backgroundColor: "#1f1f1f",
        opacity: '100%',
        zIndex: 1000,
      }}>
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
        <Typography variant="h4" sx={{top: '50%'}}>No Camera</Typography>
    </Box>;
  } else {
    return (
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          top: "80px",
          height: "calc(100% - 80px)",
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
        <video ref={vidRef}></video>
      </Box>
    );
  }
}
