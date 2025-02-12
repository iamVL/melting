// AboutUs.js

import React from "react";
import "./AboutUs.css";
import Justin from "./Team pictures/Justin.jpg";

const AboutUs = () => {
  return (
    <div className="about-page">
      <nav className="navbar">
        <div className="logo">Melting Pot</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/featured">Featured</a></li>
          <li><a href="/favorites">Favorites</a></li>
          <li><a href="/upload">Upload Recipe</a></li>
          <li><a href="/aboutus" className="active">About Us</a></li>
        </ul>
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <button>🔍</button>
        </div>
      </nav>

      <header className="header-section">
        <h1>About Us</h1>
        <p>Discover more about our mission, vision, and the team behind Melting Pot.</p>
      </header>

      <section className="content-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to transform your cooking experience, making it fun, fast, and easy. Whether you're a novice, intermediate, or expert chef, our platform is designed to meet your needs with recipes tailored to your ingredients, skill level, and preferences.
        </p>

        <h2>Our Vision</h2>
        <p>
          We envision an experience where cooking becomes an enjoyable and effortless activity. Instead of spending hours brainstorming meals, users can list their available ingredients in our app and receive a plethora of recipe options categorized by difficulty levels: Easy, Medium, and Hard.
        </p>

        <h2>Features</h2>
        <ul>
          <li><strong>Ingredient-Based Search:</strong> Enter what you have in your kitchen and discover recipes you can make.</li>
          <li><strong>Difficulty Levels:</strong> Choose recipes based on time, cost, and complexity.</li>
          <li><strong>User Reviews & Comments:</strong> Rate recipes and share your tweaks and experiences.</li>
          <li><strong>Recipe Filters:</strong> Explore recipes based on preferred cuisines and nationalities.</li>
          <li><strong>Swipe Feature:</strong> Like Tinder for recipes—swipe through meal ideas and save your favorites to your cookbook.</li>
        </ul>

        <h2>Team behind Melting Pot</h2>
          
          <img 
            src={Justin} className="team" alt="Justin" height={200} width={200}>
          </img>
          <p>
            My name is Justin! I am a Junior graduating next spring and I have two dogs and a cat that I love very much.
          </p>

        <h2>Contact Us</h2>
        <p>
          We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;