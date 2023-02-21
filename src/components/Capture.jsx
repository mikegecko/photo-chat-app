import { ButtonBase, InputBase, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import { useState } from "react";

export default function Capture({window_width, window_height, capture, closeEvent, mobileView }) {

  const [showTextField, setShowTextField] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [textFieldPos, setTextFieldPos] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x:0,y:0});
  const [width, setWidth] = useState(0);

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
  const desktopCaptionStyle = {
    position: 'absolute',
    width: '70%', 
    top: textFieldPos.y, 
    mt: -2,
    left: '30%',
    backgroundColor: 'rgba(31, 31, 31, 0.6)',
  }
  const mobileCaptionStyle = {
    position: 'absolute',
     width: 1, 
     top: textFieldPos.y, 
     mt: -2,
     backgroundColor: 'rgba(31, 31, 31, 0.6)',
  }
  const handleBoxClick = (e) => {
    let y = e.clientY;
    if(y < 160){
      y = 160;
    }
    if(y > (window_height * 0.64) && !mobileView){
      y = window_height * 0.64;
    }
    if(y > (window_height - 160) && mobileView){
      y = (window_height - 160);
    }
    setTextFieldPos({x: e.clientX, y: y });
    setShowTextField(true);
  }
  const handleTextFieldChange = (e) => {
    setTextFieldValue(e.target.value);
  }
  const handleBoxMouseDown = (e) => {
    setDragOffset({x: e.clientX - textFieldPos.x, y: e.clientY - textFieldPos.y})
    setIsDragging(true);
  }
  const handleMouseMove = (e) => {
    if(isDragging){
      setTextFieldPos({x: textFieldPos.x, y: e.clientY - dragOffset.y});
    }
  }
  const handleMouseUp = (e) => {
    setIsDragging(false);
  }
  const handleTextFieldBlur = (e) => {
    setShowTextField(false);
  }

  return (
    <Box onClick={handleBoxClick} onMouseDown={handleBoxMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <ButtonBase
        onClick={closeEvent}
        sx={mobileView ? mobileStyle : desktopStyle}
      >
        <CloseIcon sx={{ color: "white", height: "30px", width: "30px" }} />
      </ButtonBase>
      <img className="capture" src={capture} alt="taken pic" />
      {showTextField && (
        <Box sx={mobileView ? mobileCaptionStyle : desktopCaptionStyle}>
          <InputBase inputProps={{style: {textAlign: 'center', opacity: '100%'}}} sx={{display:'flex', alignItems:'center', justifyContent: 'center', textAlign: 'center', opacity: '100%'}} fullWidth value={textFieldValue} onChange={handleTextFieldChange} />
        </Box>
      )}
    </Box>
  );
}
