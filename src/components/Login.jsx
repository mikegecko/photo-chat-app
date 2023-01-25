import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";


export default function Login ({loading, hidden, loginHandler}) {
    if(hidden){
        return(<></>);
    }
    return(
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', position:'absolute', width: '100%', height: '100%', bgcolor: '#1F1F1F', zIndex:10}}>
            <Box sx={{padding:'3rem', color:'white', fontWeight:'bold',fontSize:64}}>PicFlo</Box>
            <LoadingButton onClick={loginHandler} variant="outlined" loading={loading}>Sign-In with Google™</LoadingButton>
        </Box>
    )
}