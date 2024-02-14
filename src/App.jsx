import React from "react";
import Home from "./pages/home";
import DashBoard from "./pages/dashBoard";
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
      <Route path="/admin" element={<DashBoard />} />
    </>
  )
);
function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
