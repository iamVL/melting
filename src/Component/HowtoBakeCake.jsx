import React from "react";
import { Link } from "react-router-dom";
import "../HowtoBakeCake.css";
import cakePoster from "../assets/bake-cake-recipe.png";
import { useLanguage } from "../translator/Languagecontext"; // ✅ Import translation hook

const BakingCake = () => {
  const { t } = useLanguage();

  return (
      <div className="cake-container">
        <div className="back-link">
          <Link to="/how-to-guides">← {t("backToGuides")}</Link>
        </div>
        <h1 className="title">{t("bakeCakeTitle")}</h1>

        <div className="poster-container">
          <img src={cakePoster} alt="Baking Cake Poster" className="poster" />
        </div>

        <div className="info-section">
          <h2>{t("whyBakeCakeTitle")}</h2>
          <p>{t("whyBakeCakeLine1")}</p>
          <p>{t("whyBakeCakeLine2")}</p>
          <p>{t("whyBakeCakeLine3")}</p>

          <h2>{t("ingredientsTitle")}</h2>
          <ul>
            <li>{t("ingredient1")}</li>
            <li>{t("ingredient2")}</li>
            <li>{t("ingredient3")}</li>
            <li>{t("ingredient4")}</li>
            <li>{t("ingredient5")}</li>
            <li>{t("ingredient6")}</li>
            <li>{t("ingredient7")}</li>
            <li>{t("ingredient8")}</li>
            <li>{t("ingredient9")}</li>
            <li>{t("ingredient10")}</li>
          </ul>

          <h2>{t("stepsTitle")}</h2>
          <ul>
            <li>🍚 <strong>{t("step1Title")}</strong> – {t("step1Desc")}</li>
            <li>🥣 <strong>{t("step2Title")}</strong> – {t("step2Desc")}</li>
            <li>🥄 <strong>{t("step3Title")}</strong> – {t("step3Desc")}</li>
            <li>🪣 <strong>{t("step4Title")}</strong> – {t("step4Desc")}</li>
            <li>🔥 <strong>{t("step5Title")}</strong> – {t("step5Desc")}</li>
            <li>🍰 <strong>{t("step6Title")}</strong> – {t("step6Desc")}</li>
            <li>🎂 <strong>{t("step7Title")}</strong> – {t("step7Desc")}</li>
          </ul>

          <h2>{t("tipsTitle")}</h2>
          <ul>
            <li>🧈 {t("tip1")}</li>
            <li>🥄 {t("tip2")}</li>
            <li>⏰ {t("tip3")}</li>
          </ul>

          <p>{t("finalMessage")}</p>
        </div>
      </div>
  );
};

export default BakingCake;
