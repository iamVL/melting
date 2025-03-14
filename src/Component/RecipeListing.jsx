import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css"; // <-- Make sure this file exists and is imported

const RecipeListing = ({ posts, error, isLoaded, loadPosts }) => {
  const currentUserID = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userID = user.id || user.userID; // Ensure correct user ID format

  const [favoritedRecipes, setFavoritedRecipes] = useState([]);

  // ✅ Fetch recipes and extract favorite status
  useEffect(() => {
    if (!token || !userID) return;

    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions?userID=${userID}`;

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
        console.log("Fetched favorites:", data);
        const favorited = data.map((reaction) => reaction.postID); // Extract favorited post IDs
        setFavoritedRecipes(favorited);
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [token, userID]);

  // ✅ Function to toggle favorite status
  const handleFavorite = async (recipeID) => {
    if (!token) {
        alert("You must be logged in to favorite recipes.");
        return;
    }

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

    if (!reactorID) {
        alert("Your session has expired. Please log in again.");
        return;
    }

    const isFavorited = favoritedRecipes.includes(recipeID);
    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions`;

    if (isFavorited) {
        // **🔹 First, fetch the reaction ID for this recipe**
        try {
            const fetchUrl = `${apiUrl}?postID=${recipeID}&reactorID=${reactorID}`;
            const response = await fetch(fetchUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log("Fetched reaction data:", data);

            // **🔹 Ensure we have valid data before proceeding**
            if (!data || data.length === 0 || !data[0].id) {
              console.error("No valid reaction found for deletion.");
              alert("Error: No favorite reaction found to remove.");
              return;
            }

            const reactionID = data[0].id; // ✅ Get the actual reaction ID

            // **🔹 Now, send the DELETE request**
            const deleteUrl = `${apiUrl}/${reactionID}`;
            console.log(`Sending DELETE request to: ${deleteUrl}`);

            const deleteResponse = await fetch(deleteUrl, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (deleteResponse.ok) {
                setFavoritedRecipes((prevFavorites) => prevFavorites.filter((id) => id !== recipeID));
            } else {
                const errorMessage = await deleteResponse.text();
                console.error("Error removing favorite:", errorMessage);
                alert("Error removing favorite: " + errorMessage);
            }
        } catch (error) {
            console.error("Failed to remove favorite:", error);
        }
    } else {
        // **🔹 Send POST request to add favorite**
        console.log(`Sending POST request to: ${apiUrl} (Adding Favorite)`);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    postID: recipeID,
                    reactorID: reactorID,
                    reactionType: "like",
                    name: "favorite", // ✅ ADD `name` property as required by API
                }),
            });

            if (response.ok) {
                setFavoritedRecipes((prevFavorites) => [...prevFavorites, recipeID]);
            } else {
                const errorMessage = await response.text();
                console.error("Error updating favorite status:", errorMessage);
                alert("Error updating favorite status: " + errorMessage);
            }
        } catch (error) {
            console.error("Failed to update favorite:", error);
        }
    }
};


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
