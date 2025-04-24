import React, { useEffect, useState } from "react";
import "../App.css";
import "../Login.css";
import meltingLogo from "../assets/melting-pot-logo.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import foodImage from "../food-image.jpeg";

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionToken, setSessionToken] = useState("");

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


        {/* Left Column - Form */}
        <div className="left-column">
          <img src={meltingLogo} alt="Melting Pot" className="logo-loginn" />
          <h1 className="login-title">WELCOME BACK</h1>
          <p className="subtitle">Sign in with your Email Address and Password</p>

          {/* Success Message */}
          {accountCreated && (
            <div className="alert success">Account created successfully! Please log in.</div>
          )}

          {/* Error Message */}
          {errorMessage && <div className="alert error">{errorMessage}</div>}

          <form onSubmit={submitHandler} className="register-form">
          <div className="input-groupp">
            <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
          </div>

            <div className="input-groupp">
              <label>Password</label>
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
                Remember me
              </label>
              <Link to="/reset-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="signup-btna">
              Log In
            </button>

            <p className="login-text">
              Don’t have an account?{" "}
              <Link to="/register" className="sign-up-link">
                Sign Up
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
