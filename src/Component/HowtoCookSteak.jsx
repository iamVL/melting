import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCookSteak.css";
import steakRecipe from "../assets/cook-steak-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const CookSteak = () => {
    const { t } = useLanguage();

    return (
        <div className="steak-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>
            <h1 className="title">{t("cookSteakTitle")}</h1>

            <div className="poster-container">
                <img src={steakRecipe} alt="Cook Steak Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("steakWhyTitle")}</h2>
                <p>{t("steakWhyText1")}</p>
                <p>{t("steakWhyText2")}</p>

                <h2>{t("steakStepsTitle")}</h2>
                <ul>
                    <li>🧂 <strong>{t("steakStepSeason")}</strong> – {t("steakStepSeasonDesc")}</li>
                    <li>🔥 <strong>{t("steakStepPreheat")}</strong> – {t("steakStepPreheatDesc")}</li>
                    <li>🥄 <strong>{t("steakStepOil")}</strong> – {t("steakStepOilDesc")}</li>
                    <li>🥩 <strong>{t("steakStepSear")}</strong> – {t("steakStepSearDesc")}</li>
                    <li>🌡️ <strong>{t("steakStepTemp")}</strong>
                        <ul>
                            <li>{t("tempRare")}</li>
                            <li>{t("tempMediumRare")}</li>
                            <li>{t("tempMedium")}</li>
                            <li>{t("tempMediumWell")}</li>
                            <li>{t("tempWellDone")}</li>
                        </ul>
                    </li>
                    <li>🧈 <strong>{t("steakStepBaste")}</strong> – {t("steakStepBasteDesc")}</li>
                    <li>⏲️ <strong>{t("steakStepRest")}</strong> – {t("steakStepRestDesc")}</li>
                    <li>🔪 <strong>{t("steakStepSlice")}</strong> – {t("steakStepSliceDesc")}</li>
                </ul>

                <h2>{t("steakTipsTitle")}</h2>
                <ul>
                    <li>🧈 {t("steakTipButter")}</li>
                    <li>🪵 {t("steakTipRest")}</li>
                    <li>⚖️ {t("steakTipTime")}</li>
                </ul>

                <p>{t("steakOutro")}</p>
            </div>
        </div>
    );
};

export default CookSteak;
