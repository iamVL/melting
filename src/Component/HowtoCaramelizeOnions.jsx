import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCaramelizeOnions.css";
import onionRecipe from "../assets/caramelized-onion-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const CaramelizingOnions = () => {
    const { t } = useLanguage();

    return (
        <div className="onion-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            <h1 className="title">{t("caramelizeOnionsTitle")}</h1>

            <div className="poster-container">
                <img src={onionRecipe} alt="Caramelizing Onions Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("whyCaramelizeTitle")}</h2>
                <p>{t("whyCaramelizeText1")}</p>
                <p>{t("whyCaramelizeText2")}</p>

                <h2>{t("stepsCaramelizeTitle")}</h2>
                <ul>
                    <li>🧅 <strong>{t("stepSlice")}</strong> – {t("stepSliceDesc")}</li>
                    <li>🔥 <strong>{t("stepHeatPan")}</strong> – {t("stepHeatPanDesc")}</li>
                    <li>🌿 <strong>{t("stepAddOnions")}</strong> – {t("stepAddOnionsDesc")}</li>
                    <li>⏳ <strong>{t("stepCookSlow")}</strong> – {t("stepCookSlowDesc")}</li>
                    <li>⚖️ <strong>{t("stepSeason")}</strong> – {t("stepSeasonDesc")}</li>
                    <li>👌 <strong>{t("stepFinishServe")}</strong> – {t("stepFinishServeDesc")}</li>
                </ul>

                <h2>{t("caramelizeTipsTitle")}</h2>
                <ul>
                    <li>⏰ {t("tipPatience")}</li>
                    <li>🔥 {t("tipStir")}</li>
                    <li>🍯 {t("tipBrownSugar")}</li>
                </ul>

                <p>{t("caramelizeOutro")}</p>
            </div>
        </div>
    );
};

export default CaramelizingOnions;
