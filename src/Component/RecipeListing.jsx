import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css"; // Make sure your updated CSS is here

const RecipeListing = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch all "recipe" posts
  const loadRecipes = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const url = process.env.REACT_APP_API_PATH + "/posts?parentID=";

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setIsLoaded(true);
        if (result && result[0]) {
          // Only keep posts where postType === "recipe"
          const filtered = result[0].filter(
            (post) => post.attributes?.postType === "recipe"
          );
          setRecipes(filtered);
        }
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
        console.error("Error loading recipes:", err);
      });
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // Delete a recipe if user is the owner
  const handleDelete = async (recipeID) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a recipe.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}/posts/${recipeID}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Recipe deleted successfully!");
        loadRecipes(); // Refresh the list
      } else {
        const result = await response.json();
        alert("Error deleting recipe: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      alert("Failed to delete the recipe.");
    }
  };

  const currentUserID = sessionStorage.getItem("user");

  // Render component
  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Browse All Recipes</h2>
      <p className="recipe-subheader">Explore delicious recipes from around the world!</p>

      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      {!isLoaded ? (
        <div>Loading...</div>
      ) : recipes.length > 0 ? (
        <div className="recipe-grid">
          {recipes.map((recipe) => {
            const { id, authorID, attributes = {} } = recipe;
            const {
              mainImage,
              title = "No Title",
              description = "No description available",
            } = attributes;

            return (
              <div className="recipe-card" key={id}>
                {/* Image */}
                {mainImage && (
                  <img src={mainImage} alt={title} className="recipe-image" />
                )}

                {/* Text content */}
                <div className="recipe-content">
                  <h3 className="recipe-title">{title}</h3>
                  <p className="recipe-description">{description}</p>

                  {/* Read More link to Single Recipe */}
                  <Link to={`/recipe/${id}`} className="read-more-button">
                    Read More →
                  </Link>

                  {/* Show Delete if user is owner */}
                  {String(authorID) === String(currentUserID) && (
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(id)}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-recipes">No Recipes Found</div>
      )}
    </div>
  );
};

export default RecipeListing;
