import { ButtonBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";

export default function Capture({ capture, closeEvent, mobileView }) {
  const mobileStyle = {
    position: "absolute",
    top: "105px",
    left: "20px",
    opacity: "54%",
    zIndex: 5,
  }
  const desktopStyle = {
    position: "absolute",
    top: "105px",
    left: "calc(30% + 20px)",
    opacity: "54%",
    zIndex: 5,
  }
  return (
    <Box>
      <ButtonBase
        onClick={closeEvent}
        sx={mobileView ? mobileStyle : desktopStyle}
      >
        <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
      </ButtonBase>
      <img className="capture" src={capture} alt="taken pic" />
      </Box>
  );
}
