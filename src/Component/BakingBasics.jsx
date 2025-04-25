import React from "react";
import { Link } from "react-router-dom";
import "../BakingBasics.css";
import bakingRatioPoster from "../assets/cupcake-recipe.png";
import { useLanguage } from "../translator/Languagecontext"; // ✅ Import useLanguage

const BakingBasics = () => {
    const { t } = useLanguage();

    return (
        <div className="baking-basics-container">
            {/* Back to Guides */}
            <div className="back-link">
                <Link to="/how-to-guides">← {t("backToGuides")}</Link>
            </div>

            {/* Page Title */}
            <h1 className="title">{t("bakingBasicsTitle")}</h1>

            {/* Poster */}
            <div className="poster-container">
                <img src={bakingRatioPoster} alt="Baking Ratio Poster" className="poster" />
            </div>

            {/* Additional Information */}
            <div className="info-section">
                <h2>{t("understandingRatiosTitle")}</h2>
                <p>{t("understandingRatiosDesc")}</p>

                <h2>{t("whyRatiosMatterTitle")}</h2>
                <ul>
                    <li>📏 <strong>{t("precision")}</strong> – {t("precisionDesc")}</li>
                    <li>🔬 <strong>{t("scienceBased")}</strong> – {t("scienceBasedDesc")}</li>
                    <li>🎨 <strong>{t("creativity")}</strong> – {t("creativityDesc")}</li>
                </ul>

                <h2>{t("keyRatiosTitle")}</h2>
                <p>{t("keyRatiosDesc")}</p>
                <ul>
                    <li>🍞 <strong>{t("bread")}</strong> – {t("breadRatio")}</li>
                    <li>🍪 <strong>{t("cookies")}</strong> – {t("cookiesRatio")}</li>
                    <li>🧁 <strong>{t("muffins")}</strong> – {t("muffinsRatio")}</li>
                    <li>🍰 <strong>{t("poundCake")}</strong> – {t("poundCakeRatio")}</li>
                </ul>

                <p>{t("masterRatiosOutro")}</p>
            </div>
        </div>
    );
};

export default BakingBasics;
