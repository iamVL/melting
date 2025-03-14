import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";

const RecipeListing = ({ posts, error, isLoaded, loadPosts }) => {
  const [sortOption, setSortOption] = useState("rating");
  const currentUserID = sessionStorage.getItem("user");

  if (!sessionStorage.getItem("token")) {
    return <div>Please Log In...</div>;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const getAverageRating = (postID) => {
    const storedReviews = localStorage.getItem(`reviews-${postID}`);
    if (!storedReviews) return 0;
    const reviews = JSON.parse(storedReviews);
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

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
        loadPosts();
      } else {
        const result = await response.json();
        alert("Error deleting recipe: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      alert("Failed to delete the recipe. Please try again.");
    }
  };

  const sortedPosts = [...posts].map((post) => ({
    ...post,
    averageRating: getAverageRating(post.id),
  }));

  if (sortOption === "rating") {
    sortedPosts.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sortOption === "title") {
    sortedPosts.sort((a, b) => (a.attributes?.title || "").localeCompare(b.attributes?.title || ""));
  } else if (sortOption === "likes") {
    sortedPosts.sort((a, b) => (b.attributes?.likes || 0) - (a.attributes?.likes || 0));
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
          </select>
        </div>
      </div>
      <p className="recipe-subheader">
        Explore our community’s shared recipes. Click any card to see details!
      </p>

      {sortedPosts.length > 0 ? (
        <div className="recipe-grid">
          {sortedPosts.map((post) => {
            const authorID = post.authorID;
            // For safety, handle if attributes is null/undefined
            const attrs = post.attributes || {};
            const mainImage = attrs.mainImage;
            const title = attrs.title || post.content;
            const description = attrs.description || "No description available";

            // Truncate description if it’s very long (optional)
            const shortDescription =
              description.length > 100 ? description.substring(0, 100) + "..." : description;
            const averageRating = post.averageRating;

            return (
              <div key={post.id} className="recipe-card-1">
                {mainImage && <img src={mainImage} alt={title} className="recipe-image-1" />}

                <div className="average-rating-display">
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, i) => {
                      const fullStar = i + 1 <= averageRating;
                      const halfStar = i < averageRating && i + 1 > averageRating;
                      return (
                        <span key={i} className={`star ${fullStar ? "active" : halfStar ? "half-active" : ""}`}>
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span className="average-rating-value"> {averageRating}</span>
                </div>

                <div className="recipe-content-1">
                  <h3 className="recipe-title-1">{title}</h3>
                  <p className="recipe-description-1">{shortDescription}</p>

                  <Link to={`/recipe/${post.id}`} className="read-more-button-1">
                    Read More →
                  </Link>

                  {String(authorID) === String(currentUserID) && (
                    <button className="delete-recipe-button-1" onClick={() => handleDelete(post.id)}>
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
