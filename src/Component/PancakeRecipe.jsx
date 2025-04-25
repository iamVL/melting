import React from "react";
import { Link } from "react-router-dom";
import "../PancakeRecipe.css";
import pancakePoster from "../assets/pancake-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const PancakeRecipe = () => {
    const { t } = useLanguage();

    return (
        <div className="pancake-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            <h1 className="title">{t("pancakeTitle")}</h1>

            <div className="poster-container">
                <img src={pancakePoster} alt="Pancake Recipe Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("fluffySecretsTitle")}</h2>
                <p>{t("fluffySecretsDesc")}</p>

                <h2>{t("keyIngredientsTitle")}</h2>
                <ul>
                    <li>🌾 {t("pancakeFlour")}</li>
                    <li>🥚 {t("pancakeEggs")}</li>
                    <li>🥛 {t("pancakeMilk")}</li>
                    <li>🍯 {t("pancakeSugar")}</li>
                    <li>🧈 {t("pancakeButter")}</li>
                    <li>🌡️ {t("pancakeBakingPowder")}</li>
                </ul>

                <h2>{t("stepByStepTitle")}</h2>
                <ul>
                    <li>🥄 {t("pancakeStep1")}</li>
                    <li>🎨 {t("pancakeStep2")}</li>
                    <li>🔥 {t("pancakeStep3")}</li>
                    <li>🥄 {t("pancakeStep4")}</li>
                    <li>🔄 {t("pancakeStep5")}</li>
                    <li>🍯 {t("pancakeStep6")}</li>
                </ul>

                <p>{t("pancakeOutro")}</p>
            </div>
        </div>
    );
};

export default PancakeRecipe;
