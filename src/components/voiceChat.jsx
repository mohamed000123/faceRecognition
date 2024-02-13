import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { startStreaming } from "../helpers/elevenLabs";
import "../App.css";
import ClipLoader from "react-spinners/ClipLoader";
const VoiceChat = ({ userName }) => {
  let userJob;
  if (
    userName === "Amin" ||
    userName === "Mohsen" ||
    userName === "Mostafa youssef"
  ) {
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
        await startStreaming(data);
        setIsLoading(false);
        setGptAnswer(data);
        setStart(true);
        setTimeout(() => {
          startVoiceChat();
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
          await startStreaming(data);
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
        if (!isLoading) {
          startVoiceChat();
        }
      }, 20000);
    }
  }, [start]);
  return (
    <div>
      <div className="sweet-loading">
        <ClipLoader
          color="blue"
          loading={isLoading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      {!isApproved && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Please give us permission to access mic </h2>
            <button style={{ cursor: "pointer" }} onClick={userGreeting}>
              <p>Grant Permission</p>
            </button>
          </div>
        </div>
      )}
      {start && (
        <>
          <div className="text">
            <h2>{speech}:</h2>
            <p>{gptAnswer}</p>
          </div>
        </>
      )}
      {isMicOpen && start ? (
        <>
          <div className="mic">
            <img
              src={require("../assets/mic.png")}
              width="100"
              height="100%"
            ></img>
            <div>
              <h1>you can speak now</h1>
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
  );
};

export default VoiceChat;
