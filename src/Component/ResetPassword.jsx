import React, { useState } from "react";
import "../ResetPassword.css";
import logo from "../melting-pot-logo.jpeg";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [gotToken, setGotToken] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const handleResetRequest = (event) => {
    event.preventDefault();

    fetch(process.env.REACT_APP_API_PATH + "/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then((res) => {
      if (res.ok) {
        setGotToken(true); // Switch to jtoken input form
      }
    });
  };

  const handleResetPassword = (event) => {
    event.preventDefault();

    fetch(process.env.REACT_APP_API_PATH + "/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }).then((res) => {
      if (res.ok) {
        alert("Password successfully reset!");
        window.location.href = "/"; // Redirect to login
      }
    });
  };

  return (
      <div className="reset-container">
        <div className="reset-box">
          <img src={logo} alt="Melting Pot Logo" className="reset-logo" />
          <h2 className="reset-title">
            {gotToken ? "Enter Your New Password" : "Reset Your Password"}
          </h2>

          {!gotToken ? (
              <form onSubmit={handleResetRequest}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <button type="submit" className="reset-button">
                  Send Reset Link
                </button>
              </form>
          ) : (
              <form onSubmit={handleResetPassword}>
                <label>Token</label>
                <input
                    type="text"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    required
                />
                <label>New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button type="submit" className="reset-button">
                  Reset Password
                </button>
              </form>
          )}
        </div>
      </div>
  );
};

export default ResetPassword;
