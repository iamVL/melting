import React, { useState } from "react";
import "../HowToGuides.css";
import cupcakeIcon from "../assets/cupcake.png";  
import grillChickenIcon from "../assets/grill-chicken.png";  
import commentIcon from "../assets/comment-icon.png";  
import cupcakeRecipe from "../assets/cupcake-recipe.png";  
import grillChickenRecipe from "../assets/grill-chicken-recipe.png";  


const guides = [
  {
    title: "Baking Basics",
    description: "Learn the Essentials of Baking at Home",
    guideIcon: cupcakeIcon,
    recipeImage: cupcakeRecipe,  // Image that opens full screen
  },
  {
    title: "Grilling Techniques",
    description: "Master the Art of Grilling",
    guideIcon: grillChickenIcon,
    recipeImage: grillChickenRecipe,  // Image that opens full screen
  },
];

const HowToGuides = () => {
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const openFullScreen = (image) => {
    setFullScreenImage(image);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="howto-container">
      <header className="howto-header">
        <h1>“How-to” Guides</h1>
      </header>

      <div className="howto-guides">
        {guides.map((guide, index) => (
          <div key={index} className="guide-card">
            <div className="guide-info">
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </div>
            <div className="guide-icons">
              <span className="icon guide" onClick={() => openFullScreen(guide.recipeImage)}>
                <img src={guide.guideIcon} alt="Guide Poster" />
                <p>Guide Poster</p>
              </span>
              <span className="icon comment">
                <img src={commentIcon} alt="Comments Section" />
                <p>Comments Section</p>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Image Viewer */}
      {fullScreenImage && (
        <div className="full-screen-overlay" onClick={closeFullScreen}>
          <img src={fullScreenImage} alt="Recipe" className="full-screen-image" />
        </div>
      )}
    </div>
  );
};

export default HowToGuides;
