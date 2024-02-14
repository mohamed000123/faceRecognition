import { add_eleven_key } from "./actionTypes";
const initialState = {
  elevenKey: "",
};
export const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case add_eleven_key:
      console.log(action.payload, "reducer");
      return { ...state, elevenKey: action.payload };
    default:
      return state;
  }
};
