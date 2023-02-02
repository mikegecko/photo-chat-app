import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Box } from "@mui/system";
import { ListItemIcon } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Profile(props){

    /*
        Mabe combine this with settings and find new use for profile click like a qr code/ uuid for adding friends
        What to display on this page:
        - Display name
        - email
        - account age
        - dark/light mode toggle
        - friend code
        - delete account
        - maybe some debug stuff?
    
        !!!! ADD LOADING SYSTEM FOR ALL ITEMS
    
    */
    return(
        <Box sx={{display:'flex',height:'100%', flexDirection:'column', color:'white' }}>
            <Typography variant='h4' sx={{paddingTop:'10px'}}>Account</Typography>
            <List sx={{width:'100%', color: 'white', fontFamily:'Roboto'}}>
                
                <Divider variant="fullWidth" component="li" />
                <ListItem disablePadding secondaryAction={<LogoutIcon />} >
                    <ListItemButton onClick={props.logoutEvent}>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
                
            </List>
        </Box>
    )
}