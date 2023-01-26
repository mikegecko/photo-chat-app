import { LoadingButton } from "@mui/lab";
import { createTheme, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";


export default function Login ({loading, hidden, loginHandler}) {
    const theme = createTheme({
        status: {
            danger: '#e53e3e',
        },
        palette: {
            primary: {
                main: '#3e9dfc',
                darker: '#1f1f1f',
              },
              neutral: {
                main: '#64748B',
                contrastText: '#fff',
              },
        }
    })
    if(hidden){
        return(<></>);
    }
    return(
        <ThemeProvider theme={theme}>
        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', position:'absolute', width: '100%', height: '100%', background:'linear-gradient(180deg, rgba(31,31,31,1) 9%, rgba(0,73,147,1) 52%, rgba(65,0,121,1) 100%)', zIndex:10}}>
            <Box sx={{padding:'3rem', color:'white', fontWeight:'bold',fontSize:64}}>PicFlo</Box>
            <LoadingButton color="primary" onClick={loginHandler} variant="outlined" loading={loading}>Sign-In with Google™</LoadingButton>
        </Box>
        </ThemeProvider>
        
    )
}