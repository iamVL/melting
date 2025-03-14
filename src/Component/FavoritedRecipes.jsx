import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css"; // ✅ Import RecipeListing.css instead of FavoritedRecipes.css

const FavoritedRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_PATH}/melting/favorites`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [token]);

  if (!token) return <div>Please Log In...</div>;

  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Your Favorite Recipes</h2>
      <p className="recipe-subheader">Here are the recipes you favorited!</p>

      {favorites.length > 0 ? (
        <div className="recipe-grid">
          {favorites.map((recipe) => (
            <div key={recipe.recipeID} className="recipe-card-1">
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
                <Link to={`/recipe/${recipe.recipeID}`} className="read-more-button-1">
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
