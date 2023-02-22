/** @jsxImportSource @emotion/react */
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ImageIcon from '@mui/icons-material/Image';
import { ButtonBase, Typography } from "@mui/material";
import Countdown from "./Countdown";

export default function StyledImageMessage(props) {
  const [view, setView] = useState(false);
  const [show, setShow] = useState(true);
  const countdownLength = 5;

  const senderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: props.mobileView ? "row" : 'column',
    margin: "8px",
    padding: "4px",
    borderRadius: ".7rem .7rem 0 .7rem",
  };
  const receiverStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: props.mobileView ? "row" : 'column',
    gap: "1rem",
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
    flexDirection: "row",
    margin: "8px",
    padding: "4px",
    borderRadius: ".7rem .7rem 0 .7rem",
  };
  const captionStyle = {
    display: props.message.data.y < 40 ? 'none' : 'block',
    position: 'absolute',
    zIndex: 7,
     width: 1,
     left: 0,
     padding: '4px',
     height: '1.4375em',
     fontSize: '1rem',
     top: props.message.data.y - 80, 
     backgroundColor: 'rgba(31, 31, 31, 0.6)',
  }


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
    if(props.userID === props.message.sender){
      return(
        <>
          <ImageIcon />
          <Typography>Image Sent</Typography>
        </>
      )
    }
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
  // Fix not being able to quick end viewing
  const viewEvent = (e) => {
    //⚠️⚠️⚠️ UNDO THIS ⚠️⚠️⚠️
    // if(props.userID === props.message.sender ){
    //   // Ignore viewEvents if user is clicking own message 
    //   return;
    // }
    if(!show){
      //Message has already been viewed
      return;
    }
    else{
      if(show){
        setShow(!show);
        setView(!view);
        // Call function for updating viewed state in firestore HERE
        props.setStateOfMessageToUpdate({...props.message, viewed: true});
      }
      setView(!view);
    }
  };
  useEffect(() => {
    if(props.message.viewed){
      //Message has already been seen -> change show states
      setShow(false);
    }
  }, [])
  useEffect(() => {

    //Interval for view length
    if(view){
      var interval = setInterval(() => {
        // Hide image & change message
          setView(!view);
          setShow(false);
          // Call function for updating viewed state in firestore HERE
          props.setStateOfMessageToUpdate({...props.message, viewed: true});
      }, countdownLength*1000)
    }
    
    return() => {
        clearInterval(interval);
    }
  }, [view]);
  if (props.mobileView) {
    return (
      <Box key={props.id} sx={() => styleMessage()} bgcolor={props.userID === props.message.sender ? 'message.main' : 'messageR.main'}>
        <ButtonBase onClick={viewEvent} sx={() => styleMessage()}>
          {!view ? viewContent() : <Box bgcolor='background.default' sx={{ position: 'fixed', top:'80px', left: '0', height: 'calc(100vh - 160px)', width: '100%', zIndex: 6}}><img
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
      />
      <Countdown countdownLength={countdownLength}/>
      <Box sx={captionStyle}>{props.message.data.content}</Box>
      </Box>}
        </ButtonBase>
      </Box>
    );
  }
  else{
    return (
      <Box key={props.id} sx={() => styleMessage()} bgcolor={props.userID === props.message.sender ? 'message.main' : 'messageR.main'}>
        <img
          css={css`
            width: 100%;
            max-width: 100%;
            border-radius: 0.7rem;
          `}
          src={props.message.imageURL}
          alt={`${props.message.sender}'s pic`}
        />
        <Box>{props.message.data.content}</Box>
      </Box>
    );
  }
  
}
