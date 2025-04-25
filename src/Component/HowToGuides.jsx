import React, { useState } from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
import "../HowToGuides.css";
import { useLanguage } from "../translator/Languagecontext";
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
const HowToGuides = () => {

  const { t } = useLanguage();


const guides = [
  {
   title: t("bakingBasicsTitle"),
    description: t("bakingBasicsDesc"),
    guideIcon: cupcakeIcon,
    recipeImage: cupcakeRecipe,
    link: "/baking-basics",
  },
  {
    title:  t("grilling_title"),
    description: t("grilling_title"),
    guideIcon: grillChickenIcon,
    recipeImage: grillChickenRecipe,
    link: "/grilling-techniques",
  },
  {
    title: t("knifeSkills_title"),
    description: t("knifeSkills_description"),
    guideIcon: knifeIcon,
    recipeImage: knifeSkillsRecipe,
    link: "/knife-skills",
  },
  {
    title: t("perfectPasta_title"),
    description: t("perfectPasta_description"),
    guideIcon: pastaIcon,
    recipeImage: pastaRecipe,
    link: "/perfect-pasta",
  },
  {
    title:  t("fluffyPancakes_title"),
    description: t("fluffyPancakes_description"),
    guideIcon: pancakeIcon,
    recipeImage: pancakeRecipe,
    link: "/fluffy-pancakes",
  },
  {
    title: t("homemadeBread_title"), // 1
    description: t("homemadeBread_description"),
    guideIcon: breadIcon,
    recipeImage: breadRecipe,
    link: "/homemade-bread",
  },
  {
    title:  t("caramelizedOnions_title"), // 2
    description: t("caramelizedOnions_description"),
    guideIcon: onionIcon,
    recipeImage: onionRecipe,
    link: "/caramelized-onions",
  },
  {
    title:  t("stirFry_title"), // 3
    description:  t("stirFry_description"),
    guideIcon: stirfryIcon,
    recipeImage: stirfryRecipe,
    link: "/stirfry",
  },
  {
    title:  t("simpleCake_title"), // 4
    description: t("simpleCake_description"),
    guideIcon: cakeIcon,
    recipeImage: cakeRecipe,
    link: "/baking-cake",
  },
  {
    title: t("cookEggs_title"), // 5
    description: t("cookEggs_description"),
    guideIcon: eggIcon,
    recipeImage: eggRecipe,
    link: "/cooking-eggs"
  },
  {
    title: t("perfectSteak_title"), // 6
    description:t("perfectSteak_description"),
    guideIcon: steakIcon,
    recipeImage: steakRecipe,
    link: "/cooking-steak",
  },
  {
    title: t("cookRice_title"), // 7
    description: t("cookRice_description"),
    guideIcon: riceIcon,
    recipeImage: riceRecipe,
    link: "/cooking-rice",
  },
  {
    title: t("filletFish_title"), // 8
    description:  t("filletFish_description"),
    guideIcon: fishIcon,
    recipeImage: fishRecipe,
    link: "/fillet-fish",
  },
  {
    title: t("sharpenKnives_title"), // 9
    description: t("sharpenKnives_title"),
    guideIcon: knifeIcon,
    recipeImage: knifeRecipe,
    link: "/sharpen-knife",
  },
  {
    title:  t("seasoningBasics_title"), // 10
    description: t("seasoningBasics_description"),
    guideIcon: seasoningIcon,
    recipeImage: seasoningRecipe,
    link: "/seasoning",
  },
];


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
        <h1>{t('howToGuides')}</h1>
        <p className="howto-subheading">{t('guidesDescription')}</p>
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
                <p>{t('guidePoster')}</p>
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
