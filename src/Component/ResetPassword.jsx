import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ResetPassword.css";
import logo from "../assets/melting-pot-logo.jpeg";
import { useLanguage } from "../translator/Languagecontext";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [gotToken, setGotToken] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleResetRequest = (event) => {
    event.preventDefault();

    fetch(process.env.REACT_APP_API_PATH + "/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then((res) => {
      if (res.ok) {
        setGotToken(true);
      } else {
        alert(t("reset_failed_request"));
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
        alert(t("reset_success"));
        navigate("/");
      } else {
        alert(t("reset_failed_confirm"));
      }
    });
  };

  return (
      <div className="reset-container">
        <div className="reset-box">
          <img src={logo} alt="Melting Pot Logo" className="reset-logo" />
          <h2 className="reset-title">
            {gotToken ? t("enter_new_password") : t("reset_password")}
          </h2>

          {!gotToken ? (
              <form onSubmit={handleResetRequest}>
                <label>{t("email")}</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <button type="submit" className="reset-button">
                  {t("send_reset_link")}
                </button>
              </form>
          ) : (
              <form onSubmit={handleResetPassword}>
                <label>{t("token")}</label>
                <input
                    type="text"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    required
                />
                <label>{t("new_password")}</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button type="submit" className="reset-button">
                  {t("reset_password_button")}
                </button>
              </form>
          )}
        </div>
      </div>
  );
};

export default ResetPassword;
