import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCookRice.css";
import riceRecipe from "../assets/rice-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const CookRice = () => {
    const { t } = useLanguage();

    return (
        <div className="rice-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>
            <h1 className="title">{t("cookRiceTitle")}</h1>

            <div className="poster-container">
                <img src={riceRecipe} alt="Cooking Rice Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("riceWhyTitle")}</h2>
                <p>{t("riceWhyText1")}</p>
                <p>{t("riceWhyText2")}</p>

                <h2>{t("riceStepsTitle")}</h2>
                <ul>
                    <li>🥣 <strong>{t("stepRinseRice")}</strong> – {t("stepRinseRiceDesc")}</li>
                    <li>💧 <strong>{t("stepMeasureBoil")}</strong> – {t("stepMeasureBoilDesc")}</li>
                    <li>🍚 <strong>{t("stepAddRice")}</strong> – {t("stepAddRiceDesc")}</li>
                    <li>🔗 <strong>{t("stepCoverSimmer")}</strong> – {t("stepCoverSimmerDesc")}</li>
                    <li>⏲️ <strong>{t("stepRest")}</strong> – {t("stepRestDesc")}</li>
                    <li>🍽️ <strong>{t("stepFluffServe")}</strong> – {t("stepFluffServeDesc")}</li>
                </ul>

                <h2>{t("riceTipsTitle")}</h2>
                <ul>
                    <li>🔍 {t("tipCheckWater")}</li>
                    <li>🌾 {t("tipUseBroth")}</li>
                    <li>🍋 {t("tipLemonJuice")}</li>
                </ul>

                <p>{t("riceOutro")}</p>
            </div>
        </div>
    );
};

export default CookRice;
