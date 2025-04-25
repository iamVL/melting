import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom"; // Import Link for navigation
import "../Landing.css";
import cookingpots from "../assets/2023_0817-kitchen-scaled.webp";
import { useLanguage } from "../translator/Languagecontext";
import Share from "../assets/sharearrow.png"
import Review from "../assets/finalreview.png"
import Filter from "../assets/filtersymbol.png"
import Help from "../assets/helpsymbol.png"





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
            <button> Start Cooking</button>
            <button> Our Team</button>
          </div>
          <Link to="/aboutus">
            <button id="landing-learn"> Discover More</button>
          </Link>
        </div>
      </div>
    </div>

    <div className="site-showcase">
      <div className="feature-display">
        <div className="feature-box">
          <div className="feature-box-header">
            <img src={Share} alt="share-symbol" width={60}/>
            <h5> Share With Others</h5>
          </div>
          <h6> Share with others your own Recipes/Tips</h6>
        </div>

        <div className="feature-box">
          <div className="feature-box-header">
            <img src={Filter} alt="share-symbol" width={60}/>
            <h5> Filter Your Needs</h5>
          </div>
          <h6> Share with others your own Recipes and Tips</h6>
        </div>

        <div className="feature-box">
        <div className="feature-box-header">
            <img src={Help} alt="share-symbol" width={60}/>
            <h5> Helpful Tutorials</h5>
          </div>
          <h6> Share with others your own Recipes/Tips</h6>
        </div>

        <div className="feature-box">
        <div className="feature-box-header">  
            <img src={Review} alt="share-symbol" width={60}/>
            <h5> Review Your Opinions</h5>
          </div>
          <h6> Share with others your own Recipes/Tips</h6>
        </div>

      </div>

      <div className="landing-about">
        <h3> Our Cooking Journey</h3>
        <h4> Melting Pot's mission is to make cooking fun, quick, and easy for everyone. Whether you're new to cooking or a pro, our platform gives you recipes based on your ingredients, skill level, and taste.</h4>
        <br></br>
        <h4>No more stressing over what to cook. Just enter what you have, and we’ll suggest recipes sorted by difficulty — Easy, Medium, or Hard. Choose what works best for you and start cooking! </h4>
        <Link to="/register">
          <button id="journey-join-button"> Join Us </button>
        </Link>
      </div>
    </div>

    <div className="feature-showcase">

    </div>

</div>

 );
};


export default Landing;



