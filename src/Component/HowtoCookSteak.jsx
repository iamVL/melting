import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCookSteak.css";  // Import CSS
import steakRecipe from "../assets/cook-steak-recipe.png";  // Image file

const CookSteak = () => {
    return (
      <div className="steak-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">How to Cook the Perfect Steak</h1>

        <div className="poster-container">
          <img src={steakRecipe} alt="Cook Steak Poster" className="poster" />
        </div>

        <div className="info-section">
          <h2>Why Steak Doneness Matters</h2>
          <p>Steak is best enjoyed when cooked to your preferred doneness, balancing tenderness and flavor. Whether you like it rare or well-done, proper technique is key to perfection. 🥩</p>
          <p>Look at the visual above to look at what the steak should look like.</p>

          <h2>Steps to Cook the Perfect Steak</h2>
          <ul>
            <li>🧂 <strong>Season Generously</strong> – Pat the steak dry, then coat with salt and pepper. Let it sit at room temperature for 20-30 minutes.</li>
            <li>🔥 <strong>Preheat the Pan</strong> – Use a heavy skillet or cast iron pan over high heat until it’s smoking hot.</li>
            <li>🥄 <strong>Add Oil</strong> – Use a high smoke point oil like canola or avocado oil.</li>
            <li>🥩 <strong>Sear the Steak</strong> – Place the steak in the hot pan and sear for 2-3 minutes per side for medium-rare. Avoid moving it too much.</li>
            <li>🌡️ <strong>Check the Temperature</strong> – Use an instant-read thermometer:
              <ul>
                <li>Rare: 125°F (52°C)</li>
                <li>Medium Rare: 135°F (57°C)</li>
                <li>Medium: 145°F (63°C)</li>
                <li>Medium Well: 150°F (66°C)</li>
                <li>Well Done: 160°F (71°C)</li>
              </ul>
            </li>
            <li>🧈 <strong>Baste with Butter</strong> – Add a pat of butter, garlic, and herbs like rosemary, and baste the steak while cooking.</li>
            <li>⏲️ <strong>Rest the Steak</strong> – Let it rest on a plate, covered loosely with foil, for 5 minutes before slicing.</li>
            <li>🔪 <strong>Slice Against the Grain</strong> – For maximum tenderness.</li>
          </ul>

          <h2>Cooking Tips</h2>
          <ul>
            <li>🧈 Basting with butter and herbs adds richness and depth of flavor.</li>
            <li>🪵 Letting the steak rest allows juices to redistribute, making it more tender.</li>
            <li>⚖️ Adjust cooking time based on the thickness of the steak.</li>
          </ul>

          <p>Enjoy your perfectly cooked steak with your favorite sides! 🍽️</p>
        </div>
      </div>
    );
  };

export default CookSteak;

