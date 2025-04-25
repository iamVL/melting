import React from "react";
import { Link } from "react-router-dom";
import "../HowtoHomemadeBread.css";
import breadRecipe from "../assets/bread-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const HomemadeBread = () => {
    const { t } = useLanguage();

    return (
        <div className="bread-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            <h1 className="title">{t("homemadeBreadTitle")}</h1>

            <div className="poster-container">
                <img src={breadRecipe} alt="Homemade Bread Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("whyMakeBreadTitle")}</h2>
                <p>{t("whyMakeBreadText1")}</p>
                <p>{t("whyMakeBreadText2")}</p>

                <h2>{t("stepsBreadTitle")}</h2>
                <ul>
                    <li>🍞 <strong>{t("stepMix")}</strong> – {t("stepMixDesc")}</li>
                    <li>💧 <strong>{t("stepActivate")}</strong> – {t("stepActivateDesc")}</li>
                    <li>🫒 <strong>{t("stepAddYeastOil")}</strong> – {t("stepAddYeastOilDesc")}</li>
                    <li>🥄 <strong>{t("stepKnead")}</strong> – {t("stepKneadDesc")}</li>
                    <li>⏲️ <strong>{t("stepRest")}</strong> – {t("stepRestDesc")}</li>
                    <li>🔥 <strong>{t("stepProofBake")}</strong> – {t("stepProofBakeDesc")}</li>
                    <li>🌬️ <strong>{t("stepCoolServe")}</strong> – {t("stepCoolServeDesc")}</li>
                </ul>

                <h2>{t("breadTipsTitle")}</h2>
                <ul>
                    <li>🌡️ {t("tipWaterTemp")}</li>
                    <li>👌 {t("tipKneading")}</li>
                    <li>🥖 {t("tipRising")}</li>
                </ul>

                <p>{t("breadOutro")}</p>
            </div>
        </div>
    );
};

export default HomemadeBread;
