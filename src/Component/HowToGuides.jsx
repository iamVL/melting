import React, { useState } from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
import "../HowToGuides.css";
import cupcakeIcon from "../assets/cupcake.png";  
import grillChickenIcon from "../assets/grill-chicken.png";  
import knifeIcon from "../assets/knife-skills.png";
import pastaIcon from "../assets/pasta-guide.png";
import pancakeIcon from "../assets/pancake-guide.png";
import breadIcon from "../assets/bread-icon.jpg";
import onionIcon from "../assets/caramelized-onion-icon.png"
import stirfryIcon from "../assets/stirfry-Icon.png";
import cakeIcon from "../assets/bake-cake-icon.png"
import eggIcon from "../assets/eggs-icon.png";
import steakIcon from "../assets/cook-steak-icon.png";
import riceIcon from "../assets/rice-icon.png";
import fishIcon from "../assets/FilletFish-icon.png";
import seasoningIcon from "../assets/seasoning-icon.png";

import cupcakeRecipe from "../assets/cupcake-recipe.png";  
import grillChickenRecipe from "../assets/grill-chicken-recipe.png";  
import knifeSkillsRecipe from "../assets/knife-skills-recipe.png";
import pastaRecipe from "../assets/pasta-recipe.png";
import pancakeRecipe from "../assets/pancake-recipe.png";
import breadRecipe from "../assets/bread-recipe.png";
import onionRecipe from "../assets/caramelized-onion-recipe.png";
import stirfryRecipe from "../assets/stirfry-recipe.png";
import cakeRecipe from "../assets/bake-cake-recipe.png";
import eggRecipe from "../assets/eggs-recipe.png";
import steakRecipe from "../assets/cook-steak-recipe.png";
import riceRecipe from "../assets/rice-recipe.png";
import fishRecipe from "../assets/FilletFish-recipe.png";
import knifeRecipe from "../assets/sharpen-knives-recipe.png";
import seasoningRecipe from "../assets/seasoning-recipe.png";


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
  },
  {
    title: "Homemade Bread from Scratch", // 1
    description: "A guide to making soft, fluffy, and flavorful bread without a bread machine.",
    guideIcon: breadIcon,
    recipeImage: breadRecipe,
    link: "/homemade-bread",
  },
  {
    title: "How to Caramelize Onions for Rich Flavor", // 2
    description: "Transform onions into a sweet, golden topping with slow, gentle cooking!",
    guideIcon: onionIcon,
    recipeImage: onionRecipe,
    link: "/caramelized-onions",
  },
  {
    title: "Building the Ultimate Stir-Fry", // 3
    description: "Learn the secrets to making a quick, healthy, and flavorful stir-fry with perfectly cooked vegetables and proteins.",
    guideIcon: stirfryIcon,
    recipeImage: stirfryRecipe,
    link: "/stirfry",
  },
  {
    title: "How to Bake a Simple Cake", // 4
    description: "A guide to baking light, fluffy cakes with the perfect crumb structure, along with tips on frosting and decorating.",
    guideIcon: cakeIcon,
    recipeImage: cakeRecipe,
    link: "/baking-cake",
  },
  {
    title: "Different Ways to Cook Eggs", // 5
    description: "Have you thought about how many ways you could cook eggs? Click on this guide to find out the most common ways!",
    guideIcon: eggIcon,
    recipeImage: eggRecipe,
    link: "/cooking-eggs"
  },
  {
    title: "How to Cook the Perfect Steak", // 6
    description: "Achieve the perfect steak doneness every time with these simple steps and tips!",
    guideIcon: steakIcon,
    recipeImage: steakRecipe,
    link: "/cooking-steak",
  },
  {
    title: "How to Cook Rice Without a Rice Cooker", // 7
    description: "Follow this simple how-to guide to cook rice without a rice cooker!",
    guideIcon: riceIcon,
    recipeImage: riceRecipe,
    link: "/cooking-rice",
  },
  {
    title: "How to Fillet Fish", // 8
    description: "Filleting fish can be really hard for first timers. Follow this guide to learn how to do it properly!",
    guideIcon: fishIcon,
    recipeImage: fishRecipe,
    link: "/fillet-fish",
  },
  {
    title: "How to Sharpen Knives Properly", // 9
    description: "Learn how to sharpen your knives with this guide!",
    guideIcon: knifeIcon,
    recipeImage: knifeRecipe,
    link: "/sharpen-knife",
  },
  {
    title: "Seasoning for Beginners", // 10
    description: "Seasoning can enhance your food dramatically. Follow these basic steps!",
    guideIcon: seasoningIcon,
    recipeImage: seasoningRecipe,
    link: "/seasoning",
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
        <h1>How-to Guides</h1>
        <p className="howto-subheading">Follow these guides created by the owners of The Melting Pot!</p>
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
