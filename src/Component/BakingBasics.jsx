import React from "react";
import { Link } from "react-router-dom";
import "../BakingBasics.css";  // Import the CSS
import bakingRatioPoster from "../assets/cupcake-recipe.png";  // Ensure this image is in src/assets/

const BakingBasics = () => {
  return (
    <div className="baking-basics-container">
      {/* Back to Guides */}
      <div className="back-link">
        <Link to="/how-to-guides">← Back to How-To Guides</Link>
      </div>

      {/* Page Title */}
      <h1 className="title">Baking Basics</h1>

      {/* Poster */}
      <div className="poster-container">
        <img src={bakingRatioPoster} alt="Baking Ratio Poster" className="poster" />
      </div>

      {/* Additional Information */}
      <div className="info-section">
        <h2>Understanding Baking Ratios</h2>
        <p>
          Baking is all about <strong>ratios</strong>! Mastering these helps you adjust recipes with confidence.
          The secret to perfect baked goods lies in the balance of <strong>flour, liquid, fat, and eggs</strong>.
        </p>

        <h2>Why Baking Ratios Matter?</h2>
        <ul>
          <li>📏 <strong>Precision</strong> – Small changes in ingredient ratios can transform textures.</li>
          <li>🔬 <strong>Science-Based</strong> – The right balance ensures structure, moisture, and taste.</li>
          <li>🎨 <strong>Creativity</strong> – Understanding ratios lets you invent new recipes!</li>
        </ul>

        <h2>Key Baking Ratios to Remember</h2>
        <p>Here are some essential ratios for common baked goods:</p>
        <ul>
          <li>🍞 <strong>Bread</strong> – 5:3 (Flour:Liquid)</li>
          <li>🍪 <strong>Cookies</strong> – 3:2:1 (Flour:Fat:Sugar)</li>
          <li>🧁 <strong>Muffins</strong> – 2:2:1:1 (Flour:Liquid:Fat:Eggs)</li>
          <li>🍰 <strong>Pound Cake</strong> – 1:1:1:1 (Flour:Sugar:Butter:Eggs)</li>
        </ul>

        <p>Master these ratios, and you’ll become a **baking pro** in no time! 🎂👩‍🍳</p>
      </div>
    </div>
  );
};

export default BakingBasics;
