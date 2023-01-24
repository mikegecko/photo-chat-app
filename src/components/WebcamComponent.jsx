import Webcam from "react-webcam";


export default function WebcamComponent (props) {


    return(
        <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={props.cameraRef}
        >
            
        </Webcam>
    )
}