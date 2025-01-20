import React from "react";
import "./LoginPage.css";
import BackImgLogin from "../../Assets/LoginPage/Img/back-img-login.jpg";

const LoginPage = () => {
  return (
    <>
      <div className="login-page position-relative">
        <div
          className="background-login"
          style={{
            backgroundImage: `url(${BackImgLogin})`,
          }}
        ></div>
        <div className=" form-secret  ">
          <form>
            <input type="text" placeholder="Enter a secret" />
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
