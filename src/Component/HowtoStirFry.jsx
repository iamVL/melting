import React from "react";
import { Link } from "react-router-dom";
import "../HowtoStirFry.css";
import stirFryRecipe from "../assets/stirfry-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const StirFrying = () => {
    const { t } = useLanguage();

    return (
        <div className="stirfry-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            <h1 className="title">{t("stirFryTitle")}</h1>

            <div className="poster-container">
                <img src={stirFryRecipe} alt="Stir Frying Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("whyStirFryTitle")}</h2>
                <p>{t("whyStirFryText1")}</p>
                <p>{t("whyStirFryText2")}</p>

                <h2>{t("stepsStirFryTitle")}</h2>
                <ul>
                    <li>🔥 <strong>{t("stepHeatPan")}</strong> – {t("stepHeatPanDesc")}</li>
                    <li>🛢️ <strong>{t("stepAddOil")}</strong> – {t("stepAddOilDesc")}</li>
                    <li>🌿 <strong>{t("stepAddAromatics")}</strong> – {t("stepAddAromaticsDesc")}</li>
                    <li>🍗 <strong>{t("stepAddProtein")}</strong> – {t("stepAddProteinDesc")}</li>
                    <li>🥕 <strong>{t("stepAddVeggies")}</strong> – {t("stepAddVeggiesDesc")}</li>
                    <li>🍜 <strong>{t("stepAddRiceNoodles")}</strong> – {t("stepAddRiceNoodlesDesc")}</li>
                    <li>🥢 <strong>{t("stepAddSauces")}</strong> – {t("stepAddSaucesDesc")}</li>
                    <li>✨ <strong>{t("stepFinalStir")}</strong> – {t("stepFinalStirDesc")}</li>
                    <li>🌿 <strong>{t("stepGarnish")}</strong> – {t("stepGarnishDesc")}</li>
                </ul>

                <h2>{t("stirFryTipsTitle")}</h2>
                <ul>
                    <li>💨 {t("tipKeepMoving")}</li>
                    <li>🔥 {t("tipHighHeat")}</li>
                    <li>🥢 {t("tipNoCrowding")}</li>
                </ul>

                <p>{t("stirFryOutro")}</p>
            </div>
        </div>
    );
};

export default StirFrying;
