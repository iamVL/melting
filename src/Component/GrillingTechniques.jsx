import React from "react";
import "../GrillingTechniques.css";  // Import CSS
import grillingPoster from "/Users/vailok/Desktop/UBcourses/melting/src/assets/grill-chicken-recipe.png";  // Ensure this image is in src/assets/
import { Link } from "react-router-dom"; // Import Link for navigation

const GrillingTechniques = () => {
  return (
    <div className="grilling-container">
      {/* Back Link */}
      <div className="back-link">
        <Link to="/how-to-guides">⬅ Back to How-To Guides</Link>
      </div>

      {/* Title */}
      <h1 className="title"> Grilling Techniques</h1>

      {/* Poster */}
      <div className="poster-container">
        <img src={grillingPoster} alt="Grilling Poster" className="poster" />
      </div>

      {/* Information Section */}
      <div className="info-section">
        <h2>Why Master Grilling?</h2>
        <p>
          Grilling isn't just about throwing meat on a flame! 🍖 Master the art of searing, slow-cooking, 
          and locking in juices to get that perfect BBQ experience.
        </p>

        <h2>Pro Grilling Tips</h2>
        <ul>
          <li>🔥 <strong>High Heat for Searing</strong> – Start hot to lock in flavors, then reduce heat for cooking.</li>
          <li>🌡️ <strong>Use a Thermometer</strong> – Ensure your meat is perfectly cooked inside-out.</li>
          <li>🛢️ <strong>Oil Your Grill</strong> – Prevent sticking and get those beautiful grill marks.</li>
          <li>🍗 <strong>Let It Rest</strong> – Allow grilled meat to sit for a few minutes to redistribute juices.</li>
          <li>🌿 <strong>Experiment with Wood Chips</strong> – Infuse extra smoky flavor with different woods!</li>
        </ul>

        <p>Get your apron on and **grill like a pro!** 🍔🔥</p>
      </div>
    </div>
  );
};

export default GrillingTechniques;
