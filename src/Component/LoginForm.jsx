import React, { useEffect, useState } from "react";
import "../App.css";
import "../Login.css";
import meltingLogo from "../assets/melting-pot-logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import "../RegisterForm.css"; // Using the same styling as RegisterForm
import foodImage from "../food-image.jpeg";

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [sessionToken, setSessionToken] = useState("");
  const [rememberMe, setRememberMe] = useState(false);


  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  const submitHandler = (event) => {
    // event.preventDefault() prevents the browser from performing its default action
    // In this instance, it will prevent the page from reloading
    // keeps the form from actually submitting as well
    event.preventDefault();

    fetch(process.env.REACT_APP_API_PATH + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.userID) {
          // Successfully logged in
          console.log(result);
          // set the auth token and user ID in the session state
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("user", result.userID);
          // call setLoggedIn hook from App.jsx to save the login state throughout the app
          setLoggedIn(true);
          setSessionToken(result.token);
          console.log(sessionToken, " SESSION TOKEN");
          // go to the homepage
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Column - Logo & Form */}
        <div className="left-column">
          <img src={meltingLogo} alt="Melting Pot" className="logo-loginn" />
          <h1 className="title">WELCOME BACK</h1>
          <p className="subtitle">Sign in with your Email address and Password</p>
          <form onSubmit={submitHandler} className="register-form">
            <div className="input-groupp">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-groupp">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Remember me
              </label>
              <Link to="/reset-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="signup-btna">Log In</button>

            <p className="login-text">
              Don’t have an account? <Link to="/register" className="sign-up-link">Sign Up</Link>
            </p>
          </form>
        </div>

        {/* Right Column - Food Image */}
        <div className="right-column">
          <img src={foodImage} alt="Delicious food" className="food-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

