import { Box } from "@mui/system";
import QrScanner from "qr-scanner";
import { useEffect, useRef } from "react";

export default function QRScan (props) {
    const vidRef = useRef();
    const qrScanner = new QrScanner(vidRef.current, result => console.log(result),{preferredCamera: 'environment',returnDetailedScanResult: true});

    const scanErrorHandler = (err) => {

    }

    

    useEffect(() => {
        qrScanner.start();
        return () => {
            qrScanner.stop();
        }
    }, [])

    return(
        <Box>
            <video ref={vidRef}></video>
        </Box>
    )
}