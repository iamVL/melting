import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css"; 

const FavoritedRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const token = sessionStorage.getItem("token");
  const rawUser = sessionStorage.getItem("user");

  let user;
  try {
      user = JSON.parse(rawUser);
      if (typeof user === "number") user = { id: user };
  } catch (e) {
      user = { id: rawUser };
  }

  const reactorID = user?.id || user?.userID || user?.ID || user?.userid;
  console.log("Extracted Reactor ID:", reactorID);

  useEffect(() => {
    if (!token || !reactorID) return;

    // ✅ Fetch favorite reactions
    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions?reactorID=${reactorID}`;

    console.log("Fetching favorited recipes from:", apiUrl);

    fetch(apiUrl, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Favorited reactions fetched:", data);

        // ✅ Ensure we extract the first array from API response
        const reactions = Array.isArray(data[0]) ? data[0] : data;

        console.log("Filtered reactions:", reactions);

        // ✅ Fetch full recipe details for each favorited post
        const fetchRecipeDetails = async (reaction) => {
            const postID = reaction.postID || reaction.post_id || reaction.post || reaction.recipeID;
            if (!postID) {
                console.error("Invalid reaction object:", reaction);
                return null; // Skip invalid reactions
            }
            const recipeUrl = `${process.env.REACT_APP_API_PATH}/posts/${postID}`;
            const response = await fetch(recipeUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          return response.json();
        };

        Promise.all(reactions.map(fetchRecipeDetails))
            .then((recipes) => {
                const validRecipes = recipes.filter(recipe => recipe !== null); // Remove null responses
                const uniqueRecipes = Array.from(new Map(validRecipes.map(item => [item.id, item])).values());
                setFavorites(uniqueRecipes);
        });

    })
    .catch((err) => console.error("Error fetching favorites:", err));
  }, [token, reactorID]);

  if (!token) return <div>Please Log In...</div>;

  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Your Favorite Recipes</h2>
      <p className="recipe-subheader">Here are the recipes you favorited!</p>

      {favorites.length > 0 ? (
        <div className="recipe-grid">
          {favorites.map((recipe) => (
            <div key={recipe.id || recipe.postID} className="recipe-card-1">
              <img
                src={recipe.image || "https://via.placeholder.com/350"}
                alt={recipe.title}
                className="recipe-image-1"
              />
              <div className="recipe-content-1">
                <h3 className="recipe-title-1">{recipe.title}</h3>
                <p className="recipe-description-1">
                  {recipe.description || "No description available"}
                </p>
                <Link to={`/recipe/${recipe.id}`} className="read-more-button-1">
                  View Recipe →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-recipes-found">You have no favorite recipes yet.</p>
      )}
    </div>
  );
};

export default FavoritedRecipes;
