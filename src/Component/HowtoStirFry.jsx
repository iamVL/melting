import React from "react";
import { Link } from "react-router-dom";
import "../HowtoStirFry.css";  // Import CSS
import stirFryRecipe from "../assets/stirfry-recipe.png"

const StirFrying = () => {
    return (
      <div className="stirfry-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">Stir Frying for Quick and Flavorful Meals</h1>
  
        <div className="poster-container">
          <img src={stirFryRecipe} alt="Stir Frying Poster" className="poster" />
        </div>
  
        <div className="info-section">
          <h2>Why Stir Fry?</h2>
          <p>Stir frying is a fast and versatile cooking technique that locks in flavor and freshness. 🍜</p>
          <p>With the right technique, you can whip up delicious and healthy meals in just minutes! 🥢</p>
  
          <h2>Steps to Stir Fry</h2>
          <ul>
            <li>🔥 <strong>Heat the Pan/Wok</strong> – Preheat a pan or wok over high heat. Use a spatula to ensure even heating.</li>
            <li>🛢️ <strong>Add Oil</strong> – Pour in a small amount of high smoke point oil (like vegetable or peanut oil) and swirl to coat the pan.</li>
            <li>🌿 <strong>Add Aromatics</strong> – Toss in aromatics like garlic, ginger, or onions and stir quickly to release their flavors.</li>
            <li>🍗 <strong>Stir-Fry Proteins</strong> – Add your protein (like chicken, beef, tofu, or shrimp) and stir-fry until it’s mostly cooked through.</li>
            <li>🥕 <strong>Add Vegetables</strong> – Add your veggies in order of cooking time, starting with harder ones like carrots and finishing with quick-cooking ones like bell peppers.</li>
            <li>🍜 <strong>Add Rice or Noodles</strong> – Toss in cooked rice or noodles and break up any clumps while mixing thoroughly.</li>
            <li>🥢 <strong>Add Sauces</strong> – Pour in your sauce mixture (like soy sauce, oyster sauce, or stir-fry sauce) and stir to coat everything evenly.</li>
            <li>✨ <strong>Final Stir and Serve</strong> – Give one final stir to ensure even coating and flavor distribution, then remove from heat.</li>
            <li>🌿 <strong>Garnish</strong> – Top with fresh herbs, sesame seeds, or a squeeze of lime before serving.</li>
          </ul>
  
          <h2>Stir Fry Tips</h2>
          <ul>
            <li>💨 Keep ingredients moving constantly to prevent burning and ensure even cooking.</li>
            <li>🔥 High heat is essential for a quick sear and maintaining texture.</li>
            <li>🥢 Don’t overcrowd the pan – stir fry in batches if needed.</li>
          </ul>
  
          <p>Mastering stir frying means enjoying vibrant, flavorful dishes in no time! 🍲</p>
        </div>
      </div>
    );
  };
  
  export default StirFrying;
  