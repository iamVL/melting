import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import meltingLogo from "../assets/melting-pot-logo.jpeg";
import "../RegisterForm.css";
import regPhoto from "../assets/Reg-page-photo.png";

const RegisterForm = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);


  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]); // ✅ Fix: Add 'navigate' to dependency array

  useEffect (() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  const handleAllergyChange = (value) => {
    if (value === "None") {
      setAllergyOptions(["None"]);
    } else {
      const newOptions = allergyOptions.includes(value)
          ? allergyOptions.filter((item) => item !== value)
          : [...allergyOptions.filter((item) => item !== "None"), value];
      setAllergyOptions(newOptions);
    }
  };

  const handleDietChange = (value) => {
    if (value === "None") {
      setDietOptions(["None"]);
    } else {
      const newOptions = dietOptions.includes(value)
          ? dietOptions.filter((item) => item !== value)
          : [...dietOptions.filter((item) => item !== "None"), value];
      setDietOptions(newOptions);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
  
    fetch(process.env.REACT_APP_API_PATH + "/auth/signup", {
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
        if (!result.token || !result.userID) {
          throw new Error("Signup failed!"); // Handle signup failure
        }
  
        return fetch(
          `${process.env.REACT_APP_API_PATH}/users/${result.userID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`,
            },
            body: JSON.stringify({
              attributes: {
                username: username,
                fullName: fullName,
                email: email,
                phone: phone,
                password: password,
                country: country,
                allergies: allergyOptions,
                dietRegimes: dietOptions,
              },
            }),
          }
        );
      })
      .then((res) => res.json())
      .then((profileResult) => {
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Registration or profile setup failed!");
      });
  };

  return (
    <div className="register-container">
      {/* White Layer with Orange Border */}
      <div className="content-wrapper">
        {/* Left Side: Food Image */}
        <div className="image-container">
          <img src={regPhoto} alt="Food" className="food-image" />
        </div>

        {/* Right Side: Registration Form */}
        <div className="form-container">
        <img src={meltingLogo} alt="Melting" className="logo-login" />
          <h1 className="title">Registration</h1>
          <form onSubmit={submitHandler} className="register-form">
            <form onSubmit={submitHandler} className="register-form">
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Username</label>
                  <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Email address</label>
                  <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Password</label>
                  <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Country</label>
                  <input
                      type="text"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input
                      type="password"
                      name="confirmPassword"
                      // Optional: confirmPassword state if you want to validate it later
                  />
                </div>
                <div className="input-group" style={{visibility: "hidden"}}>
                  <label>&nbsp;</label>
                  <input disabled/>
                </div>
              </div>

              {/* Allergy & Diet remain the same */}
              ...
            </form>

            <div className="input-group">
              <label>Allergies</label>
              <div className="option-group">
                {["Peanut", "Gluten", "Dairy", "Shellfish","Tree nuts", "None"].map((item) => (
                    <button
                        type="button"
                        key={item}
                        className={allergyOptions.includes(item) ? "selected" : ""}
                        onClick={() => handleAllergyChange(item)}
                    >
                      {item}
                    </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Diet Regimes</label>
              <div className="option-group">
                {["Kosher", "Halal", "Vegetarian", "Vegan","Pescitarian", "None"].map((item) => (
                    <button
                        type="button"
                        key={item}
                        className={dietOptions.includes(item) ? "selected" : ""}
                        onClick={() => handleDietChange(item)}
                    >
                      {item}
                    </button>
                ))}
              </div>
            </div>


            <button type="submit" className="signup-btn">Sign Up</button>

            <p className="login-text">
              Already have an account? <Link to="/">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;