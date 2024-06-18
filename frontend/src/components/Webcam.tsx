// WebcamCapture.jsx
import React, { useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";

const WebcamCapture = ({ onCapture, onClose }) => {
    const webcamRef = useRef(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        onCapture(imageSrc);
        onClose();
    };

    return (
        <div className="webcam-container">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
            />
            <div style={{display: "flex"}}>
                <Button className="bg-[#607523] mt-2" style={{width: "10vh"}} onClick={capture}>Capture</Button>
                <p style={{marginRight: "10px"}}></p>
                <Button className="bg-[#000000] mt-2 border border-[#000000] hover:bg-[#ffffff] hover:text-[#000000]" style={{width: "10vh"}} onClick={onClose}>Close</Button>
            </div>
        </div>
    );
};

export default WebcamCapture;
