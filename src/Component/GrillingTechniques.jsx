import React from "react";
import { Link } from "react-router-dom";
import "../GrillingTechniques.css"; // Update as needed
import grillingPoster from "../assets/grill-chicken-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const GrillingGuide = () => {
  const { t } = useLanguage();

  return (
      <div className="grilling-container">
        <div className="back-link">
          <Link to="/how-to-guides">← {t("backToGuides")}</Link>
        </div>

        <h1 className="title">{t("whyGrillingTitle")}</h1>

        <div className="poster-container">
          <img src={grillingPoster} alt="Grilling Poster" className="poster" />
        </div>

        <div className="info-section">
          <p>{t("whyGrillingText1")}</p>
          <p>{t("whyGrillingText2")}</p>

          <h2>{t("grillingScienceTitle")}</h2>
          <p>{t("grillingScienceDesc")}</p>
          <ul>
            <li>🔥 <strong>{t("directHeat")}</strong>: {t("directHeatDesc")}</li>
            <li>🌡️ <strong>{t("indirectHeat")}</strong>: {t("indirectHeatDesc")}</li>
          </ul>

          <h2>{t("choosingCutTitle")}</h2>
          <p>{t("choosingCutDesc")}</p>
          <ul>
            <li>🥩 {t("cutSteak")}</li>
            <li>🍗 {t("cutChicken")}</li>
            <li>🍔 {t("cutGroundMeat")}</li>
            <li>🐟 {t("cutSeafood")}</li>
          </ul>

          <h2>{t("grillingTipsTitle")}</h2>
          <ul>
            <li>🔥 {t("tipSearing")}</li>
            <li>🌡️ {t("tipThermometer")}</li>
            <li>🛢️ {t("tipOilGrill")}</li>
            <li>🍗 {t("tipRest")}</li>
            <li>🌿 {t("tipWoodChips")}</li>
          </ul>

          <p>{t("grillingFinalNote")}</p>
        </div>
      </div>
  );
};

export default GrillingGuide;
