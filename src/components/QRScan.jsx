import { ButtonBase } from "@mui/material";
import { Box } from "@mui/system";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function QRScan(props) {
  const vidRef = useRef(null);
  const [qrScanner, setQrScanner] = useState();

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
    scan.start();
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

  return (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        top: '80px',
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
          zIndex: 5,
        }}
      >
        <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
      </ButtonBase>
      <video ref={vidRef}></video>
    </Box>
  );
}
