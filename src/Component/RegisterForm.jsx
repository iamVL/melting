import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../RegisterForm.css"; // ✅ CORRECT

const RegisterForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]); // ✅ Fix: Add 'navigate' to dependency array

  useEffect (() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);
  
  const submitHandler = (event) => {
    event.preventDefault();
    fetch(process.env.REACT_APP_API_PATH + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, phone, fullName, country, username }),
    })
      .then((res) => res.json())
      .then((result) => {
        navigate("/");
        window.location.reload();
      });
  };

  return (
    <div className="register-container">
      {/* White Layer with Orange Border */}
      <div className="content-wrapper">
        {/* Left Side: Food Image */}
        <div className="image-container">
          <img src="/Reg-page-photo.png" alt="Food" className="food-image" />
        </div>

        {/* Right Side: Registration Form */}
        <div className="form-container">
        <img src="/melting-pot-logo.jpeg" alt="Melting" className="logo-login" />
          <h1 className="title">Registration</h1>
          <form onSubmit={submitHandler} className="register-form">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" required />
            </div>

            <button type="submit" className="signup-btn">Sign Up</button>

            <p className="login-text">
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
