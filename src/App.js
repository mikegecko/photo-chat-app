import { Box } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import './App.css';
import { Avatar, Button, ButtonBase } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";

function App() {
  const [width,setWidth] = useState(window.innerWidth);
  const breakpoint = 768;
  

  useEffect(() => {
    const handleResizeWindow = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    }
  },[])
  if(width > breakpoint){
    //Desktop view
    return(
      <div className='App'>
       
      </div>
    );
  }
  //Mobile View
  return (
    <div className="App">
      <Box sx={{height: '80px', width:'100%', bgcolor:'#004D9B', display:'flex',alignItems:'center', justifyContent:'space-around'}}>
        <ButtonBase>
          <NotificationsIcon  sx={{color:'white', height:'40px', width:'40px'}}/>
        </ButtonBase>
        <Avatar />
        <ButtonBase>
          <PeopleIcon sx={{color:'white', height:'40px', width:'40px'}}/>
        </ButtonBase>
      </Box>
      <Webcam height={500}/>
      <Box sx={{height: '80px',width:'100%', bgcolor:'#004D9B'}}>
      </Box>
    </div>
  );
}

export default App;
