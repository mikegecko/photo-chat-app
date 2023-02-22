import { Box } from "@mui/system";


export default function StyledMessage (props) {

    const senderStyle = {display: 'flex', justifyContent:'flex-start', alignSelf:'flex-end', flexDirection: 'row', margin: '8px', padding: '1rem', borderRadius: '.7rem .7rem 0 .7rem'}
    const receiverStyle = {display: 'flex', justifyContent:'flex-start', alignSelf:'flex-start', flexDirection: 'row', margin: '8px', padding: '1rem', borderRadius: '.7rem .7rem .7rem 0'}
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

    return(
        <Box key={props.id} sx={() => styleMessage()} bgcolor={props.userID === props.message.sender ? 'message.main' : 'messageR.main'} >
            {props.message.content}
        </Box>
    )
}