import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useState } from "react";


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
    const brightnessIconSelect = () => {
        if(checked.indexOf('brightnessMode') !== -1){
            return(<DarkModeIcon />)
        }
        else{
            return(<LightModeIcon />)
        }
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