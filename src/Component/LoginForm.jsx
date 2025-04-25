import React, { useEffect, useState } from "react";
import "../App.css";
import "../Login.css";
import meltingLogo from "../assets/melting-pot-logo.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import foodImage from "../food-image.jpeg";
import {useLanguage} from "../translator/Languagecontext";

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const accountCreated = location.state?.accountCreated;

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    setErrorMessage(""); // clear previous error

    if (!email || !password) {
      setErrorMessage("Please fill in both Email Address and Password.");
      return;
    }

    // Manual email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid Email Address.");
      return;
    }

    fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.userID) {
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("user", result.userID);
          setLoggedIn(true);
          setSessionToken(result.token);
          navigate("/");
          window.location.reload();
        } else {
          setErrorMessage("Invalid Email or Password.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Invalid Email Address or Password.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Back Arrow (only visible on mobile) */}
        <div className="back-arrow">&#8592;</div>
        <div className="left-column">
          <img src={meltingLogo} alt="Melting Pot" className="logo-loginn" />
          <h1 className="login-title">{t("welcome_back")}</h1>
          <p className="subtitle">{t("sign_in_instruction")}</p>

          {/* Success Message */}
          {accountCreated && (
            <div className="alert success">Account created successfully! Please log in.</div>
          )}

          {/* Error Message */}
          {errorMessage && <div className="alert error">{errorMessage}</div>}

          <form onSubmit={submitHandler} className="register-form">
          <div className="input-groupp">
            <label htmlFor="email">{t("email_address")}</label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
          </div>

            <div className="input-groupp">
              <label>{t("password")}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                {t("remember_me")}
              </label>
              <Link to="/reset-password" className="forgot-password">
                {t("forgot_password")}
              </Link>
            </div>

            <button type="submit" className="signup-btna">
              {t("log_in")}
            </button>

            <p className="login-text">
              {t("dont_have_account")}{" "}
              <Link to="/register" className="sign-up-link">
                {t("sign_up")}
              </Link>
            </p>
          </form>
        </div>

        {/* Right Column - Desktop Only */}
        <div className="right-column">
          <img src={foodImage} alt="Delicious food" width="1200" height="1800" className="food-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
