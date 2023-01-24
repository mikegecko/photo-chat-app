import Webcam from "react-webcam";


export default function WebcamComponent (props) {
    const videoConstraints = {
        facingMode: props.facingMode ? props.facingMode : 'user',
    };

    return(
        <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={props.cameraRef}
            videoConstraints={videoConstraints}
        >
            
        </Webcam>
    )
}