import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import LoginForm from "./LoginForm";
import "../HomePage.css";
import Homephoto from "../assets/Homephoto.jpeg";

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const HomePage = ({ isLoggedIn, setLoggedIn, doRefreshPosts, appRefresh }) => {
  const [userToken, setUserToken] = useState("");
  const [randomTips, setRandomTips] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setUserToken(token);
    if (token) {
      fetchRandomTips(token);
    }

    window.scrollTo(0, 0);
  }, []);

  const fetchRandomTips = async (token) => {
    try {
      // Increase the limit if you need more tips in the pool for randomness
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}/posts?limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);
        let tips = [];

        // Check if the API returns an array (as in the cooking page) or an object with a "posts" property
        if (Array.isArray(data)) {
          tips = data[0].filter((post) => post.attributes?.postType === "tip");
        } else if (data.posts) {
          tips = data.posts.filter((post) => post.attributes?.postType === "tip");
        }
        // Shuffle and select 3 random tips
        const randomTipsSelected = shuffle([...tips]).slice(0, 4);
        setRandomTips(randomTipsSelected);
      } else {
        console.error("Failed to fetch tips, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  return (
    <div className="homepage">
      {!userToken ? (
        <LoginForm setLoggedIn={setLoggedIn} />
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-text">
              <h1>Discover our New Recipes</h1>
              <p>
                Learn, cook, and share yummy recipes with our  community of foodies.
              </p>
              <div className="hero-buttons">
                <Link to="/upload"><button className="btn primary">Post Your Own</button></Link>
                <Link to="/recipes"><button className="btn secondary">Browse Recipes</button></Link>
              </div>
            </div>
            <div className="hero-image">
              <img src={Homephoto} alt="Home Photo" className="responsive-image" />
            </div>
          </section>

          {/* Cuisine Section */}
          <section className="cuisine-section">
            <div className="cuisine-grid">
              {[
                { name: "Chinese" },
                { name: "Italian"},
                { name: "Indian"},
                { name: "Filipino"},
                { name: "Mexican" },
                { name: "Vietnamese"},
                { name: "American" },
              ].map((cuisine, index) => (
                <div key={index} className="cuisine-card">
                  <p>{cuisine.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Choose Your Level */}
          <section className="choose-level">
            <h2>Recommended Recipes based on Cooking Level!</h2>
            <div className="levels">
              <div className="level">
                <leveltext>Easy</leveltext>
              </div>
              <div className="level">
                <leveltext>Medium</leveltext>
              </div>
              <div className="level">
                <leveltext>Hard</leveltext>
              </div>
            </div>
          </section>

          {/* Popular Recipes */}
          <section className="popular-recipes">
            <div className="recipes-grid">
              <div className="recipe-card">

              </div>
              <div className="recipe-card">

              </div>
              <div className="recipe-card">

              </div>
              <div className="recipe-card">

              </div>
            </div>
          </section>

          {/* Featured Cooking Tips */}
          <section className="featured-tips">
            <h2>Featured Cooking Tips</h2>
            <div className="tips-grid">
              {randomTips.length > 0 ? (
                randomTips.map((tip) => (
                  <div key={tip.id} className="tip-card">
                    <h3>{tip.content}</h3>
                    <p>{tip.attributes?.description 
                      ? tip.attributes.description.length > 100 
                        ? `${tip.attributes.description.substring(0, 100)}...` 
                        : tip.attributes.description 
                      : "No description available"}
                    </p>                    
                    <Link to={`/tip/${tip.id}`} className="read-more">
                      Read More →
                    </Link>
                  </div>
                ))
              ) : (
                <p>Loading tips...</p>
              )}
            </div>
          </section>

          {/* How-To Guides */}
          <section className="how-to">
            <h2>How-To Guides</h2>
            <div className="guides">
              <div className="guide-card">
                <h3>Grilling Techniques</h3>
                <p> Master the Art of Grilling.</p>
                <Link to="/grilling-techniques"><a>Learn More →</a></Link>
              </div>
              <div className="guide-card">
                <h3>Baking Basics</h3>
                <p>Essential techniques for perfect baked goods.</p>
                <Link to="/baking-basics"><a>Learn More →</a></Link>
              </div>
              <div className="guide-card">
                <h3>Knife Skills 101</h3>
                <p> Learn how to chop, dice, and julienne like a pro!</p>
                <Link to="/knife-skills"><a>Learn More →</a></Link>
              </div>
              <div className="guide-card">
                <h3>Perfect Pasta</h3>
                <p>Cook pasta perfectly every time with these simple tricks.</p>
                <Link to="/perfect-pasta"><a>Learn More →</a></Link>
              </div>
              <div className="guide-card">
                <h3>Fluffy Pancakes Secrets</h3>
                <p>Discover the science behind the fluffiest pancakes ever!</p>
                <Link to="/fluffy-pancakes"><a>Learn More →</a></Link>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section className="community">
            <h2>Try Joining or Making a Cooking Community!</h2>
            <p>Connect with fellow food lovers, share recipes, and get inspired!</p>
            <div className="community-buttons">
            <Link to="/community"><button className="btn primary">Join Now</button></Link>
            </div>
          </section>
        </>
      )}
      <section className="contact">
        <h2>Contact Us</h2>
          <p>
            We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
          </p>
        </section>
    </div>
  );
};

export default HomePage;
