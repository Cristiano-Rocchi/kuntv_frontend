import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import MyNavbar from "./Components/Navbar/MyNavbar";
import Home from "./Components/Home/Home";

const App = () => {
  const location = useLocation();

  return (
    <>
      {/* Mostra la navbar solo se non ci troviamo nel percorso "/" */}
      {location.pathname !== "/" && <MyNavbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
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
