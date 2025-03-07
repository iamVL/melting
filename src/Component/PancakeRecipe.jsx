import React from "react";
import { Link } from "react-router-dom";
import "../PancakeRecipe.css";  // Import CSS
import pancakePoster from "../assets/pancake-recipe.png";  // Image file

const PancakeRecipe = () => {
  return (
    <div className="pancake-container">
      <div className="back-link">
        <Link to="/how-to-guides">← Back to How-To Guides</Link>
      </div>

      <h1 className="title">Pancake Recipe</h1>

      <div className="poster-container">
        <img src={pancakePoster} alt="Pancake Recipe Poster" className="poster" />
      </div>

      <div className="info-section">
        <h2>Fluffy Pancake Secrets</h2>
        <p>Want the fluffiest pancakes ever? Follow this guide and become a pancake master! 🥞</p>

        <h2>Key Ingredients</h2>
        <ul>
          <li>🌾 Flour – Forms the base of the batter</li>
          <li>🥚 Eggs – Adds structure and fluffiness</li>
          <li>🥛 Milk – Ensures the perfect batter consistency</li>
          <li>🍯 Sugar – Balances sweetness</li>
          <li>🧈 Butter – Gives a rich, creamy taste</li>
          <li>🌡️ Baking Powder – The secret to fluffy pancakes!</li>
        </ul>

        <h2>Step-by-Step Instructions</h2>
        <ul>
          <li>🥄 Mix dry ingredients in one bowl and wet ingredients in another.</li>
          <li>🎨 Gently fold the wet mix into the dry mix until just combined.</li>
          <li>🔥 Heat a pan over medium-low heat and lightly grease it.</li>
          <li>🥄 Pour batter into small circles and cook until bubbles form.</li>
          <li>🔄 Flip and cook for another 1-2 minutes.</li>
          <li>🍯 Serve with syrup, fruit, or toppings of choice.</li>
        </ul>

        <p>Enjoy your **homemade pancakes** like a pro! 🎉</p>
      </div>
    </div>
  );
};

export default PancakeRecipe;
