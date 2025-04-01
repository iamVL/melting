import React from "react";
import { Link } from "react-router-dom";
import "../HowtoFilletFish.css";  // Import CSS
import fishRecipe from "../assets/FilletFish-recipe.png";  // Image file

const FilletFish = () => {
    return (
      <div className="fish-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">How to Fillet Fish</h1>
  
        <div className="poster-container">
          <img src={fishRecipe} alt="Fillet Fish Poster" className="poster" />
        </div>
  
        <div className="info-section">
          <h2>Why Learn to Fillet Fish?</h2>
          <p>Filleting a fish can provide you with clean, boneless fillets, making it easier to cook and enjoy. 🐟</p>
  
          <h2>Steps to Fillet a Fish</h2>
          <ul>
            <li>🔪 <strong>Prepare the Fish</strong> – Place the fish on a non-slip surface, and always use a sharp fillet knife while cutting away from yourself for safety.</li>
            <li>🦈 <strong>Make Initial Cut</strong> – Behind the gills and pectoral fin, make an incision down to the backbone to begin the filleting process.</li>
            <li>🔄 <strong>Use Backbone as Guide</strong> – Turn the knife horizontally, using the backbone as a guide, and cut all the way down toward the tail.</li>
            <li>🔁 <strong>Repeat on the Other Side</strong> – Flip the fish over and repeat the process to remove the other fillet.</li>
            <li>✂️ <strong>Remove Skin</strong> – To remove the skin, make an incision half an inch up from the tail-end and slice carefully between the flesh and skin while always cutting away from yourself.</li>
            <li>🔍 <strong>Remove Pin Bones</strong> – Use tweezers to carefully pull out any remaining pin bones in the fillets.</li>
          </ul>
  
          <h2>Filleting Tips</h2>
          <ul>
            <li>🔪 Use a flexible, sharp fillet knife to ensure clean cuts and minimize waste.</li>
            <li>🧼 Keep your work surface clean and steady to avoid any accidents.</li>
            <li>⏳ If you’re new to filleting, start with a smaller fish to practice your technique before moving to larger fish.</li>
          </ul>
  
          <p>With these techniques, you’ll fillet fish like a professional in no time! 🐟</p>
        </div>
      </div>
    );
  };
  
  export default FilletFish;
