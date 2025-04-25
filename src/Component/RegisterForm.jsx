import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import meltingLogo from "../assets/melting-pot-logo.jpeg";
import "../RegisterForm.css";
import regPhoto from "../assets/Reg-page-photo.png";
import { useLanguage } from "../translator/Languagecontext";

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
  const { t } = useLanguage();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const errors = [];
    if (!/[a-z]/.test(password)) errors.push("lowercase");
    if (!/[A-Z]/.test(password)) errors.push("uppercase");
    if (!/[0-9]/.test(password)) errors.push("number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("special character");
    if (password.length < 8) errors.push("minimum 8 characters");
    return errors;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
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
    setErrorMsg("");

    if (!fullName || !username || !email || !phone || !country || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (username.length < 5) {
      setErrorMsg("Username must be at least 5 characters long.");
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrorMsg(`Password must include: ${passwordErrors.join(", ")}`);
      return;
    }

    if (phone.replace(/-/g, "").length < 10) {
      setErrorMsg("Phone number must be 10 digits long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    fetch(process.env.REACT_APP_API_PATH + "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
        .then((res) => res.json())
        .then((result) => {
          if (!result.token || !result.userID) throw new Error("Signup failed!");

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
        .catch((err) => {
          console.error("Signup error:", err);
          setErrorMsg("Email already exists!");
        });
  };

  return (
      <div className="register-container">
        <div className="content-wrapper">
          <div className="image-container">
            <img src={regPhoto} alt="Delicious food spread" className="food-image" />
          </div>

          <div className="form-container">
            <img src={meltingLogo} alt="Melting Pot Logo" className="logo-login" />
            <h1 className="titles">{t("registration")}</h1>

            {errorMsg && (
                <div className="input-error-text">
                  <span role="img" aria-label="warning">⚠️</span> {errorMsg}
                </div>

            )}

            <form onSubmit={submitHandler} className="register-forms">
              <div className="input-rows">
                <div className="input-groups">
                  <label htmlFor="fullName">{t("full_name")}</label>
                  <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                </div>

                <div className="input-groups">
                  <label htmlFor="username">{t("username")}</label>
                  <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
              </div>

              <div className="input-rows">
                <div className="input-groups">
                  <label htmlFor="email">{t("email_address")}</label>
                  <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="input-groups">
                  <label htmlFor="phone">{t("phone_number")}</label>
                  <input id="phone" type="tel" value={phone} onChange={handlePhoneChange}/>
                </div>
              </div>

              <div className="input-rows">
                <div className="input-groups">
                  <label htmlFor="password">{t("password")}</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="input-groups">
                  <label htmlFor="country">{t("country")}</label>
                  <input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)}/>
                </div>
              </div>

              <div className="input-rows">
                <div className="input-groups">
                  <label htmlFor="confirmPassword">{t("confirm_password")}</label>
                  <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-groups">
                <label>{t("diet_regimes")}</label>
                <div className="auto-selected-text">*{t("auto_selected_filter")}</div>
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


              <div className="input-groups">
                <label>{t("allergies")}</label>
                <div className="auto-selected-text">*{t("auto_selected_filter")}</div>
                <div className="option-group">
                  {["Peanuts", "Gluten", "Dairy", "Shellfish", "TreeNuts", "Eggs", "None"].map((item) => (
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


              <button type="submit" className="signup-btn" aria-label="Sign up">
                {t("sign_up")}
              </button>

              <p className="login-text">
                {t("already_have_account")} <Link to="/login">{t("log_in")}</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
};

export default RegisterForm;
