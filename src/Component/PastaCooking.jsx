import React from "react";
import { Link } from "react-router-dom";
import "../PastaCooking.css";
import pastaPoster from "../assets/pasta-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const PastaCooking = () => {
    const { t } = useLanguage();

    return (
        <div className="pasta-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            <h1 className="title">{t("howToCookPastaTitle")}</h1>

            <div className="poster-container">
                <img src={pastaPoster} alt="Pasta Cooking Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("pastaMasteryTitle")}</h2>
                <p>{t("pastaMasteryText")}</p>

                <h2>{t("keyStepsTitle")}</h2>
                <ul>
                    <li>💧 {t("pastaStep1")}</li>
                    <li>🧂 {t("pastaStep2")}</li>
                    <li>⏳ {t("pastaStep3")}</li>
                    <li>❄️ {t("pastaStep4")}</li>
                    <li>🥄 {t("pastaStep5")}</li>
                </ul>

                <h2>{t("cookingTimelineTitle")}</h2>
                <ul>
                    <li>🔥 {t("timelineStep1")}</li>
                    <li>🍝 {t("timelineStep2")}</li>
                    <li>⏳ {t("timelineStep3")}</li>
                    <li>🕳️ {t("timelineStep4")}</li>
                    <li>🍅 {t("timelineStep5")}</li>
                </ul>

                <p>{t("pastaOutro")}</p>
            </div>
        </div>
    );
};

export default PastaCooking;
