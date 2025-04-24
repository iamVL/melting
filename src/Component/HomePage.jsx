import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom"; // Import Link for navigation
import LoginForm from "./LoginForm";
import "../HomePage.css";
import Homephoto from "../assets/Homephoto.jpeg";
import { useLanguage } from "../translator/Languagecontext";



// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffle = (array) => {
 let currentIndex = array.length, randomIndex;

 while (currentIndex !== 0) {
   randomIndex = Math.floor(Math.random() * currentIndex);
   currentIndex--;
   [array[currentIndex], array[randomIndex]] = [
     array[randomIndex], array[currentIndex]];
 }


 return array;
};


const HomePage = ({ isLoggedIn, setLoggedIn, doRefreshPosts, appRefresh }) => {
 const [userToken, setUserToken] = useState("");
 const [randomTips, setRandomTips] = useState([]);
 const [randomRecipes, setRandomRecipes] = useState([]);

 const { t } = useLanguage();

 const navigate = useNavigate();



 // 🔥 NEW STATE FOR LEVEL FILTERING
 const [selectedLevel, setSelectedLevel] = useState("easy");
 const [filteredRecipes, setFilteredRecipes] = useState([]);


 useEffect(() => {
   const token = sessionStorage.getItem("token");
   setUserToken(token);
   if (token) {
     fetchRandomTips(token);
     fetchRandomRecipes(token);
   }


   window.scrollTo(0, 0);
 }, []);


 useEffect(() => {
   if (randomRecipes.length > 0) {
     filterRecipesByLevel(selectedLevel);
   }
 }, [randomRecipes, selectedLevel]);


 // 🔥 FILTER FUNCTION FOR RECIPE LEVEL
 const filterRecipesByLevel = (level) => {
   console.log("Selected Level:", level);
   console.log("All recipes:", randomRecipes);
    const levelFiltered = randomRecipes
     .filter(recipe => {
       console.log("Full recipe attributes:", recipe.attributes);
       return recipe.attributes?.difficulty?.toLowerCase() === level.toLowerCase();
     })
     .sort((a, b) => b.attributes?.rating - a.attributes?.rating)
     .slice(0, 4);
    console.log("Filtered Recipes:", levelFiltered);
   setFilteredRecipes(levelFiltered);
 };
  const fetchRandomRecipes = async (token) => {
   try {
     const response = await fetch(
       `${process.env.REACT_APP_API_PATH}/posts`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
       }
     );


     if (response.ok) {
       const data = await response.json();
       let recipes = [];


       if (Array.isArray(data)) {
         recipes = data[0].filter((post) => post.attributes?.postType === "recipe");
       } else if (data.posts) {
         recipes = data.posts.filter((post) => post.attributes?.postType === "recipe");
       }

       console.log(recipes.length);
       const randomRecipesSelected = shuffle([...recipes]);
       setRandomRecipes(randomRecipesSelected);
     } else {
       console.error("Failed to fetch recipes, status:", response.status);
     }
   } catch (error) {
     console.error("Error fetching recipes:", error);
   }
 };


 const fetchRandomTips = async (token) => {
   try {
     const response = await fetch(
       `${process.env.REACT_APP_API_PATH}/posts?limit=10`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: "Bearer " + token,
         },
       }
     );
     if (response.ok) {
       const data = await response.json();
       let tips = [];


       if (Array.isArray(data)) {
         tips = data[0].filter((post) => post.attributes?.postType === "tip");
       } else if (data.posts) {
         tips = data.posts.filter((post) => post.attributes?.postType === "tip");
       }


       const randomTipsSelected = shuffle([...tips]).slice(0, 4);
       setRandomTips(randomTipsSelected);
     } else {
       console.error("Failed to fetch tips, status:", response.status);
     }
   } catch (error) {
     console.error("Error fetching tips:", error);
   }
 };

 const handleCuisine = (cuisine) => {
  console.log(1);
  navigate("/filter?cuisine=" + cuisine);
 };

 return (
   <div className="homepage">

     {!userToken ? (
       <LoginForm setLoggedIn={setLoggedIn} />
     ) : (
       <>
         {/* Hero Section */}
         <section className="hero">
           <div className="hero-text">
               <h1>{t ("discoverNewRecipes")}</h1>
               <p>{t("learnCookShare")}</p>
               <div className="hero-buttons">
                   <Link to="/upload"><button className="btn primary">{t("uploadOwn")}</button></Link>
                   <Link to="/recipes"><button className="btn primary">{t("browseAll")}</button></Link>
                   <Link to="/filter"><button className="btn primary">{t("filterNeeds")}</button></Link>
               </div>
           </div>
             <div className="hero-image">
                 <img src={Homephoto} alt="Home Photo" className="responsive-image" />
           </div>
         </section>


         {/* Cuisine Section */}
         <section className="cuisine-section">
           <div className="cuisine-grid">
             {[
               { name: "Italian" },
               { name: "Chinese" },
               { name: "American"},
               { name: "Indian"},
               { name: "Mexican"},
               { name: "Japanese" },
               { name: "Spanish"},
             ].map((cuisine, index) => (
               <div key={index} onClick={() => handleCuisine(cuisine.name)} className="cuisine-card">
                 <button type="button" style={{backgroundColor:"transparent", border:"0px", fontSize:"18px"}}>{cuisine.name}</button>
               </div>
             ))}
           </div>
         </section>


         {/* Popular Recipes */}
         <section className="popular-recipes">
           <section className="choose-level">
             <h2>Recommended Recipes based on Cooking Level!</h2>
             <div className="levels">
               <div style={{ backgroundColor: selectedLevel === "easy" ? "#634E3B" : undefined}} className="level" onClick={() => setSelectedLevel("easy")}>
                 <leveltext>Easy</leveltext>
               </div>
               <div style={{ backgroundColor: selectedLevel === "medium" ? "#634E3B" : undefined}} className="level" onClick={() => setSelectedLevel("medium")}>
                 <leveltext>Medium</leveltext>
               </div>
               <div style={{ backgroundColor: selectedLevel === "hard" ? "#634E3B" : undefined}} className="level" onClick={() => setSelectedLevel("hard")}>
                 <leveltext>Hard</leveltext>
               </div>
             </div>
           </section>
           <div className="recipes-grid">
             {filteredRecipes.length > 0 ? (
               filteredRecipes.map((recipe) => (
                 <div key={recipe.id} className="recipe-card">
                   <img src={recipe.attributes?.mainImage} alt="recipe pic" className="recipe-image-cover" />
                   <h3>
                    {recipe.attributes?.title?.trim()
                      ? recipe.attributes.title.length > 30
                        ? `${recipe.attributes.title.substring(0, 30)}...`
                        : recipe.attributes.title
                      : "Untitled Recipe"}
                  </h3>
                   <p>
                    {recipe.content?.trim()
                      ? recipe.content.length > 120
                        ? `${recipe.content.substring(0, 120)}...`
                        : recipe.content
                      : "No description available"}
                    </p>
                   <Link to={`/recipe/${recipe.id}`} className="read-more">
                     View Recipe →
                   </Link>
                 </div>
               ))
             ) : (
               <p>No recipes found for this level.</p>
             )}
           </div>
         </section>


         {/* Featured Cooking Tips */}
         <section className="featured-tips">
           <h2>Featured Cooking Tips</h2>
           <div className="tips-grid">
             {randomTips.length > 0 ? (
               randomTips.map((tip) => (
                 <div key={tip.id} className="tip-card">
                   <img src={tip.attributes?.mainImage} alt="tip pic" className="tip-image" />
                   <h3>{tip.content}</h3>
                   <p>{tip.attributes?.description
                     ? tip.attributes.description.length > 100
                       ? `${tip.attributes.description.substring(0, 100)}...`
                       : tip.attributes.description
                     : "No description available"}
                   </p>
                   <Link to={`/tip/${tip.id}`} className="read-more">
                     Read More →
                   </Link>
                 </div>
               ))
             ) : (
               <p>Loading tips...</p>
             )}
           </div>
         </section>


         {/* How-To Guides */}
         <section className="how-to">
           <h2>How-To Guides</h2>
           <div className="guides">
             <div className="guide-card">
               <h3>Grilling Techniques</h3>
               <p> Master the Art of Grilling.</p>
               <Link to="/grilling-techniques"><a>Learn More →</a></Link>
             </div>
             <div className="guide-card">
               <h3>Baking Basics</h3>
               <p>Essential techniques for perfect baked goods.</p>
               <Link to="/baking-basics"><a>Learn More →</a></Link>
             </div>
             <div className="guide-card">
               <h3>Knife Skills 101</h3>
               <p> Learn how to chop, dice, and julienne like a pro!</p>
               <Link to="/knife-skills"><a>Learn More →</a></Link>
             </div>
             <div className="guide-card">
               <h3>Perfect Pasta</h3>
               <p>Cook pasta perfectly every time with these simple tricks.</p>
               <Link to="/perfect-pasta"><a>Learn More →</a></Link>
             </div>
           </div>
         </section>

        <div style={{width:"100%"}}>
           {/* Community Section */}
         <section className="community">
          <div id="community-information">
            <h2>Try Joining or Making a Cooking Community!</h2>
            <p>Connect with fellow food lovers, share recipes, and get inspired!</p>
            <div className="community-buttons">
              <Link to="/community"><button className="btn primary">Join Now</button></Link>
            </div>
          </div>
         </section>

         {sessionStorage.getItem("token") && <section className="contact">
            <h2>Contact Us</h2>
            <p>
              We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
            </p>
          </section>}
        </div>
       </>
     )}
   </div>
 );
};


export default HomePage;



