import React from "react";
import { Link } from "react-router-dom";
import "../HowtoSharpenKnives.css";
import knifeSharpeningImage from "../assets/sharpen-knives-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const SharpenKnives = () => {
    const { t } = useLanguage();

    return (
        <div className="sharpen-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>
            <h1 className="title">{t("sharpenKnives_title")}</h1>

            <div className="poster-container">
                <img src={knifeSharpeningImage} alt="Knife Sharpening Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("sharpenWhyTitle")}</h2>
                <p>{t("sharpenWhyText1")}</p>
                <p>{t("sharpenWhyText2")}</p>

                <h2>{t("sharpenStepsTitle")}</h2>
                <ul>
                    <li>🔪 <strong>{t("stepChooseTool")}</strong> – {t("stepChooseToolDesc")}</li>
                    <li>💦 <strong>{t("stepPrepStone")}</strong> – {t("stepPrepStoneDesc")}</li>
                    <li>⚖️ <strong>{t("stepAngle")}</strong> – {t("stepAngleDesc")}</li>
                    <li>🌀 <strong>{t("stepSharpenBlade")}</strong> – {t("stepSharpenBladeDesc")}</li>
                    <li>💧 <strong>{t("stepRinseTest")}</strong> – {t("stepRinseTestDesc")}</li>
                    <li>🔄 <strong>{t("stepRepeatHone")}</strong> – {t("stepRepeatHoneDesc")}</li>
                </ul>

                <h2>{t("sharpenTipsTitle")}</h2>
                <ul>
                    <li>⚡ {t("tipMaintainAngle")}</li>
                    <li>🔥 {t("tipFineGrit")}</li>
                    <li>🚿 {t("tipCleanDry")}</li>
                </ul>

                <p>{t("sharpenOutro")}</p>
            </div>
        </div>
    );
};

export default SharpenKnives;
