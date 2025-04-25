import React from "react";
import { Link } from "react-router-dom";
import "../HowtoFilletFish.css";
import fishRecipe from "../assets/FilletFish-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const FilletFish = () => {
    const { t } = useLanguage();

    return (
        <div className="fish-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>
            <h1 className="title">{t("filletFishTitle")}</h1>

            <div className="poster-container">
                <img src={fishRecipe} alt="Fillet Fish Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("filletWhyTitle")}</h2>
                <p>{t("filletWhyText")}</p>

                <h2>{t("filletStepsTitle")}</h2>
                <ul>
                    <li>🔪 <strong>{t("filletStepPrepare")}</strong> – {t("filletStepPrepareDesc")}</li>
                    <li>🦈 <strong>{t("filletStepInitialCut")}</strong> – {t("filletStepInitialCutDesc")}</li>
                    <li>🔄 <strong>{t("filletStepBackbone")}</strong> – {t("filletStepBackboneDesc")}</li>
                    <li>🔁 <strong>{t("filletStepRepeat")}</strong> – {t("filletStepRepeatDesc")}</li>
                    <li>✂️ <strong>{t("filletStepSkin")}</strong> – {t("filletStepSkinDesc")}</li>
                    <li>🔍 <strong>{t("filletStepBones")}</strong> – {t("filletStepBonesDesc")}</li>
                </ul>

                <h2>{t("filletTipsTitle")}</h2>
                <ul>
                    <li>🔪 {t("filletTipKnife")}</li>
                    <li>🧼 {t("filletTipCleanSurface")}</li>
                    <li>⏳ {t("filletTipPractice")}</li>
                </ul>

                <p>{t("filletOutro")}</p>
            </div>
        </div>
    );
};

export default FilletFish;
