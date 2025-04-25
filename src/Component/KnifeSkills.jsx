import React from "react";
import { Link } from "react-router-dom";
import "../KnifeSkills.css";
import knifePoster from "../assets/knife-skills-recipe.png";
import { useLanguage } from "../translator/Languagecontext";

const KnifeSkills = () => {
    const { t } = useLanguage();

    return (
        <div className="knife-container">
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            <h1 className="title">{t("knifeSkills_title")}</h1>

            <div className="poster-container">
                <img src={knifePoster} alt="Knife Skills Poster" className="poster" />
            </div>

            <div className="info-section">
                <h2>{t("essentialCutsTitle")}</h2>
                <p>{t("essentialCutsDesc")}</p>

                <h2>{t("typesOfCutsTitle")}</h2>
                <ul>
                    <li>🥕 <strong>{t("cutJulienne")}</strong> – {t("cutJulienneDesc")}</li>
                    <li>🍅 <strong>{t("cutBrunoise")}</strong> – {t("cutBrunoiseDesc")}</li>
                    <li>🥔 <strong>{t("cutChiffonade")}</strong> – {t("cutChiffonadeDesc")}</li>
                    <li>🥩 <strong>{t("cutChop")}</strong> – {t("cutChopDesc")}</li>
                    <li>🍍 <strong>{t("cutDice")}</strong> – {t("cutDiceDesc")}</li>
                </ul>

                <h2>{t("knifeTipsTitle")}</h2>
                <ul>
                    <li>🔪 {t("tipSharpKnife")}</li>
                    <li>🛑 {t("tipClawGrip")}</li>
                    <li>🚿 {t("tipCleanDry")}</li>
                    <li>🪵 {t("tipCuttingBoard")}</li>
                </ul>

                <p>{t("knifeSkillsOutro")}</p>
            </div>
        </div>
    );
};

export default KnifeSkills;
