/** @jsxImportSource @emotion/react */
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { css } from '@emotion/react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ButtonBase, Typography } from "@mui/material";

export default function StyledImageMessage (props) {
    const [view, setView] = useState(false);
    const senderStyle = { display: 'flex', justifyContent:'center', alignItems: 'center', alignSelf:'flex-end', bgcolor: '#002b5a', flexDirection: 'row', margin: '8px', padding: '4px', borderRadius: '.7rem .7rem 0 .7rem'}
    const receiverStyle = {display: 'flex', justifyContent:'center', alignItems: 'center', alignSelf:'flex-start', bgcolor: '#454545', flexDirection: 'row', margin: '8px', padding: '4px', borderRadius: '.7rem .7rem .7rem 0'}
    const viewStyle = { display: 'flex', gap: '1rem', justifyContent:'center', alignItems: 'center', alignSelf:'flex-end', bgcolor: '#002b5a', flexDirection: 'row', margin: '8px', padding: '.5rem 1rem .5rem 1rem', borderRadius: '.7rem .7rem 0 .7rem'}

    const styleMessage = () => {
        //Message is from user
        if(props.userID === props.message.sender){
            //return(senderStyle);
            return(viewStyle);
        }
        //Message is from friend
        else{
            return(receiverStyle);
        }
    }
    const viewContent = () => {
        if(!view){
            return(
                <>
                    <VisibilityIcon />
                    <Typography>
                        Press to View
                    </Typography>
                </>
            )
        }else{
            return(
                <>
                    <VisibilityOutlinedIcon />
                    <Typography>
                        Viewed
                    </Typography>
                </>
            )
        }
    }
    const viewEvent = e => {
        setView(!view);
    }
    useEffect(() => {
        //console.log(props.message)
        //setView(true);
    }, [])

    if(true){
        return(
            
            <Box key={props.id} sx={() => styleMessage()}>
                <ButtonBase onClick={viewEvent} sx={() => styleMessage()}>
                {/* {view ? <VisibilityIcon /> : <VisibilityOutlinedIcon />}
                {view ? 'Press To View' : 'Viewed'} */}
                {viewContent()}
                </ButtonBase>
            </Box>
            
        )
    }

    return(
        <Box key={props.id} sx={() => styleMessage()}>
            <img css={css`
                max-width: 100%;
                max-height: 100%;
                border-radius: .7rem
            `} src={props.message.imageURL} alt={`${props.message.sender}'s pic`} />
        </Box>
    )
}