import axios from "axios";
const voiceSettings = {
  stability: 1,
  similarity_boost: 1,
};

export const startStreaming = async (text, key, gender) => {
  let voiceId;
  if (gender === "male") {
    voiceId = "5Q0t7uMcjvnagumLfvZi";
  } else if (gender === "female") {
    voiceId = "EXAVITQu4vr4xnSDxMaL";
  }
  const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
  const headers = {
    "Content-Type": "application/json",
    "xi-api-key": key,
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
      return audio;
    } else {
      console.log("Error: Unable to stream audio.");
    }
  } catch (error) {
    console.log("Error: Unable to stream audio.");
  }
};
