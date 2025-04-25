import React from "react";
import { Link } from "react-router-dom";
import "../HowtoSeasoning.css";
import seasoningImage from "../assets/seasoning-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const SeasoningFood = () => {
    const { t } = useLanguage();

    return (
        <div className="seasoning-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>
            <h1 className="title">{t("seasoningBasics_title")}</h1>

            <div className="poster-container">
                <img src={seasoningImage} alt="Seasoning Guide" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("seasoningWhyTitle")}</h2>
                <p>{t("seasoningWhyText1")}</p>
                <p>{t("seasoningWhyText2")}</p>

                <h2>{t("seasoningStepsTitle")}</h2>
                <ul>
                    <li>🌱 <strong>{t("stepHerbs")}</strong> – {t("stepHerbsDesc")}</li>
                    <li>🧄 <strong>{t("stepGarlicOnion")}</strong> – {t("stepGarlicOnionDesc")}</li>
                    <li>🌶️ <strong>{t("stepSpices")}</strong> – {t("stepSpicesDesc")}</li>
                    <li>🧂 <strong>{t("stepSaltPepper")}</strong> – {t("stepSaltPepperDesc")}</li>
                    <li>🍋 <strong>{t("stepAcid")}</strong> – {t("stepAcidDesc")}</li>
                    <li>🧴 <strong>{t("stepBlends")}</strong> – {t("stepBlendsDesc")}</li>
                </ul>

                <h2>{t("seasoningTipsTitle")}</h2>
                <ul>
                    <li>⚖️ {t("tipStageSeasoning")}</li>
                    <li>🌿 {t("tipHerbsTiming")}</li>
                    <li>🌶️ {t("tipSpiceCare")}</li>
                    <li>🥄 {t("tipTasteAsYouGo")}</li>
                </ul>

                <p>{t("seasoningOutro")}</p>
            </div>
        </div>
    );
};

export default SeasoningFood;
