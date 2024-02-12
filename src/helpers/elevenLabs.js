import axios from "axios";
const voiceId = "21m00Tcm4TlvDq8ikWAM";
const apiKey = "71788341538a69e2a3126529483e3ccc";
const voiceSettings = {
  stability: 0.5,
  similarity_boost: 0.8,
};
export const startStreaming = async (text) => {
  const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
  const headers = {
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  };

  const requestBody = {
    model_id: "eleven_multilingual_v2",
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
