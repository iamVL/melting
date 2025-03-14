import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FavoritedRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_PATH}/favorites`, {
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
      <div className="recipe-grid">
        {favorites.length > 0 ? (
          favorites.map((recipe) => (
            <div key={recipe.recipeID} className="recipe-card-1">
              <h3 className="recipe-title-1">{recipe.title}</h3>
              <Link to={`/recipe/${recipe.recipeID}`} className="read-more-button-1">
                View Recipe →
              </Link>
            </div>
          ))
        ) : (
          <p>You have no favorite recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default FavoritedRecipes;
