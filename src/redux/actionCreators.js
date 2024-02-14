import { add_eleven_key } from "./actionTypes";

export function addElevenKey(key) {
  console.log("action", key);
  return async (dispatch) => {
    try {
      dispatch({
        type: add_eleven_key,
        payload: key,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
