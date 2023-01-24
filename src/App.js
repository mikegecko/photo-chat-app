import { Box } from '@mui/system';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import './App.css';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

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
        <NotificationsIcon sx={{color:'white', height:'40px', width:'40px'}}/>
        <Avatar />
        <PeopleIcon sx={{color:'white', height:'40px', width:'40px'}}/>
      </Box>
      <Box sx={{height: '80px',width:'100%', bgcolor:'#004D9B'}}>
          
      </Box>
    </div>
  );
}

export default App;
