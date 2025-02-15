// AboutUs.js

import React from "react";
import "./AboutVaishnavi.css";
import Vaishnavi from "../Team pictures/Vaishnavi.png";

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
        <h1>About Vaishnavi</h1>
      </header>
        <img 
            src={Vaishnavi} class="profilepic" alt="Justin" height={300} width={300}>
        </img>
          <div class="Justin">
          Hey there! I am Vaishnavi Lokhande—20 years old, a Junior graduating next spring, and on a mission to dive straight into a PhD after undergrad. I dream of publishing groundbreaking research under my name and one day shaping young minds as a research professor.
          When I am not deep into academia, you will probably find me chasing breathtaking trails, exploring hidden gems around the world, and saying yes to adventure! If you are up for an epic travel or hiking trip, let us make it happen—let us explore together! 🌍⛰️
          </div>
        <h2>Contact Us</h2>
        <p>
          We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
        </p>
    </div>
  );
};

export default AboutUs;