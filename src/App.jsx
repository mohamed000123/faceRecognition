import Faceapi from "./components/faceapi";
import VoiceChat from "./components/voiceChat";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Faceapi />} />
      <Route path="/VoiceChat" element={<VoiceChat />} />
    </>
  )
);
function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
