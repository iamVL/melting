import React, { useEffect, useState } from "react";
import "../App.css";
import "../Login.css";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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
        <div className="logo">
          <img src={require("../melting-pot-logo.jpeg")} alt="Melting Pot Cooking" />
        </div>
        <h2>WELCOME BACK</h2>
        <p>Sign in with your Email address and Password</p>
        <form onSubmit={submitHandler}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
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
          <button type="submit">Log In</button>
        </form>
        <p>Don’t have an account? <Link to="/register" className="sign-up">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default LoginForm;

