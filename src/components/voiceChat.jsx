import React, { useEffect, useLayoutEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { startStreaming } from "../helpers/audioStream";
const VoiceChat = ({ userName }) => {
  // greeting user
  const userGreeting = async () => {
    await startStreaming(`hello ${userName}, how can i assist you today`);
    setStart(true);
    setTimeout(() => {
      startVoiceChat();
    }, 3000);
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
    setInterval(() => {
      startVoiceChat();
    }, 25000);
  }, []);
  return (
    <div>
      {!start && (
        <button
          onClick={() => {
            userGreeting("momo");
          }}
        >
          say hello
        </button>
      )}
      {isMicOpen && start ? (
        <LinearProgress
          style={{
            width: "95%",
            margin: "auto",
            marginBottom: "10px",
            height: "15px",
          }}
        />
      ) : null}
      {start ? (
        <>
          <h2>{speech}:</h2>
          <p>{gptAnswer}</p>
        </>
      ) : null}
    </div>
  );
};

export default VoiceChat;
