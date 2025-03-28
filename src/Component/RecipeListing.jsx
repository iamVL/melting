import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";

const RecipeListing = ({
  posts,
  error,
  isLoaded,
  loadPosts,
  showCreatedByYouOption = false,
  selectedRecipes = [],
  toggleRecipeSelection = null,
}) => {
  const currentUserID = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userID = user.id || user.userID;

  const [sortOption, setSortOption] = useState("rating");
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    if (!token || !userID) return;

    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions?userID=${userID}`;
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const favorited = data.map((reaction) => reaction.postID);
        setFavoritedRecipes(favorited);
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [token, userID]);

  const handleFavorite = async (recipeID) => {
    if (!token) {
      alert("You must be logged in to favorite recipes.");
      return;
    }

    let user = JSON.parse(sessionStorage.getItem("user"));
    if (typeof user === "number") user = { id: user };
    const reactorID = user?.id || user?.userID;

    const isFavorited = favoritedRecipes.includes(recipeID);
    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions`;

    if (isFavorited) {
      const fetchUrl = `${apiUrl}?postID=${recipeID}&reactorID=${reactorID}`;
      try {
        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.length || !data[0].id) return;

        const deleteUrl = `${apiUrl}/${data[0].id}`;
        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (deleteResponse.ok) {
          setFavoritedRecipes((prev) =>
            prev.filter((id) => id !== recipeID)
          );
        }
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    } else {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postID: recipeID,
            reactorID,
            reactionType: "like",
            name: "favorite",
          }),
        });

        if (response.ok) {
          setFavoritedRecipes((prev) => [...prev, recipeID]);
        }
      } catch (error) {
        console.error("Failed to favorite:", error);
      }
    }
  };

  const handleDelete = async (postID) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this recipe?"))
      return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}/posts/${postID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Deleted!");
        loadPosts();
      } else {
        const result = await response.json();
        alert("Error deleting recipe: " + (result.error || "Unknown error"));
      }
    } catch {
      alert("Could not delete recipe.");
    }
  };

  const getAverageRating = (postID) => {
    const storedReviews = localStorage.getItem(`reviews-${postID}`);
    if (!storedReviews) return 0;
    const reviews = JSON.parse(storedReviews);
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  let sortedPosts = [...posts].map((post) => ({
    ...post,
    averageRating: getAverageRating(post.id),
  }))
  .filter((post) =>
    (post.attributes?.title || post.content || "")
      .toLowerCase()
      .includes(searchTitle.toLowerCase())
  );

  if (sortOption === "created") {
    sortedPosts = sortedPosts.filter(
      (post) => String(post.authorID) === String(currentUserID)
    );
  } else if (sortOption === "rating") {
    sortedPosts.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sortOption === "title") {
    sortedPosts.sort((a, b) =>
      (a.attributes?.title || "").localeCompare(b.attributes?.title || "")
    );
  } else if (sortOption === "likes") {
    sortedPosts.sort(
      (a, b) => (b.attributes?.likes || 0) - (a.attributes?.likes || 0)
    );
  }

  return (
    <div className="recipe-container">
      <div className="recipe-header-container">
        <h2 className="recipe-header">Browse Recipes</h2>
        <div className="sort-dropdown">
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="title">Title</option>
            <option value="likes">Likes</option>
            {showCreatedByYouOption && (
              <option value="created">Created by You</option>
            )}
          </select>
        </div>
      </div>

      <p className="recipe-subheader">
        Explore our community’s shared recipes. Click any card to see details!
      </p>
      <div className="search-container">
  <input
    type="text"
    placeholder="Search by title..."
    className="search-bar"
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
  />
</div>

      {sortedPosts.length > 0 ? (
        
        <div className="recipe-grid">
          {sortedPosts.map((post) => {
            const attrs = post.attributes || {};
            const title = attrs.title || post.content;
            const description =
              attrs.description?.length > 100
                ? attrs.description.substring(0, 100) + "..."
                : attrs.description || "No description";
            const mainImage = attrs.mainImage;
            const recipeID = post.id;
            const isFavorited = favoritedRecipes.includes(recipeID);
            const avg = post.averageRating;

            return (
              <div key={post.id} className="recipe-card-1">
                {mainImage && (
                  <img src={mainImage} alt={title} className="recipe-image-1" />
                )}

                <div className="average-rating-display">
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, i) => {
                      const full = i + 1 <= avg;
                      const half = i < avg && i + 1 > avg;
                      return (
                        <span
                          key={i}
                          className={`star ${
                            full ? "active" : half ? "half-active" : ""
                          }`}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span className="average-rating-value"> {avg}</span>
                </div>

                <div className="recipe-content-1">
                  <h3 className="recipe-title-1">{title}</h3>

                  {toggleRecipeSelection && (
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedRecipes.includes(recipeID)}
                        onChange={() => toggleRecipeSelection(recipeID)}
                      />
                      Add to Cookbook
                    </label>
                  )}

                  <p className="recipe-description-1">{description}</p>

                  <Link
                    to={`/recipe/${post.id}`}
                    className="read-more-button-1"
                  >
                    Read More →
                  </Link>

                  <button
                    className={`favorite-button ${
                      isFavorited ? "favorited" : ""
                    }`}
                    onClick={() => handleFavorite(recipeID)}
                  >
                    {isFavorited ? "⭐ Unfavorite" : "☆ Favorite"}
                  </button>

                  {String(post.authorID) === String(currentUserID) && (
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
