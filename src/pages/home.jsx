import React, { useEffect, useState } from "react";
import Faceapi from "../components/faceapi";
import VoiceChat from "../components/voiceChat";

const Home = () => {
  const [isRecognised, setIsRecognised] = useState(false);
  const [userName, setUserName] = useState("");
  if (isRecognised) {
    return <VoiceChat userName={userName} />;
  } else {
    return (
      <Faceapi setIsRecognised={setIsRecognised} setUserName={setUserName} />
    );
  }
};
export default Home;
