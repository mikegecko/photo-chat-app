/** @jsxImportSource @emotion/react */
import { Box } from "@mui/system";
import { useEffect } from "react";
import { css } from '@emotion/react'


export default function StyledImageMessage (props) {

    const senderStyle = {display: 'flex', justifyContent:'center', alignItems: 'center', alignSelf:'flex-end', bgcolor: '#002b5a', flexDirection: 'row', margin: '8px', padding: '0', borderRadius: '.7rem .7rem 0 .7rem'}
    const receiverStyle = {display: 'flex', justifyContent:'center', alignItems: 'center', alignSelf:'flex-start', bgcolor: '#454545', flexDirection: 'row', margin: '8px', padding: '0', borderRadius: '.7rem .7rem .7rem 0'}
    const styleMessage = () => {
        //Message is from user
        if(props.userID === props.message.sender){
            return(senderStyle);
        }
        //Message is from friend
        else{
            return(receiverStyle);
        }
    }
    useEffect(() => {
        //console.log(props.message)
    }, [])
    return(
        <Box key={props.id} sx={() => styleMessage()}>
            <img css={css`
                width: 80%;
                height: 80%;
            `} src={props.message.imageURL} alt={`${props.message.sender}'s pic`} />
        </Box>
    )
}