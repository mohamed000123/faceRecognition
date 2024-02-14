import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import * as faceapi from "face-api.js";
import { LinearProgress } from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
function Faceapi({ setIsRecognised, setUserName }) {
  // state
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isFinishedRecognition, setIsFinishedRecognition] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  // mic
  const { transcript } = useSpeechRecognition();
  useEffect(() => {
    console.log("you said:", transcript);
    if (!transcript.includes("hello")) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      setIsLoading(true);
      SpeechRecognition.stopListening();
    }
  }, [transcript]);
  // open webcam
  function startWebcam() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((streamData) => {
        videoRef.current.srcObject = streamData;
      })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(() => {
      setIsVideoStarted(true);
    }, 5000);
  }
  useEffect(() => {
    startWebcam();
  }, []);

  // faceapi logic
  useEffect(() => {
    if (!isFinishedRecognition) {
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]).then(() => {
        if (transcript.includes("hello")) {
          startFaceRecognition();
        }
      });
    } else {
      setTimeout(() => {
        closeWebcam();
        setIsRecognised(true);
      }, [1500]);
    }
  }, [isFinishedRecognition, transcript]);

  function getLabeledFaceDescriptions() {
    const labels = ["Amin", "Gehad", "Messi", "Mostafa Ali", "Mostafa youssef"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(
            require(`../labels/${label}/${i}.jpg`)
          );
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }
  const startFaceRecognition = async () => {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
      videoRef.current
    );
    faceapi.matchDimensions(canvasRef.current, {
      width: 750,
      height: 450,
    });
    const recognitionInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, {
        width: 750,
        height: 450,
      });
      canvasRef.current.getContext("2d").clearRect(0, 0, 940, 650);
      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });
      results.some((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result,
        });
        setIsLoading(false);
        drawBox.draw(canvasRef.current);
        if (result.label !== "unknown") {
          setUserName(result.label);
          setIsFinishedRecognition(true);
          clearInterval(recognitionInterval);
        }
      });
    }, 100);
  };
  // closing webcam
  const closeWebcam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
      videoRef.current.style.display = "none";
      canvasRef.current.style.display = "none";
    }
  };
  return (
    <>
      <div className="sweet-loading">
        <ClipLoader
          color="blue"
          loading={isLoading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      {isVideoStarted && !isLoading && !isFinishedRecognition ? (
        <>
          <LinearProgress
            style={{
              width: "95%",
              margin: "auto",
              marginBottom: "10px",
              height: "15px",
            }}
          />
          <h2 style={{ color: "black" }}>say hello to start</h2>
        </>
      ) : null}
      <div className="myapp">
        <div className="appvide">
          <video
            crossOrigin="anonymous"
            ref={videoRef}
            autoPlay
            playsInline
            width="750"
            height="450"
          ></video>
        </div>
        <canvas
          ref={canvasRef}
          width="750"
          height="450"
          className="appcanvas"
        />
      </div>
    </>
  );
}

export default Faceapi;
