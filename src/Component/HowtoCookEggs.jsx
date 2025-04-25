import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCookEggs.css";
import eggPoster from "../assets/eggs-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const CookEggs = () => {
    const { t } = useLanguage();

    return (
        <div className="egg-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>
            <h1 className="title">{t("cookEggsTitle")}</h1>

            <div className="poster-container">
                <img src={eggPoster} alt="Cooking Eggs Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("masterEggsTitle")}</h2>
                <p>{t("masterEggsText1")}</p>
                <p>{t("masterEggsText2")}</p>

                <h2>{t("waysToCookEggsTitle")}</h2>
                <ul>
                    <li>🍳 <strong>{t("eggScrambled")}</strong> – {t("eggScrambledDesc")}</li>
                    <li>☀️ <strong>{t("eggSunny")}</strong> – {t("eggSunnyDesc")}</li>
                    <li>🔁 <strong>{t("eggOverEasy")}</strong> – {t("eggOverEasyDesc")}</li>
                    <li>🔁 <strong>{t("eggOverMedium")}</strong> – {t("eggOverMediumDesc")}</li>
                    <li>🔁 <strong>{t("eggOverHard")}</strong> – {t("eggOverHardDesc")}</li>
                    <li>🌊 <strong>{t("eggPoached")}</strong> – {t("eggPoachedDesc")}</li>
                    <li>🥚 <strong>{t("eggSoftBoiled")}</strong> – {t("eggSoftBoiledDesc")}</li>
                    <li>🥚 <strong>{t("eggHardBoiled")}</strong> – {t("eggHardBoiledDesc")}</li>
                    <li>🔥 <strong>{t("eggFried")}</strong> – {t("eggFriedDesc")}</li>
                    <li>🍳 <strong>{t("eggOmelet")}</strong> – {t("eggOmeletDesc")}</li>
                </ul>

                <h2>{t("eggTipsTitle")}</h2>
                <ul>
                    <li>🧈 {t("eggTipButter")}</li>
                    <li>🔥 {t("eggTipHeat")}</li>
                    <li>💧 {t("eggTipVinegar")}</li>
                    <li>⏱️ {t("eggTipIce")}</li>
                </ul>

                <p>{t("eggOutro")}</p>
            </div>
        </div>
    );
};

export default CookEggs;
