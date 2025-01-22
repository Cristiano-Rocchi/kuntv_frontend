import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import Home from "./Components/Home/Home";

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </>
    </BrowserRouter>
  );
};

export default App;
