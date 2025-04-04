import React from "react";
import { Link } from "react-router-dom";
import "../KnifeSkills.css";  // Import CSS
import knifePoster from "../assets/knife-skills-recipe.png";  // Image file

const KnifeSkills = () => {
  return ( 
    <div className="knife-container">
      <div className="back-link">
        <Link to="/how-to-guides">← Back to How-To Guides</Link>
      </div>

      <h1 className="title">Knife Skills 101</h1> 

      <div className="poster-container">
        <img src={knifePoster} alt="Knife Skills Poster" className="poster" />
      </div>

      <div className="info-section">
        <h2>Essential Knife Cuts</h2>
        <p>Master these knife techniques and level up your cooking skills! 🔪</p>

        <h2>Types of Cuts</h2>
        <ul>
          <li>🥕 <strong>Julienne</strong> – Thin matchstick cuts (great for stir-fries).</li>
          <li>🍅 <strong>Brunoise</strong> – Tiny, precise dice (perfect for garnishes).</li>
          <li>🥔 <strong>Chiffonade</strong> – Thinly sliced herbs or leafy greens.</li>
          <li>🥩 <strong>Chop</strong> – Large or small, uniform cuts.</li>
          <li>🍍 <strong>Dice</strong> – Small, medium, or large cube shapes.</li>
        </ul>

        <h2>Knife Handling Tips</h2>
        <ul>
          <li>🔪 Use a <strong>sharp knife</strong> – Dull knives are more dangerous.</li>
          <li>🛑 Keep fingers tucked in – Use a "claw grip" for safety.</li>
          <li>🚿 Clean and dry knives immediately – Prevents rusting.</li>
          <li>🪵 Use a <strong>stable cutting board</strong> – Prevents slipping.</li>
        </ul>

        <p>Practice these techniques and become a **pro chef in no time**! 🎉</p>
      </div>
    </div>
  );
};

export default KnifeSkills;
