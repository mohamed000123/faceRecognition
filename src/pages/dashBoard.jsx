import React, { useState } from "react";
const DashBoard = () => {
  const [elevenKey, setElevenKey] = useState("");
  return (
    <>
      <h1>dash board</h1>
      <input
        onChange={(e) => {
          setElevenKey(e.target.value);
        }}
        placeholder="Enter key "
        style={{ height: "30px" }}
      ></input>
      <button
        onClick={() => {
          console.log(elevenKey);
        }}
        style={{
          padding: "7px",
          marginLeft: "15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        add new speech key
      </button>
    </>
  );
};

export default DashBoard;
