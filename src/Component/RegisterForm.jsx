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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [dietOptions, setDietOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
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

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const errors = [];
    if (!/[a-z]/.test(password)) errors.push("lowercase");
    if (!/[A-Z]/.test(password)) errors.push("uppercase");
    if (!/[0-9]/.test(password)) errors.push("number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("special character");
    if (password.length < 8) errors.push("minimum 8 characters");
    return errors;
  };

  // Phone number formatting to add dashes automatically
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digits
  
    if (value.length > 10) value = value.slice(0, 10); // Limit to 10 digits
  
    let formatted = value;
    if (value.length > 6) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
  
    setPhone(formatted);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setErrorMsg("");  // Reset error message

    // Check if any required fields are empty
    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !country.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    
    if (username.length < 5) {
      setErrorMsg("Username must be at least 5 characters long.");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrorMsg(`Password needs: ${passwordErrors.join(", ")}`);
      return;
    }

    // Check if phone number is valid (e.g., must be at least 10 digits)
    if (phone.replace(/-/g, "").length < 10) {
      setErrorMsg("Phone number must follow the example format. (123-456-7890).");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Proceed with API call if everything is valid
    fetch(process.env.REACT_APP_API_PATH + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.token || !result.userID) {
          throw new Error("Signup failed!");
        }

        return fetch(`${process.env.REACT_APP_API_PATH}/users/${result.userID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.token}`,
          },
          body: JSON.stringify({
            attributes: {
              username,
              fullName,
              email,
              phone,
              password,
              country,
              allergies: allergyOptions,
              dietRegimes: dietOptions,
            },
          }),
        });
      })
      .then((res) => res.json())
      .then(() => {
        navigate("/", { state: { accountCreated: true } });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMsg("Email already exists!");
      });
  };

  return (
    <div className="register-container">
      <div className="content-wrapper">
        <div className="image-container">
          <img src={regPhoto} alt="Food" className="food-image" />
        </div>

        <div className="form-container">
          <div className="back-arrow">&#8592;</div>
          <img src={meltingLogo} alt="Melting" className="logo-login" />
          <h1 className="title">Registration</h1>

          {errorMsg && <div className="alert error">{errorMsg}</div>}

          <form onSubmit={submitHandler} className="register-form">
            <div className="input-row">
              <div className="input-group">
                <label>Full Name (First and Last)</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Email address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label>Allergies</label>
              <div className="option-group">
                {["Peanut", "Gluten", "Dairy", "Shellfish", "Tree nuts", "None"].map((item) => (
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
                {["Kosher", "Halal", "Vegetarian", "Vegan", "Pescitarian", "None"].map((item) => (
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
              Already have an account? <Link to="/">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
