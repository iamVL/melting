  import React, { useState, useEffect } from "react";
  import { Link,useNavigate } from "react-router-dom"; // Import Link for navigation
  import "../Landing.css";
  import cookingpots from "../assets/2023_0817-kitchen-scaled.webp";
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

  const Landing = ({ setLoggedIn }) => {

  return (
    <div className="landing-page">
      <div className="image-overlay">
        <img src={cookingpots} alt="Cooking Pot" />
        <div className="overlay-text">
          <div className="slogan-text">
            <h1 className="slogan-title">From Our Pot to Your Plate</h1>
            <h1 className="slogan-subtitle">Taste Diversity</h1>
          </div>
          <div className="slogan-layout">
            <div className="slogan-buttons">
              <Link to="/register"> Start Cooking </Link>
              <Link to="/aboutus"> Our Team </Link>
            </div>
            <button  onClick={() => document.getElementById("showcase-section").scrollIntoView({ behavior: "smooth" })} id="landing-learn"> Discover More</button>
          </div>
        </div>
      </div>

      <div className="feature-showcase">
        <h2> Highlighted Features</h2>
        <div className="example-container">
          <div className="example-box">
            <img src={FeatureRecipe} alt="recipe-symbol" width={60}/>
            <p> Cooking Recipes</p>
          </div>

          <div className="example-box">
            <img src={FeatureTip} alt="tip-symbol" width={60}/>
            <p> Kitchen Tips</p>
          </div>

          <div className="example-box">
            <img src={FeatureGuide} alt="guide-symbol" width={60}/>
            <p> Useful Guides</p>
          </div>

          <div className="example-box">
            <img src={FeatureCommunity} alt="community-symbol" width={60}/>
            <p> Diverse Communities</p>
          </div>

          <div className="example-box">
            <img src={FeatureReview} alt="review-symbol" width={60}/>
            <p> User Reviews</p>
          </div>

          <div className="example-box">
            <img src={FeatureFilter} alt="filter-symbol" width={50}/>
            <p> Filter Preferences</p>
          </div>

          <div className="example-box">
            <img src={FeatureCookbook} alt="cookbook-symbol" width={60}/>
            <p> Saved Cookbooks</p>
          </div>

          <div className="example-box">
            <img src={FeatureDifficulty} alt="difficulty-symbol" width={60}/>
            <p> Difficulty Levels</p>
          </div>

          <div className="example-box">
            <img src={FeatureSocial} alt="social-symbol" width={60}/>
            <p> Social Network</p>
          </div>
        </div>
      </div>

      <div id="showcase-section" className="site-showcase">
        <div className="feature-display">
          <div className="feature-box">
            <div className="feature-box-header">
              <img src={Share} alt="share-symbol" width={60}/>
              <h3> Share With Others</h3>
            </div>
            <h4> Upload your favorite recipes or kitchen tips. Inspire others with your cooking ideas and creations.</h4>
          </div>

          <div className="feature-box">
            <div className="feature-box-header">
              <img src={Filter} alt="filter-symbol" width={60}/>
              <h3> Filter Your Needs</h3>
            </div>
            <h4> Find meals based on what ingredients you already have. You can also filter by difficulty, dietary needs, or time.</h4>
          </div>

          <div className="feature-box">
          <div className="feature-box-header">
              <img src={Help} alt="help-symbol" width={60}/>
              <h3> Helpful Tutorials</h3>
            </div>
            <h4> Need a hand in the kitchen? Follow easy, step-by-step guides to boost your skills.</h4>
          </div>

          <div className="feature-box">
          <div className="feature-box-header">  
              <img src={Review} alt="review-symbol" width={60}/>
              <h3> Review Your Opinions</h3>
            </div>
            <h4> Tried something new? Leave a review! Help others know what’s worth making again.</h4>
          </div>

        </div>

        <div className="landing-about">
          <h3> Our Cooking Journey</h3>
          <h4> Melting Pot's goal is to make cooking fun, quick, and easy for everyone. Whether you're new to cooking or a pro, our platform gives you recipes based on your ingredients, skill level, and taste.</h4>
          <br></br>
          <h4 style={{marginBottom:"30px"}}>No more stressing over what to cook. Just enter what you have, and we’ll suggest recipes sorted by difficulty — Easy, Medium, or Hard. Choose what works best for you and start cooking! </h4>
          <Link to="/register">
            <button id="journey-join-button"> Join Us </button>
          </Link>
        </div>
      </div>

      <div className="landing-contact">
        <h5> Contact Us </h5>
        <p>
          We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
        </p>
      </div>

  </div>

  );
  };


  export default Landing;



