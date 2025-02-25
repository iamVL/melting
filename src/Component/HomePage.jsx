import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import LoginForm from "./LoginForm";
import "../HomePage.css";

const HomePage = ({ isLoggedIn, setLoggedIn, doRefreshPosts, appRefresh }) => {
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    setUserToken(sessionStorage.getItem("token"));
  }, []);

  return (
    <div>
      {!userToken ? (
        <>
          <LoginForm setLoggedIn={setLoggedIn} />
        </>
      ) : (
        <div className="homepage">
          {/* Category Section */}
          <div className="categories">
            {[
              "Americans",
              "Mexican",
              "Italian",
              "Breakfast",
              "Salads",
              "Cakes",
              "Egg Dishes",
              "Sweet Treats",
              "Other",
            ].map((category, index) => (
              <div key={index} className="category-item">
                <span role="img" aria-label="icon">🍔</span>
                <p>{category}</p>
              </div>
            ))}
          </div>

          {/* Main Banner */}
          <div className="banner">
            <h1>Discover New Recipes!</h1>
            <p>Welcome to the Melting Pot! Filter recipes based on ingredients, price, and experience level.</p>
          </div>

          {/* Cooking Level */}
          <div className="cooking-level">
            <h1>Cooking Level</h1>
            <div className="level-buttons">
              <button className="level-button easy">Easy</button>
              <button className="level-button medium">Medium</button>
              <button className="level-button hard">Hard</button>
            </div>
          </div>

          {/* Trending Recipes */}
          <div className="Trending-recipes">
            <h1>Trending Recipes</h1>
            <ul></ul>
          </div>

          {/* Recent Recipes Section */}
          <div className="recent-recipes">
            <h1>Recent Recipes</h1>
            <ul>
              <li>
                <strong><i>You have not recently viewed a recipe</i></strong>
              </li>
            </ul>
          </div>

          {/* User's Reviews */}
          <div className="reviews-section">
            <h1>User's Reviews</h1>
            <p>See what others are saying about our recipes!</p>
          </div>

          {/* Popular Recipes Section */}
          <div className="popular-recipes">
            <h1>Popular Recipes</h1>
            <ul>
              <li>
                <a href="/mediterranean-salad" className="button">
                  <b>Mediterranean Salad</b>
                </a>
                <p>Healthy and refreshing</p>
                <p className="prep-time"><b>15 min prep</b></p>
              </li>
            </ul>
          </div>

          <div className="light-gray-box"></div>
          <div className="light-gray-box1"></div>

    {/* Cookingg Tips */}
    <Link to="/tips" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="cooking-tips">
        <h1>Cooking Tips</h1>
      </div>
    </Link>
          {/* How-To Guides */}
          <div className="Howto">
            <h1>
              <Link to="/how-to-guides" className="howto-link">How-To Guides</Link>
            </h1>
          </div>

          <div className="light-gray-box2"></div>
          <div className="light-gray-box3"></div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
