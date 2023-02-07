import { Box } from "@mui/system";


export default function StyledMessage (props) {

    const senderStyle = {}
    const receiverStyle = {
  
    }
    const styleMessage = () => {
  
    }

    return(
        <Box key={props.id} sx={{display: 'flex', justifyContent:'flex-start', alignSelf:'flex-end', bgcolor: '#454545', flexDirection: 'row', margin: '8px', padding: '1rem', borderRadius: '.7rem .7rem 0 .7rem'}}>
            {props.message.content}
        </Box>
    )
}