import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const DashBoard = () => {
  const [elevenKey, setElevenKey] = useState("");
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    localStorage.setItem("gender", event.target.value);
  };

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
          localStorage.setItem("elevenKey", elevenKey);
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
      <div style={{ marginTop: "70px" }}>
        <label htmlFor="dropdown" style={{ marginRight: "10px" }}>
          choose reader gender
        </label>
        <select
          id="dropdown"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="male">male</option>
          <option value="female">female</option>
        </select>

        {selectedOption && <p>You selected: {selectedOption}</p>}
      </div>
      <button
        onClick={() => {
          navigate("/");
        }}
        style={{
          padding: "7px",
          marginLeft: "15px",
          marginTop: "30px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        done
      </button>
    </>
  );
};

export default DashBoard;
