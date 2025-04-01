import React from "react";
import { Link } from "react-router-dom";
import "../HowtoSeasoning.css";  // Import CSS
import seasoningImage from "../assets/seasoning-recipe.png";  // Image file

const SeasoningFood = () => {
  return (
    <div className="seasoning-container">
      <div className="back-link">
        <Link to="/how-to-guides">← Back to How-To Guides</Link>
      </div>
      <h1 className="title">How to Season Your Food</h1>

      <div className="poster-container">
        <img src={seasoningImage} alt="Seasoning Guide" className="poster" />
      </div>

      <div className="info-section">
        <h2>Why Seasoning is Important</h2>
        <p>Seasoning is an essential step in cooking that enhances the natural flavors of your ingredients and balances the dish.</p>
        <p>Here are several ways to add flavor to your food, from basic to more complex seasoning techniques. 🧂</p>

        <h2>Steps to Season Your Food</h2>
        <ul>
          <li>🌱 <strong>Herb Seasoning</strong> – Fresh herbs such as basil, thyme, rosemary, and parsley can be used to add freshness to your dish. Add them at the end of cooking to preserve their flavor.</li>
          <li>🧄 <strong>Garlic and Onion Seasoning</strong> – Garlic and onions are the foundation of many savory dishes. Sautéing them in oil or butter adds depth to your dish.</li>
          <li>🌶️ <strong>Spices</strong> – Ground spices like cumin, paprika, chili powder, and cinnamon add warmth and complexity. Be careful to balance strong spices with other seasonings.</li>
          <li>🧂 <strong>Salt and Pepper</strong> – The basics! Salt helps to bring out the natural flavors in your ingredients, while black pepper adds a bit of heat. Season as you go while cooking to layer flavors.</li>
          <li>🍋 <strong>Acidic Seasoning</strong> – A splash of vinegar, lemon juice, or lime can brighten up your dish and balance richness. Use sparingly.</li>
          <li>🧴 <strong>Seasoning Blends</strong> – Pre-made seasoning blends, like Italian seasoning, curry powder, or taco seasoning, are convenient and add instant flavor. Use them to elevate your dish without extra effort.</li>
        </ul>

        <h2>Seasoning Tips</h2>
        <ul>
          <li>⚖️ Always season in stages – Add a little salt and pepper at the start of cooking, and adjust as you go.</li>
          <li>🌿 Fresh herbs should be added towards the end of cooking, while dried herbs are best added early to release their flavors.</li>
          <li>🌶️ Spice levels vary, so start with a small amount of hot spices (e.g., chili flakes) and taste before adding more.</li>
          <li>🥄 Don't forget to taste your dish as you go to ensure balance between salty, sweet, sour, and spicy.</li>
        </ul>

        <p>By mastering the art of seasoning, you'll be able to take any dish to the next level! 🌟</p>
      </div>
    </div>
  );
};

export default SeasoningFood;
