/** @jsxImportSource @emotion/react */
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ButtonBase, Typography } from "@mui/material";

export default function StyledImageMessage(props) {
  const [view, setView] = useState(false);
  const [show, setShow] = useState(true);
  const senderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    bgcolor: "#002b5a",
    flexDirection: "row",
    margin: "8px",
    padding: "4px",
    borderRadius: ".7rem .7rem 0 .7rem",
  };
  const receiverStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    bgcolor: "#454545",
    flexDirection: "row",
    margin: "8px",
    padding: "4px",
    borderRadius: ".7rem .7rem .7rem 0",
  };
  const viewStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    bgcolor: "#002b5a",
    flexDirection: "row",
    margin: "8px",
    padding: ".5rem 1rem .5rem 1rem",
    borderRadius: ".7rem .7rem 0 .7rem",
  };

  const styleMessage = () => {
    //Message is from user
    if (props.userID === props.message.sender) {
      if(!props.mobileView){
        return(senderStyle);
      }
      return viewStyle;
    }
    //Message is from friend
    else {
      return receiverStyle;
    }
  };
  const viewContent = () => {
    if (show) {
      return (
        <>
          <VisibilityIcon />
          <Typography>Press to View</Typography>
        </>
      );
    } else {
      return (
        <>
          <VisibilityOutlinedIcon />
          <Typography>Viewed</Typography>
        </>
      );
    }
  };
  const viewEvent = (e) => {
    setView(!view);
  };
  useEffect(() => {

    //Interval for view length
    if(view){
      var interval = setInterval(() => {
        // Hide image & change message
          setView(!view);
          setShow(false);
      }, 8000)
    }
    
    return() => {
        clearInterval(interval);
    }
  }, [view]);
  if (props.mobileView) {
    return (
      <Box key={props.id} sx={() => styleMessage()}>
        <ButtonBase onClick={viewEvent} sx={() => styleMessage()}>
          {!view ? viewContent() : <Box sx={{backgroundColor: '#1f1f1f', position: 'fixed', top:'80px', left: '0', height: 'calc(100vh - 160px)', width: '100%', zIndex: 6}}><img
        css={css`
        position: fixed;
        display: flex;
        top: 50%;
        left: 0;
        width: 100%;
        max-height: calc(100vh - 160px);
        z-index: 7;
        transform: translateY(-50%);
      `}
        src={props.message.imageURL}
        alt={`${props.message.sender}'s pic`}
      /></Box>}
        </ButtonBase>
      </Box>
    );
  }
  else{
    return (
      <Box key={props.id} sx={() => styleMessage()}>
        <img
          css={css`
            width: 100%;
            max-width: 100%;
            border-radius: 0.7rem;
          `}
          src={props.message.imageURL}
          alt={`${props.message.sender}'s pic`}
        />
      </Box>
    );
  }
  
}
