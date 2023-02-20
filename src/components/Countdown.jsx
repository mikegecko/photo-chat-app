import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";

export default function Countdown (props){

    const coundownLength = 5 || props.coundownLength;

    const [timeLeft, setTimeLeft] = useState(coundownLength);
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        }, 1000);
        const timer = setInterval(() => {
            //This is hardcoded and would need to be changed if coutdown length changes
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 2.3));
        }, 125);

        return () => {
            clearInterval(timer);
            clearInterval(intervalId);
        }
    }, [])

    return(
        <Box sx={{display: 'flex', position:'absolute', top: '25px', right: '20px', zIndex: 10}}>
            <CircularProgress variant="determinate" value={progress} />
            <Box sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Typography>
                {timeLeft}
                </Typography>
            </Box>
            
            
        </Box>
    )
}