import { ButtonBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";

export default function Capture({ capture, closeEvent }) {
  return (
    <Box>
      <ButtonBase
        onClick={closeEvent}
        sx={{
          position: "absolute",
          top: "105px",
          left: "20px",
          opacity: "54%",
          zIndex: 5,
        }}
      >
        <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
      </ButtonBase>
      <img className="capture" src={capture} alt="taken pic" />
      </Box>
  );
}
