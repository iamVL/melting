import React from "react";
import { Link } from "react-router-dom";
import "../PastaCooking.css";  // Import CSS
import pastaPoster from "../assets/pasta-recipe.png";  // Image file

const PastaCooking = () => {
  return (
    <div className="pasta-container">
      <div className="back-link">
        <Link to="/how-to-guides">← Back to How-To Guides</Link>
      </div>

      <h1 className="title">How to Cook Pasta</h1>

      <div className="poster-container">
        <img src={pastaPoster} alt="Pasta Cooking Poster" className="poster" />
      </div>

      <div className="info-section">
        <h2>Mastering Pasta Perfection</h2>
        <p>Cooking pasta might seem simple, but small changes make a big difference! 🍝</p>

        <h2>Key Steps for the Best Pasta</h2>
        <ul>
          <li>💧 Use plenty of water – 4-6 cups per 100g pasta.</li>
          <li>🧂 Salt the water generously – It enhances flavor.</li>
          <li>⏳ Follow the package cooking time – Avoid overcooking.</li>
          <li>❄️ Save some pasta water – Helps bind sauce to pasta.</li>
          <li>🥄 Toss pasta with sauce immediately – Absorbs flavor.</li>
        </ul>

        <h2>Cooking Timeline</h2>
        <ul>
          <li>🔥 Bring salted water to a rolling boil.</li>
          <li>🍝 Add pasta and stir to prevent sticking.</li>
          <li>⏳ Cook according to instructions (al dente is best!).</li>
          <li>🕳️ Drain in a colander, reserving some pasta water.</li>
          <li>🍅 Toss with your favorite sauce and enjoy!</li>
        </ul>

        <p>Now you can make **restaurant-quality pasta** at home! 🎉</p>
      </div>
    </div>
  );
};

export default PastaCooking;
