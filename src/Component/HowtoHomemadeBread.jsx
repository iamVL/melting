import React from "react";
import { Link } from "react-router-dom";
import "../HowtoHomemadeBread.css";  // Import CSS
import breadRecipe from "../assets/bread-recipe.png";  // Image file

const HomemadeBread = () => {
    return (
      <div className="bread-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div> 
        <h1 className="title">Homemade Bread from Scratch</h1>
  
        <div className="poster-container">
          <img src={breadRecipe} alt="Homemade Bread Poster" className="poster" /> 
        </div>
  
        <div className="info-section">
          <h2>Why Make Homemade Bread?</h2>
          <p>Discover the joy of baking your own bread from scratch! It’s fresher, tastier, and more satisfying than store-bought loaves. 🍞</p>
          <p>Gather your basic baking ingredients and tools to get started on fresh, fluffy bread! 🍞</p>

          <h2>Steps to Make Homemade Bread</h2>
          <ul>
            <li>🍞 <strong>Mix Ingredients</strong> – Combine flour, a pinch of salt, and a tablespoon of oatmeal in a bowl.</li>
            <li>💧 <strong>Activate Yeast</strong> – Stir the yeast in a glass of warm water until dissolved.</li>
            <li>🫒 <strong>Add Yeast and Oil</strong> – Pour the yeast mixture and a splash of oil into the dry ingredients.</li>
            <li>🥄 <strong>Knead the Dough</strong> – Turn out onto a floured surface and knead until smooth and elastic, about 10 minutes.</li>
            <li>⏲️ <strong>Let It Rest</strong> – Cover the dough and let it sit for 40 minutes to rise.</li>
            <li>🔥 <strong>Proof and Bake</strong> – Preheat the oven to 122°F (50°C) and place the dough inside to rise further. Once risen, increase the temperature to 356°F (180°C) and bake for 25-30 minutes.</li>
            <li>🌬️ <strong>Cool and Serve</strong> – Let it cool on a wire rack before slicing.</li>
          </ul>
  
          <h2>Baking Tips</h2>
          <ul>
            <li>🌡️ Ensure the water temperature is just warm, not hot, to activate the yeast.</li>
            <li>👌 Proper kneading develops gluten, giving your bread structure and texture.</li>
            <li>🥖 Letting the dough rise in a warm, draft-free area ensures good volume.</li>
          </ul>
  
          <p>Enjoy the satisfying aroma and taste of freshly baked homemade bread! 🍞</p>
        </div>
      </div>
    );
  };
  
  export default HomemadeBread;