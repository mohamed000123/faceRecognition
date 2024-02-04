import React, { useEffect, useRef, useState } from "react";
const VoiceChat = () => {
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
      // };
    };
  }
  function closeVoiceChat() {
    if (isMicOpen) {
      recognition.stop();
      setIsMicOpen(false);
    }
  }
  return (
    <div>
      <button onClick={startVoiceChat}> ask</button>
      {/* <button onClick={closeVoiceChat}> close mic</button> */}
      <h2>{speech}:</h2>
      <p>{gptAnswer}</p>
    </div>
  );
};

export default VoiceChat;
