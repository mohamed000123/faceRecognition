import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import * as faceapi from "face-api.js";
function Faceapi() {
  const [stopVideoStream, setStopVideoStream] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [speech, setSpeech] = useState("");
  // greeting user
  const userGreeting = (userName) => {
    window.responsiveVoice.speak(
      `hello ${userName} how can i assist you today ?`,
      "US English Male"
    );
  };
  // catching record text
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;
  recognition.start();
  recognition.onresult = function (event) {
    console.log("You said: ", event.results[0][0].transcript);
    setSpeech(event.results[0][0].transcript);
  };
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    recognition.stop();
  };

  // faceapi logic
  const videoRef = useRef(null);
  const canvasRef = useRef();
  useEffect(() => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    ]).then(() => {
      if (!stopVideoStream) {
        startWebcam();
      }
    }, []);
  });
  // open webcam
  function startWebcam() {
    if (speech === "hello") {
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
    } else {
      console.log("no speech detected");
    }
  }

  function getLabeledFaceDescriptions() {
    const labels = ["Messi", "Amin"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
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
  const handlePlay = async () => {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
      videoRef.current
    );
    faceapi.matchDimensions(canvasRef.current, {
      width: 750,
      height: 450,
    });
    setInterval(async () => {
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
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result,
        });
        drawBox.draw(canvasRef.current);
        if (result.label !== "unknown") {
          setUserName(result.label);
          setStopVideoStream(true);
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
  useEffect(() => {
    if (stopVideoStream) {
      closeWebcam();
      userGreeting(userName);
    }
  }, [stopVideoStream]);
  // gpt voice chat
  function startVoiceChat() {
    // if (!isMicOpen) {
    recognition.start();
    setIsMicOpen(true);
    recognition.onend = () => {
      setIsMicOpen(false);
      // };
    };
    if (speech) {
      fetch("http://localhost:8000/gpt-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: speech,
        }),
      })
        .then((response) => response.json())
        .then((data) => window.responsiveVoice.speak(data, "US English Male"))
        .catch((error) => console.error("Error:", error));
    }
  }
  function closeVoiceChat() {
    if (isMicOpen) {
      recognition.stop();
      setIsMicOpen(false);
    }
  }
  return (
    <div className="myapp">
      <div className="appvide">
        <video
          crossOrigin="anonymous"
          ref={videoRef}
          autoPlay
          playsInline
          onPlay={handlePlay}
          width="750"
          height="450"
        ></video>
      </div>
      <canvas ref={canvasRef} width="750" height="450" className="appcanvas" />
      {stopVideoStream ? (
        <div>
          <button onClick={startVoiceChat}> open mic</button>
          <button onClick={closeVoiceChat}> close mic</button>
        </div>
      ) : null}
    </div>
  );
}

export default Faceapi;
