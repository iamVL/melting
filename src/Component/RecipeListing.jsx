import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css"; // <-- Make sure this file exists and is imported

const RecipeListing = ({ posts, error, isLoaded, loadPosts }) => {
  const currentUserID = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");

  const [favoritedRecipes, setFavoritedRecipes] = useState([]);

  // Fetch user's favorited recipes
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_PATH}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavoritedRecipes(data.map(fav => fav.recipeID)))
      .catch(err => console.error("Error fetching favorites:", err));
  }, [token]);

  // Function to toggle favorite status
  const handleFavorite = async (recipeID) => {
    if (!token) {
      alert("You must be logged in to favorite recipes.");
      return;
    }

    const isFavorited = favoritedRecipes.includes(recipeID);
    const method = isFavorited ? "DELETE" : "POST";

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeID }),
      });

      if (response.ok) {
        setFavoritedRecipes((prevFavorites) =>
          isFavorited ? prevFavorites.filter(id => id !== recipeID) : [...prevFavorites, recipeID]
        );
      } else {
        alert("Error updating favorite status.");
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  if (!token) return <div>Please Log In...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isLoaded) return <div>Loading...</div>;

  // If not logged in, or data not yet loaded, show messages:
  if (!sessionStorage.getItem("token")) {
    return <div>Please Log In...</div>;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Handler for deleting a recipe
  const handleDelete = async (postID) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a recipe.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${postID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Recipe deleted successfully!");
        loadPosts(); // Refresh the list after deletion
      } else {
        const result = await response.json();
        alert("Error deleting recipe: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      alert("Failed to delete the recipe. Please try again.");
    }
  };

  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Browse Recipes</h2>
      <p className="recipe-subheader">
        Explore our community’s shared recipes. Click any card to see details!
      </p>

      {/* If there are recipes, display them in a grid. Otherwise, show a message. */}
      {posts.length > 0 ? (
        <div className="recipe-grid">
          {posts.map((post) => {
            const authorID = post.authorID;
            // For safety, handle if attributes is null/undefined
            const attrs = post.attributes || {};
            const mainImage = attrs.mainImage;
            const title = attrs.title || post.content; // fallback to post.content if no title
            const description = attrs.description || "No description available";
            const recipeID = post.id;
            const isFavorited = favoritedRecipes.includes(recipeID);

            // Truncate description if it’s very long (optional)
            const shortDescription =
              description.length > 100
                ? description.substring(0, 100) + "..."
                : description;

            return (
              <div key={post.id} className="recipe-card-1">
                {/* If there's an image, render it */}
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={title}
                    className="recipe-image-1"
                  />
                )}

                <div className="recipe-content-1">
                  <h3 className="recipe-title-1">{title}</h3>
                  <p className="recipe-description-1">{shortDescription}</p>

                  {/* "Read More" button links to individual recipe page */}
                  <Link to={`/recipe/${post.id}`} className="read-more-button-1">
                    Read More →
                  </Link>

                  <button
                    className={`favorite-button ${isFavorited ? "favorited" : ""}`}
                    onClick={() => handleFavorite(recipeID)}
                  >
                    {isFavorited ? "⭐ Unfavorite" : "☆ Favorite"}
                  </button>

                  {/* Only show "Delete" if the post belongs to the current user */}
                  {String(authorID) === String(currentUserID) && (
                    <button
                      className="delete-recipe-button-1"
                      onClick={() => handleDelete(post.id)}
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
        <div className="no-recipes-found">No Recipes Found</div>
      )}
    </div>
  );
};

export default RecipeListing;
