import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css"; 

const FavoritedRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search by title
  const [descriptionQuery, setDescriptionQuery] = useState(""); // Search by description
  const [advancedSearch, setAdvancedSearch] = useState(false); // Toggle advanced search
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

        // ✅ Extract the correct list of reactions
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
            
            try {
                const response = await fetch(recipeUrl, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Error fetching recipe:", await response.text());
                    return null;
                }

                const recipeData = await response.json();
                console.log("Fetched Recipe Data:", recipeData); // ✅ LOG API RESPONSE

                // ✅ Ensure the API response structure is correctly mapped
                return {
                    id: recipeData.id || postID,
                    reactionID: reaction.id, // Store reaction ID for easy removal
                    title: recipeData.title || recipeData.name || recipeData.attributes?.title || "Untitled Recipe",
                    description: recipeData.description || recipeData.summary || recipeData.attributes?.description || "No description available",
                    // 🔹 Fix image URL extraction:
                    image: recipeData.image || recipeData.attributes?.mainImage || recipeData.attributes?.thumbnail || "/default-recipe-image.jpg",
                };

            } catch (error) {
                console.error("Failed to fetch recipe details:", error);
                return null;
            }
        };        

        Promise.all(reactions.map(fetchRecipeDetails))
            .then((recipes) => {
                const validRecipes = recipes.filter(recipe => recipe !== null); // Remove null responses
                const uniqueRecipes = Array.from(new Map(validRecipes.map(item => [item.id, item])).values()); // ✅ Remove duplicates
                setFavorites(uniqueRecipes);
        });

    })
    .catch((err) => console.error("Error fetching favorites:", err));
  }, [token, reactorID]);

  // ✅ Function to remove a recipe from favorites
  const removeFavorite = async (reactionID) => {
    if (!token) {
      alert("You must be logged in to remove favorites.");
      return;
    }

    const deleteUrl = `${process.env.REACT_APP_API_PATH}/post-reactions/${reactionID}`;
    console.log(`Sending DELETE request to: ${deleteUrl}`);

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
        // ✅ Remove the recipe from the state after deletion
        setFavorites((prevFavorites) => prevFavorites.filter(recipe => recipe.reactionID !== reactionID));
        console.log("Successfully removed favorite.");
      } else {
        const errorMessage = await response.text();
        console.error("Error removing favorite:", errorMessage);
        alert("Error removing favorite: " + errorMessage);
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (!token) return <div>Please Log In...</div>;

  // 🔍 Filter based on title and (optional) description
  const filteredFavorites = favorites.filter((recipe) => {
    const matchesTitle = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDescription = recipe.description.toLowerCase().includes(descriptionQuery.toLowerCase());
    return advancedSearch ? matchesTitle && matchesDescription : matchesTitle;
  });

  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Your Favorite Recipes</h2>
      <p className="recipe-subheader">Here are the recipes you favorited!</p>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="toggle-advanced-btn"
          onClick={() => setAdvancedSearch(!advancedSearch)}
        >
          {advancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
      </div>

      {/* 🔍 Advanced Search Field */}
      {advancedSearch && (
        <div className="advanced-search-container">
          <input
            type="text"
            placeholder="Search by description..."
            className="search-bar"
            value={descriptionQuery}
            onChange={(e) => setDescriptionQuery(e.target.value)}
          />
        </div>
      )}

      {filteredFavorites.length > 0 ? (
        <div className="recipe-grid">
          {filteredFavorites.map((recipe, index) => {
            console.log("Rendering Recipe:", recipe); // ✅ Debugging to check available fields
            
            return (
              <div key={recipe.id || recipe.postID || index} className="recipe-card-1">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image-1"
                  onError={(e) => e.target.src = "/default-recipe-image.jpg"} // ✅ Fallback image
                />
                <div className="recipe-content-1">
                  <h3 className="recipe-title-1">
                    {recipe.title}
                  </h3>
                  <p className="recipe-description-1">
                    {recipe.description}
                  </p>
                  <Link to={`/recipe/${recipe.id}`} className="read-more-button-1">
                    View Recipe →
                  </Link>
                  {/* ✅ Add Remove Favorite Button */}
                  <button
                    className="remove-favorite-button"
                    onClick={() => removeFavorite(recipe.reactionID)}
                  >
                    ❌ Remove Favorite
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-recipes-found">You have no favorite recipes yet.</p>
      )}
    </div>
  );
};

export default FavoritedRecipes;
