import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCaramelizeOnions.css";  // Import CSS
import onionRecipe from "../assets/caramelized-onion-recipe.png";  // Image file

const CaramelizingOnions = () => {
    return (
      <div className="onion-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">Caramelizing Onions for Rich Flavor</h1>
  
        <div className="poster-container">
          <img src={onionRecipe} alt="Caramelizing Onions Poster" className="poster" />
        </div>
  
        <div className="info-section">
          <h2>Why Caramelize Onions?</h2>
          <p>Caramelizing onions brings out their natural sweetness, creating a rich, deep flavor that adds depth to your dishes. 🧅</p>
          <p>With patience and the right technique, you’ll be able to enjoy perfectly caramelized onions that are golden and sweet. 🧅</p>
  
          <h2>Steps to Caramelize Onions</h2>
          <ul>
            <li>🧅 <strong>Slice the Onions</strong> – Peel and thinly slice the onions into rings or half moons.</li>
            <li>🔥 <strong>Heat the Pan</strong> – Place a large skillet over medium-low heat and add a couple of tablespoons of olive oil or butter.</li>
            <li>🌿 <strong>Add Onions</strong> – Add the sliced onions to the pan and stir to coat evenly with the fat.</li>
            <li>⏳ <strong>Cook Slowly</strong> – Stir occasionally, letting the onions cook low and slow for about 30-40 minutes until golden and sweet.</li>
            <li>⚖️ <strong>Season and Adjust Heat</strong> – Add salt and a little sugar to enhance caramelization. If they start to burn, lower the heat and add a splash of water to deglaze the pan.</li>
            <li>👌 <strong>Finish and Serve</strong> – Once they’re beautifully caramelized, remove them from the heat and serve on top of burgers, in sauces, or as a side dish!</li>
          </ul>
  
          <h2>Caramelizing Tips</h2>
          <ul>
            <li>⏰ Patience is key – don’t rush the process! Low and slow will give you the best results.</li>
            <li>🔥 Stir frequently to prevent burning and ensure even caramelization.</li>
            <li>🍯 If you prefer extra sweetness, add a teaspoon of brown sugar halfway through cooking.</li>
          </ul>
  
          <p>Enjoy the sweet, savory goodness of perfectly caramelized onions! 🧅</p>
        </div>
      </div>
    );
  };
  
  export default CaramelizingOnions;
  