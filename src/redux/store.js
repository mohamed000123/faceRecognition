import { Reducer } from "./reducer";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
export const store = configureStore({
  reducer: {
    Reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(thunk);
  },
});
