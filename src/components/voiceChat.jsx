import React, { useEffect, useLayoutEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { startStreaming } from "../helpers/elevenLabs";
import "../App.css";
const VoiceChat = ({ userName }) => {
  let userJob;
  if (
    userName === "Amin" ||
    userName === "Mohsen" ||
    userName === "Mostafa youssef"
  ) {
    userJob = "developer";
  } else if (userName === "Mostafa Ali" || userName === "Gehad") {
    userJob = "business developer";
  } else {
    userJob = "مبرمج";
    userName = "محمد";
  }
  // greeting user
  const userGreeting = async () => {
    setStart(true);
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
        setTimeout(() => {
          startVoiceChat();
        }, 4000);
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
        startVoiceChat();
      }, 20000);
    }
  }, [start]);
  return (
    <div>
      {!start && (
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
            <h2>Question:{speech}</h2>
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
              <h2>you can speak now</h2>
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
