import { Box, height } from "@mui/system";
import { QRCodeSVG } from "qrcode.react";

export default function QRcode(props){

    return(
        <Box className='' sx={{display:'flex', height: '100%', alignItems:'center', justifyContent:'center', padding:'18px'}}>
            <Box className='box' sx={{padding: '25px'}}>
        <QRCodeSVG value={props.userID} size={props.width*0.8} />
            </Box>
        </Box>
        )
}