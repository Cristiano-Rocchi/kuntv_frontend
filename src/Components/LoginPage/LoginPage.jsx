import React, { useState, useRef } from "react";
import "./LoginPage.scss";
import BackImgLogin from "../../Assets/LoginPage/Img/back-img-login.jpg";
import VideoFile from "../../Assets/LoginPage/Vid/prova.mp4";

const LoginPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef(null);

  // Gestisce il clic fuori dal form
  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setInputValue(""); // Resetta il testo digitato
      setIsFocused(false); // Rimuove lo stato attivo del form
    }
  };

  // listener per i click globali
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`login-page position-relative ${isFocused ? "active" : ""}`}
    >
      <div
        className={`background-login ${isFocused ? "active" : ""}`}
        style={{
          backgroundImage: `url(${BackImgLogin})`,
        }}
      ></div>
      {/* Nuovo div per la 'I' */}
      <div className={`tv-icon ${isFocused ? "form-active" : ""}`}>
        <span>INFO</span>
        <video
          className="hover-video"
          src={VideoFile} // Sostituisci con il percorso del tuo video
          muted
          loop
          autoPlay
          playsInline
        ></video>
      </div>

      <div className="form-secret" ref={formRef}>
        <form>
          <input
            className="input-box"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <span className="placeholder-text">Enter a secret</span>
        </form>
      </div>
      <div className="wrapper-button">
        {" "}
        <button
          className={`submit-button-login ${inputValue ? "show" : ""}`}
          type="button"
        >
          Invia
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
