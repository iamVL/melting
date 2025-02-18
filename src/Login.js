// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock authentication (Replace with actual API call)
    if (email === "user@example.com" && password === "password") {
      sessionStorage.setItem("token", "mockToken");
      sessionStorage.setItem("user", email);
      setLoggedIn(true);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src={require("./melting-pot-logo.jpeg")} alt="Melting Pot Cooking" />
        </div>
        <h2>WELCOME BACK</h2>
        <p>Sign in with your Email address and Password</p>
        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            <a href="/reset-password" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit">Log In</button>
        </form>
        <p>Don’t have an account? <a href="/register" className="sign-up">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;