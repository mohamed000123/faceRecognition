import axios from "axios";
const voiceId = "21m00Tcm4TlvDq8ikWAM";
const apiKey = "9532a0dae61cbafca59e683ae592feec";
const voiceSettings = {
  stability: 0,
  similarity_boost: 0,
};
export const startStreaming = async (text) => {
  const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
  const headers = {
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  };

  const requestBody = {
    text,
    voice_settings: voiceSettings,
  };

  try {
    const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
      headers,
      responseType: "blob",
    });

    if (response.status === 200) {
      const audio = new Audio(URL.createObjectURL(response.data));
      audio.play();
    } else {
      console.log("Error: Unable to stream audio.");
    }
  } catch (error) {
    console.log("Error: Unable to stream audio.");
  }
};
