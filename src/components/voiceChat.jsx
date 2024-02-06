import React, { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
const VoiceChat = ({ userName }) => {
  // greeting user
  const userGreeting = (userName) => {
    window.responsiveVoice.speak(
      `hello ${userName} how can i assist you today ?`,
      "US English Female"
    );
  };
  useEffect(() => {
    userGreeting(userName);
  }, []);
  // gpt voice chat
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [speech, setSpeech] = useState("");
  const [gptAnswer, setGptAnswer] = useState("");
  let recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;
  function startVoiceChat() {
    console.log("startVoiceChat");
    // if (!isMicOpen) {
    recognition.start();
    setIsMicOpen(true);
    recognition.onresult = function (event) {
      console.log("You said: ", event.results[0][0].transcript);
      setSpeech(event.results[0][0].transcript);
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
        .then((data) => {
          window.responsiveVoice.speak(data, "US English Male");
          setGptAnswer(data);
        })
        .catch((error) => console.error("Error:", error));
    };
    recognition.onend = () => {
      setIsMicOpen(false);
    };
  }
  return (
    <div>
      {isMicOpen ? (
        <LinearProgress
          style={{
            width: "95%",
            margin: "auto",
            marginBottom: "10px",
            height: "15px",
          }}
        />
      ) : null}
      <button onClick={startVoiceChat}> ask</button>
      <h2>{speech}:</h2>
      <p>{gptAnswer}</p>
    </div>
  );
};

export default VoiceChat;
