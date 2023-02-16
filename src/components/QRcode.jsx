import { ButtonBase } from "@mui/material";
import { Box } from "@mui/system";
import { QRCodeSVG } from "qrcode.react";
import CloseIcon from "@mui/icons-material/Close";

export default function QRcode(props) {
  const desktopStyle = {
    position: "absolute",
    top: "105px",
    left: "calc(30% + 20px)",
    opacity: "54%",
    zIndex: 5,
  };
  const mobileStyle = {
    position: "absolute",
    top: "105px",
    left: "20px",
    opacity: "54%",
    zIndex: 5,
  }
  //Desktop View
  if (!props.mobileView) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px",
        }}
      >
        <ButtonBase onClick={props.qrcodeCloseEvent} sx={desktopStyle}>
          <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
        </ButtonBase>
        <Box className="box" sx={{ padding: "25px" }}>
          <QRCodeSVG value={props.userID} size={props.height * 0.3} />
        </Box>
      </Box>
    );
  }
  //Mobile View
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px",
      }}
    >
      <ButtonBase onClick={props.qrcodeCloseEvent} sx={mobileStyle}>
        <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
      </ButtonBase>
      <Box className="box" sx={{ padding: "25px" }}>
        <QRCodeSVG value={props.userID} size={props.width * 0.8} />
      </Box>
    </Box>
  );
}
