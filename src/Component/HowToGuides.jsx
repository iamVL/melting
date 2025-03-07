import React, { useState } from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
import "../HowToGuides.css";
import cupcakeIcon from "../assets/cupcake.png";  
import grillChickenIcon from "../assets/grill-chicken.png";  
import knifeIcon from "../assets/knife-skills.png";
import pastaIcon from "../assets/pasta-guide.png";
import pancakeIcon from "../assets/pancake-guide.png";
import commentIcon from "../assets/comment-icon.png";  
import cupcakeRecipe from "../assets/cupcake-recipe.png";  
import grillChickenRecipe from "../assets/grill-chicken-recipe.png";  
import knifeSkillsRecipe from "../assets/knife-skills-recipe.png";
import pastaRecipe from "../assets/pasta-recipe.png";
import pancakeRecipe from "../assets/pancake-recipe.png";

const guides = [
  {
    title: "Baking Basics",
    description: "Learn the Essentials of Baking at Home",
    guideIcon: cupcakeIcon,
    recipeImage: cupcakeRecipe,
    link: "/baking-basics",
  },
  {
    title: "Grilling Techniques",
    description: "Master the Art of Grilling",
    guideIcon: grillChickenIcon,
    recipeImage: grillChickenRecipe,
    link: "/grilling-techniques",
  },
  {
    title: "Knife Skills 101",
    description: "Learn how to chop, dice, and julienne like a pro!",
    guideIcon: knifeIcon,
    recipeImage: knifeSkillsRecipe,
    link: "/knife-skills",
  },
  {
    title: "Perfect Pasta Guide",
    description: "Cook pasta perfectly every time with these simple tricks.",
    guideIcon: pastaIcon,
    recipeImage: pastaRecipe,
    link: "/perfect-pasta",
  },
  {
    title: "Fluffy Pancakes Secrets",
    description: "Discover the science behind the fluffiest pancakes ever!",
    guideIcon: pancakeIcon,
    recipeImage: pancakeRecipe,
    link: "/fluffy-pancakes",
  }
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
              <h3>
                <Link to={guide.link} className="guide-link">{guide.title}</Link>
              </h3>
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

      {fullScreenImage && (
        <div className="full-screen-overlay" onClick={closeFullScreen}>
          <img src={fullScreenImage} alt="Recipe" className="full-screen-image" />
        </div>
      )}
    </div>
  );
};

export default HowToGuides;
