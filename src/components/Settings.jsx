import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useState } from "react";
import { motion } from "framer-motion";


export default function Settings(props){
    const [checked,setChecked] = useState(["brightnessMode"]);
    
    const handleToggle = (value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if(currentIndex === -1){
            newChecked.push(value);
        }else{
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    }
    const visible = {rotate: 180, scale: 1};
    const hidden = {scale:0};

    const brightnessIconSelect = () => {
        
            return(<>
            <Box 
                sx={{position: "absolute"}}
                initial={{scale:0}}
                animate={checked.indexOf('brightnessMode') ? hidden : visible}
                component={motion.div}
                transition={{type: "spring", stiffness: 260, damping: 20}}>
                    <DarkModeIcon />
                </Box>
                <Box
                initial={{scale:0}}
                animate={checked.indexOf('brightnessMode') ? visible : hidden}
                component={motion.div}
                transition={{type: "spring", stiffness: 260, damping: 20}}>
                    <LightModeIcon/>
                </Box>
                </>)
        
        
    }

    return(
        <Box sx={{display:'flex',height:'100%', flexDirection:'column', color:'white' }}>
            <Typography variant='h4' sx={{paddingTop:'10px'}}>Settings</Typography>
            <List>
            <Divider variant="fullWidth" component="li" />
            <ListItem >
                        <ListItemButton onClick={() => handleToggle('brightnessMode')}>
                        <ListItemIcon sx={{color: "white"}}>
                            {brightnessIconSelect()}
                        </ListItemIcon>
                        <ListItemText primary="Toggle Dark/Light Mode" />
                        <Switch edge='end' onChange={() => handleToggle('brightnessMode')} checked={checked.indexOf('brightnessMode') !== -1} />
                        </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )
}