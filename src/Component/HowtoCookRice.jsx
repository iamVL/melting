import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCookRice.css";  // Import CSS
import riceRecipe from "../assets/rice-recipe.png";  // Image file

const CookRice = () => {
    return (
      <div className="rice-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">Cooking Rice Without a Rice Cooker</h1>

        <div className="poster-container">
          <img src={riceRecipe} alt="Cooking Rice Poster" className="poster" />
        </div>

        <div className="info-section">
          <h2>Why Cook Rice on the Stove?</h2>
          <p>Cooking rice on the stove is a great way to master texture and flavor without needing a rice cooker. 🍚</p>
          <p>With the right technique, you’ll have fluffy, delicious rice every time!</p>

          <h2>Steps to Cook Rice on the Stove</h2>
          <ul>
            <li>🥣 <strong>Rinse the Rice</strong> – Rinse your rice under cold water to remove excess starch.</li>
            <li>💧 <strong>Measure and Boil</strong> – Use a 1:2 ratio of rice to water. Bring the water to a boil in a medium-sized pot.</li>
            <li>🍚 <strong>Add Rice</strong> – Add the rinsed rice to the boiling water and reduce the heat to low.</li>
            <li>🔗 <strong>Cover and Simmer</strong> – Cover the pot with a tight-fitting lid and simmer for 15-20 minutes, or until the water is absorbed.</li>
            <li>⏲️ <strong>Let It Rest</strong> – Turn off the heat and let the rice sit, covered, for 5-10 minutes to finish steaming.</li>
            <li>🍽️ <strong>Fluff and Serve</strong> – Use a fork to fluff the rice before serving.</li>
          </ul>

          <h2>Rice Cooking Tips</h2>
          <ul>
            <li>🔍 Check the water level halfway through cooking to ensure it doesn’t dry out.</li>
            <li>🌾 Use broth instead of water for added flavor.</li>
            <li>🍋 A splash of lemon juice can help keep the rice from sticking together.</li>
          </ul>

          <p>Enjoy your perfectly cooked rice! 🍚</p>
        </div>
      </div>
    );
};

export default CookRice;
