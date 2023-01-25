import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";


export default function Login ({loading, hidden}) {
    if(hidden){
        return(<></>);
    }
    return(
        <Box>
            <LoadingButton variant="outlined" loading={loading}>Sign-In with Google™</LoadingButton>
        </Box>
    )
}