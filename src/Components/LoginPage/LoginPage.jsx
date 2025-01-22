import React, { useState } from "react";
import "./LoginPage.css";
import BackImgLogin from "../../Assets/LoginPage/Img/back-img-login.jpg";

const LoginPage = () => {
  const [isFocused, setIsFocused] = useState(false);

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
      <div className="form-secret">
        <form>
          <input
            className="input-box"
            type="text"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <span className="placeholder-text">Enter a secret</span>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
