import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { startStreaming } from "../helpers/elevenLabs";
import "../App.css";
import ClipLoader from "react-spinners/ClipLoader";
const VoiceChat = ({ userName }) => {
  let userJob;
  if (userName === "Amin" || userName === "Mostafa youssef") {
    userJob = "مطور برمجيات";
  } else if (userName === "Mostafa Ali" || userName === "Gehad") {
    userJob = "مطور اعمال";
  } else {
    userJob = "مطور برمجيات";
    userName = "محمد";
  }
  // greeting user
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState("");
  const userGreeting = async () => {
    setIsApproved(true);
    setIsLoading(true);
    fetch("http://localhost:8000/user-greeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        userJob: userJob,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        const audio = await startStreaming(data);
        await audio.play();
        audio.addEventListener("timeupdate", () => {
          console.log("playing");
          setIsPlayingAudio(true);
        });
        audio.addEventListener("ended", () => {
          console.log("done playing");
          setIsPlayingAudio(false);
        });
        setIsLoading(false);
        setGptAnswer(data);
        setStart(true);
        setTimeout(() => {
          setCount(5);
          setTimeout(() => {
            startVoiceChat();
          }, 5000);
        }, 5000);
      })
      .catch((error) => console.error("Error:", error));
  };
  // gpt voice chat
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [speech, setSpeech] = useState("");
  const [gptAnswer, setGptAnswer] = useState("");
  const [start, setStart] = useState(false);
  function startVoiceChat() {
    let recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();
    recognition.lang = "ar-EG";
    recognition.start();
    recognition.onstart = () => {
      console.log("voice is on");
      setIsMicOpen(true);
    };
    recognition.onresult = function (event) {
      console.log("You said: ", event.results[0][0].transcript);
      setSpeech(event.results[0][0].transcript);
      setIsLoading(true);
      setIsPlayingAudio(true);
      fetch("http://localhost:8000/gpt-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: event.results[0][0].transcript,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const audio = await startStreaming(data);
          await audio.play();
          audio.addEventListener("ended", () => {
            console.log("done playing");
            setIsPlayingAudio(false);
          });
          setGptAnswer(data);
          setIsLoading(false);
        })
        .catch((error) => console.error("Error:", error));
    };
    recognition.onend = () => {
      console.log("mic is closed");
      setIsMicOpen(false);
    };
  }
  useEffect(() => {
    if (start) {
      setInterval(() => {
        if (!isLoading && !isPlayingAudio) {
          setTimeout(() => {
            setCount(5);
            setTimeout(() => {
              startVoiceChat();
            }, 5000);
          }, 5000);
        }
      }, 20000);
    }
  }, [start]);
  // Countdown
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [count]);
  return (
    <>
      {!isApproved && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Please give us permission to access mic</h2>
            <button style={{ cursor: "pointer" }} onClick={userGreeting}>
              <p>Grant Permission</p>
            </button>
          </div>
        </div>
      )}
      {isApproved && (
        <div className="video-background">
          <video autoPlay loop muted>
            <source src={require("../assets/video.mp4")} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="content">
            <div className="sweet-loading">
              <ClipLoader
                color="blue"
                loading={isLoading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
            {start && (
              <>
                <div className="text">
                  <h2 style={{ color: "white" }}>{speech}:</h2>
                  <h3 style={{ color: "white" }}>{gptAnswer}</h3>
                </div>
              </>
            )}
            <div>
              {count !== 0 ? (
                <h1 style={{ color: "white" }}>Countdown: {count}</h1>
              ) : null}
            </div>
            {isMicOpen && start && !isPlayingAudio ? (
              <>
                <div className="mic">
                  <img
                    src={require("../assets/mic.png")}
                    width="100"
                    height="100%"
                  ></img>
                  <div>
                    <h1 style={{ color: "white" }}>يمكنك التحدث الان</h1>
                    <LinearProgress
                      style={{
                        width: "100%",
                        height: "15px",
                      }}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceChat;
