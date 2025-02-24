import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import MyNavbar from "./Components/Navbar/MyNavbar";
import Home from "./Components/Home/Home";
import TvSeries from "./Components/TvSeries/TvSeries";
import Admin from "./Components/Admin/Admin";
import EditVideo from "./Components/EditVideo/EditVideo";
import SectionDetail from "./Components/SectionDetail/SectionDetail";
import VideoPlayer from "./Components/Player/VideoPlayer";

const App = () => {
  const location = useLocation();

  return (
    <>
      {/* Mostra la navbar solo se non ci troviamo nel percorso "/" */}
      {location.pathname !== "/" && location.pathname !== "/editvideo" && (
        <MyNavbar />
      )}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:nomeSezione" element={<SectionDetail />} />

        <Route path="/tvseries" element={<TvSeries />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/editvideo" element={<EditVideo />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
      </Routes>
    </>
  );
};

export default function MainApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
