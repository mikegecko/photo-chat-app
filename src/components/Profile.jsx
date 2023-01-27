import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Box } from "@mui/system";


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
    
    
    
    */
    return(
        <Box sx={{display:'flex',height:'100%', flexDirection:'column', color:'white' }}>
            <Typography variant='h4' sx={{paddingTop:'10px'}}>Account</Typography>
            <List sx={{width:'100%', color: 'white', fontFamily:'Roboto'}}>
                <Divider variant="fullWidth" component="li" />
                <ListItem disablePadding secondaryAction={<ListItemText primary={props.user.user.displayName}/>} >
                    <ListItemButton>
                        <ListItemText primary="Name" />
                    </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
                <ListItem disablePadding secondaryAction={<ListItemText primary={props.user.user.email}/>} >
                    <ListItemButton>
                        <ListItemText primary="Email" />
                    </ListItemButton>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
            </List>
        </Box>
    )
}