import React, { useEffect, useState } from "react";
import Faceapi from "../components/faceapi";
import VoiceChat from "../components/voiceChat";

const Home = () => {
  const [isRecognised, setIsRecognised] = useState(false);
  const [user, setUser] = useState("");
  if (isRecognised) {
    return <VoiceChat user={user} />;
  } else {
    return <Faceapi setIsRecognised={setIsRecognised} setUser={setUser} />;
  }
};
export default Home;
