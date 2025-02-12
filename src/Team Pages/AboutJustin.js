// AboutUs.js

import React from "react";
import "./AboutJustin.css";
import Justin from "../Team pictures/Justin.jpg";

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
        <h1>About Justin</h1>
      </header>
        <img 
            src={Justin} class="profilepic" alt="Justin" height={300} width={300}>
        </img>
          <div class="Justin">
            My name is Justin Nguyen! I am 20 years old and a Junior graduating next spring and I have two dogs and a cat that I love very much. 
            I have the intentions of becoming a full-stack developer and working at a company where I am able to collaborate and innovate with a lot of people!
            I have recently picked up an obssessive hobby of snowboarding at Holiday Valley.
          </div>
        <h2>Contact Us</h2>
        <p>
          We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
        </p>
    </div>
  );
};

export default AboutUs;