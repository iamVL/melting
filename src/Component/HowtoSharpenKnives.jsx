import React from "react";
import { Link } from "react-router-dom";
import "../HowtoSharpenKnives.css";  // Import CSS
import knifeSharpeningImage from "../assets/sharpen-knives-recipe.png";  // Image file

const SharpenKnives = () => {
    return (
      <div className="sharpen-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">How to Sharpen Knives Properly</h1>
  
        <div className="poster-container">
          <img src={knifeSharpeningImage} alt="Knife Sharpening Poster" className="poster" />
        </div>
  
        <div className="info-section">
          <h2>Why Sharpen Knives?</h2>
          <p>Sharpening knives regularly ensures you get precise cuts and reduces the risk of accidents from dull blades. 🔪</p>
          <p>Learn how to properly maintain your knives to keep them sharp, effective, and safe to use. 🪓</p>
  
          <h2>Steps to Sharpen Knives</h2>
          <ul>
            <li>🔪 <strong>Choose Your Sharpening Tool</strong> – You can use a sharpening stone, honing steel, or a knife sharpener.</li>
            <li>💦 <strong>Prep the Stone</strong> – If using a sharpening stone, soak it in water for about 10 minutes before use.</li>
            <li>⚖️ <strong>Angle the Knife</strong> – Hold the knife at a 20-degree angle against the sharpening tool.</li>
            <li>🌀 <strong>Sharpen the Blade</strong> – Using a steady motion, slide the knife along the stone or sharpener from heel to tip, alternating sides.</li>
            <li>💧 <strong>Rinse and Test</strong> – Rinse the knife and carefully test the sharpness by slicing through a piece of paper or vegetable.</li>
            <li>🔄 <strong>Repeat and Hone</strong> – If necessary, repeat the sharpening process and use a honing steel for final alignment.</li>
          </ul>
  
          <h2>Sharpening Tips</h2>
          <ul>
            <li>⚡ Always maintain the correct angle to avoid damaging the blade.</li>
            <li>🔥 For finer results, use finer grit sharpening stones and work through different grits progressively.</li>
            <li>🚿 Keep the knife clean and dry after sharpening to maintain its longevity.</li>
          </ul>
  
          <p>With the right technique and tools, your knives will stay sharp and safe for everyday use! 🔪</p>
        </div>
      </div>
    );
  };
  
  export default SharpenKnives;
