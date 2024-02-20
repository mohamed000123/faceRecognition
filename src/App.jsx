import React from "react";
import Home from "./pages/home";
// routing
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
    </>
  )
);
function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
