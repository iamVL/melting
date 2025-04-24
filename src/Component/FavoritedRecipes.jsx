import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";

const FavoritedRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Only title search
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

  useEffect(() => {
    if (!token || !reactorID) return;

    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions?reactorID=${reactorID}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          const reactions = Array.isArray(data[0]) ? data[0] : data;

          const fetchRecipeDetails = async (reaction) => {
            const postID = reaction.postID || reaction.post_id || reaction.post || reaction.recipeID;
            if (!postID) return null;

            const recipeUrl = `${process.env.REACT_APP_API_PATH}/posts/${postID}`;

            try {
              const response = await fetch(recipeUrl, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) return null;

              const recipeData = await response.json();

              return {
                id: recipeData.id || postID,
                reactionID: reaction.id,
                title: recipeData.title || recipeData.name || recipeData.attributes?.title || "Untitled Recipe",
                description: recipeData.description || recipeData.summary || recipeData.attributes?.description || "No description available",
                image: recipeData.image || recipeData.attributes?.mainImage || recipeData.attributes?.thumbnail ,
              };

            } catch (error) {
              console.error("Failed to fetch recipe details:", error);
              return null;
            }
          };


          Promise.all(reactions.map(fetchRecipeDetails)).then((recipes) => {
            const validRecipes = recipes.filter((recipe) => recipe !== null);
            const uniqueRecipes = Array.from(new Map(validRecipes.map((item) => [item.id, item])).values());
            setFavorites(uniqueRecipes);


            const ids = uniqueRecipes.map((r) => String(r.id));
            localStorage.setItem("favoritedRecipeIDs", JSON.stringify(ids));
          });

        })
        .catch((err) => console.error("Error fetching favorites:", err));
  }, [token, reactorID]);

  const removeFavorite = async (reactionID) => {
    if (!token) {
      alert("You must be logged in to remove favorites.");
      return;
    }

    const deleteUrl = `${process.env.REACT_APP_API_PATH}/post-reactions/${reactionID}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavorites((prevFavorites) =>
            prevFavorites.filter((recipe) => recipe.reactionID !== reactionID)
        );
      } else {
        const errorMessage = await response.text();
        alert("Error removing favorite: " + errorMessage);
      }
    } catch (error) {

    }
  };

  if (!token) return <div>Please Log In...</div>;

  const filteredFavorites = favorites.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="recipe-container">
        <h2 className="recipe-header">Your Favorite Recipes</h2>
        <p className="recipe-subheader">Here are the recipes you favorited!</p>

        <div className="search-container">
          <input
              type="text"
              placeholder="Search by title..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredFavorites.length > 0 ? (
            <div className="recipe-grid">
              {filteredFavorites.map((recipe, index) => (
                  <div key={recipe.id || recipe.postID || index} className="recipe-card-1">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="recipe-image-1"

                    />
                    <div className="recipe-content-1">
                      <h3 className="recipe-title-1">{recipe.title}</h3>
                      <p className="recipe-description-1">{recipe.description}</p>
                      <Link to={`/recipe/${recipe.id}`} className="read-more-button-1">
                        View Recipe →
                      </Link>
                      <button
                          className="remove-favorite-button"
                          onClick={() => removeFavorite(recipe.reactionID)}
                      >
                        ❌ Remove Favorite
                      </button>
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