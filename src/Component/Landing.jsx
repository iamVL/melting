import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Landing.css";
import cookingpots from "../assets/2023_0817-kitchen-scaled.webp";
import { useLanguage } from "../translator/Languagecontext";
import Share from "../assets/sharearrow.png";
import Review from "../assets/finalreview.png";
import Filter from "../assets/filtersymbol.png";
import Help from "../assets/helpsymbol.png";

const Landing = ({ setLoggedIn }) => {
    const { t } = useLanguage();

    return (
        <div className="landing-page">
            <div className="image-overlay">
                <img src={cookingpots} alt="Cooking Pot" />
                <div className="overlay-text">
                    <div className="slogan-text">
                        <h1 className="slogan-title">{t("landing_slogan_title")}</h1>
                        <h1 className="slogan-subtitle">{t("landing_slogan_subtitle")}</h1>
                    </div>
                    <div className="slogan-layout">
                        <div className="slogan-buttons">
                            <button>{t("start_cooking")}</button>
                            <button>{t("our_team")}</button>
                        </div>
                        <Link to="/aboutus">
                            <button id="landing-learn">{t("discover_more")}</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="site-showcase">
                <div className="feature-display">
                    <div className="feature-box">
                        <div className="feature-box-header">
                            <img src={Share} alt="share-symbol" width={60} />
                            <h5>{t("share_with_others_title")}</h5>
                        </div>
                        <h6>{t("share_with_others_desc")}</h6>
                    </div>

                    <div className="feature-box">
                        <div className="feature-box-header">
                            <img src={Filter} alt="filter-symbol" width={60} />
                            <h5>{t("filter_your_needs_title")}</h5>
                        </div>
                        <h6>{t("filter_your_needs_desc")}</h6>
                    </div>

                    <div className="feature-box">
                        <div className="feature-box-header">
                            <img src={Help} alt="help-symbol" width={60} />
                            <h5>{t("helpful_tutorials_title")}</h5>
                        </div>
                        <h6>{t("helpful_tutorials_desc")}</h6>
                    </div>

                    <div className="feature-box">
                        <div className="feature-box-header">
                            <img src={Review} alt="review-symbol" width={60} />
                            <h5>{t("review_opinions_title")}</h5>
                        </div>
                        <h6>{t("review_opinions_desc")}</h6>
                    </div>
                </div>

                <div className="landing-about">
                    <h3>{t("our_journey_title")}</h3>
                    <h4>{t("our_journey_placeholder")}</h4>
                </div>
            </div>

            <div className="feature-showcase"></div>
        </div>
    );
};

export default Landing;
