import React from "react";
import "./AboutUs.css";
import { Link } from "react-router-dom";
import { useLanguage } from "./translator/Languagecontext";

const AboutUs = () => {
  const { t } = useLanguage();

  return (
      <div className="about-page">
        <header className="header-section">
          <h1>{t("about_title")}</h1>
          <p>{t("about_intro")}</p>
        </header>

        <section className="content-section">
          <h2>{t("about_mission_title")}</h2>
          <p>{t("about_mission_text")}</p>

          <h2>{t("about_vision_title")}</h2>
          <p>{t("about_vision_text")}</p>

          <h2>{t("about_features_title")}</h2>
          <ul>
            <li><strong>{t("about_feature_1")}</strong></li>
            <li><strong>{t("about_feature_2")}</strong></li>
            <li><strong>{t("about_feature_3")}</strong></li>
            <li><strong>{t("about_feature_4")}</strong></li>
          </ul>

          <h2>{t("about_meet_team")}</h2>
          <ul>
            <p style={{ margin: "5px" }}><Link to="/about_rudy">Rudy Karthick</Link></p>
            <p style={{ margin: "5px" }}><Link to="/about_yessica">Quinonez Yessica</Link></p>
            <p style={{ margin: "5px" }}><Link to="/about_joshua">Joshua Castillo</Link></p>
            <p style={{ margin: "5px" }}><Link to="/about_justin">Justin Nguyen</Link></p>
            <p style={{ margin: "5px" }}><Link to="/about_vi">Vaishnavi Lokhande</Link></p>
          </ul>
        </section>

        {sessionStorage.getItem("token") && (
            <section className="contact">
              <h2>{t("about_contact_title")}</h2>
              <p style={{ color: "white" }}>
                {t("about_contact_text")}{" "}
                <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
              </p>
            </section>
        )}
      </div>
  );
};

export default AboutUs;
