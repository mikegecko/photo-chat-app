import { ButtonBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Capture({ capture, closeEvent }) {
  return (
    <div>
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
      <img src={capture} alt="taken pic" />
    </div>
  );
}
