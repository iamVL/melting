  import React, { useState, useEffect } from "react";
  import { Link,useNavigate } from "react-router-dom"; // Import Link for navigation
  import "../Landing.css";
  import { useLanguage } from "../translator/Languagecontext";
  import Share from "../assets/sharearrow.png"
  import Review from "../assets/finalreview.png"
  import Filter from "../assets/filtersymbol.png"
  import Help from "../assets/helpsymbol.png"

  import FeatureRecipe from "../assets/feature-recipe.png";
  import FeatureTip from "../assets/feature-tips.png";
  import FeatureGuide from "../assets/feature-guides.png";
  import FeatureCommunity from "../assets/feature-community.png";
  import FeatureReview from "../assets/feature-review.png";
  import FeatureFilter from "../assets/feature-filter.png";
  import FeatureDifficulty from "../assets/feature-difficulties.png";
  import FeatureCookbook from "../assets/feature-cookbook.png";
  import FeatureSocial from "../assets/feature-socials.png";

  import bg1 from "../assets/meltin4.webp";
  import bg2 from "../assets/melting1.webp";
  import bg3 from "../assets/melting6.jpg";
  import bg4 from "../assets/melting7.webp";

  const images = [bg1, bg2, bg3, bg4];

  const Landing = ({ setLoggedIn }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="landing-page">
          <div className="image-overlay">
            <img
                key={currentIndex}
                src={images[currentIndex]}
                alt="Background"
                className="background-carousel"
            />
            <div className="overlay-text">
              <div className="slogan-text">
                <h1 className="slogan-title">{t("landing_slogan_main")}</h1>
                <h1 className="slogan-subtitle">{t("landing_slogan_sub")}</h1>
              </div>
              <div className="slogan-layout">
                <div className="slogan-buttons">
                  <Link to="/register">{t("landing_start")}</Link>
                  <Link to="/aboutus">{t("landing_team")}</Link>
                </div>
                <button
                    onClick={() =>
                        document
                            .getElementById("showcase-section")
                            .scrollIntoView({ behavior: "smooth" })
                    }
                    id="landing-learn"
                >
                  {t("landing_discover")}
                </button>
              </div>
            </div>
          </div>

          <div className="feature-showcase">
            <h2>{t("landing_features_title")}</h2>
            <div className="example-container">
              <div className="example-box">
                <img src={FeatureRecipe} alt="recipe-symbol" width={60} />
                <p>{t("landing_feature_recipe")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureTip} alt="tip-symbol" width={60} />
                <p>{t("landing_feature_tip")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureGuide} alt="guide-symbol" width={60} />
                <p>{t("landing_feature_guide")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureCommunity} alt="community-symbol" width={60} />
                <p>{t("landing_feature_community")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureReview} alt="review-symbol" width={60} />
                <p>{t("landing_feature_review")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureFilter} alt="filter-symbol" width={50} />
                <p>{t("landing_feature_filter")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureCookbook} alt="cookbook-symbol" width={60} />
                <p>{t("landing_feature_cookbook")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureDifficulty} alt="difficulty-symbol" width={60} />
                <p>{t("landing_feature_difficulty")}</p>
              </div>

              <div className="example-box">
                <img src={FeatureSocial} alt="social-symbol" width={60} />
                <p>{t("landing_feature_social")}</p>
              </div>
            </div>
          </div>

          <div id="showcase-section" className="site-showcase">
            <div className="feature-display">
              <div className="feature-box">
                <div className="feature-box-header">
                  <img src={Share} alt="share-symbol" width={60} />
                  <h3>{t("landing_feature_share_title")}</h3>
                </div>
                <h4>{t("landing_feature_share_desc")}</h4>
              </div>

              <div className="feature-box">
                <div className="feature-box-header">
                  <img src={Filter} alt="filter-symbol" width={60} />
                  <h3>{t("landing_feature_filter_title")}</h3>
                </div>
                <h4>{t("landing_feature_filter_desc")}</h4>
              </div>

              <div className="feature-box">
                <div className="feature-box-header">
                  <img src={Help} alt="help-symbol" width={60} />
                  <h3>{t("landing_feature_help_title")}</h3>
                </div>
                <h4>{t("landing_feature_help_desc")}</h4>
              </div>

              <div className="feature-box">
                <div className="feature-box-header">
                  <img src={Review} alt="review-symbol" width={60} />
                  <h3>{t("landing_feature_review_title")}</h3>
                </div>
                <h4>{t("landing_feature_review_desc")}</h4>
              </div>
            </div>

            <div className="landing-about">
              <h3>{t("landing_journey_title")}</h3>
              <h4>{t("landing_journey_desc1")}</h4>
              <br />
              <h4 style={{ marginBottom: "30px" }}>
                {t("landing_journey_desc2")}
              </h4>
              <Link to="/register">
                <button id="journey-join-button">{t("landing_join")}</button>
              </Link>
            </div>
          </div>

          <div className="landing-contact">
            <h5>{t("landing_contact_title")}</h5>
            <p>
              {t("landing_contact_text")}{" "}
              <a href="mailto:support@meltingpot.com">
                support@meltingpot.com
              </a>
              .
            </p>
          </div>
        </div>
    );

  };


  export default Landing;
