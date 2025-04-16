import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";

const RecipeListing = ({
  posts,
  error,
  isLoaded,
  loadPosts,
  connections,
  loadConnections,
  showCreatedByYouOption = true,
  selectedRecipes = [],
  toggleRecipeSelection = null,
}) => {
  const currentUserID = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userID = user.id || user.userID;
  const savedAllergies = user.allergy || [];
  const savedDiets = user.diet || [];

  const [sortOption, setSortOption] = useState("rating");
  const [userCookbooks, setUserCookbooks] = useState([]);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
  const [applyPreferences, setApplyPreferences] = useState(false);
  const [localConnections, setLocalConnections] = useState([]);

  /* ---------- load favorites ---------- */
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

  /* ---------- load cookbooks ---------- */
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentUserID = currentUser.id || currentUser.userID;
    const all = JSON.parse(localStorage.getItem("cookbooks")) || [];
    const mine = all.filter((cb) => cb.ownerID === currentUserID);
    setUserCookbooks(mine);
  }, []);

  /* ---------- always fetch connections once + watch reload flags ---------- */
  useEffect(() => {
    if (typeof loadConnections === "function") loadConnections();

    const shouldReloadConnections = sessionStorage.getItem("refreshConnections");
    const shouldReloadPosts = sessionStorage.getItem("refreshPosts");

    if (shouldReloadConnections === "true" && typeof loadConnections === "function") {
      loadConnections();
      sessionStorage.removeItem("refreshConnections");
    }

    if (shouldReloadPosts === "true" && typeof loadPosts === "function") {
      loadPosts();
      sessionStorage.removeItem("refreshPosts");
    }
  }, [loadConnections, loadPosts]);

  /* ---------- debug ---------- */
  useEffect(() => {
    console.log("🔍 connections passed into RecipeListing:", connections);
  }, [connections]);

  useEffect(() => {
    if (connections && connections.length > 0) return;           // prop already good
  
    const fetchCons = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_PATH}/connections?fromUserID=${currentUserID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        // API returns [array, meta]
        const list = Array.isArray(data[0]) ? data[0] : data;
        setLocalConnections(list);
      } catch (err) {
        console.warn("Could not fetch fallback connections", err);
      }
    };
  
    if (currentUserID && token) fetchCons();
  }, [connections, currentUserID, token]);

  /* ---------- helper: favorite ---------- */
  const handleFavorite = async (recipeID) => {
    if (!token) {
      alert("You must be logged in to favorite recipes.");
      return;
    }

    const rawUser = sessionStorage.getItem("user");
    let userObj;
    try {
      userObj = JSON.parse(rawUser);
      if (typeof userObj === "number") userObj = { id: userObj };
    } catch (e) {
      userObj = { id: rawUser };
    }

    const reactorID =
      userObj?.id || userObj?.userID || userObj?.ID || userObj?.userid;
    if (!reactorID) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    const isFavorited = favoritedRecipes.includes(recipeID);
    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions`;

    if (isFavorited) {
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
        if (!data || data.length === 0 || !data[0].id) {
          alert("Error: No favorite reaction found to remove.");
          return;
        }

        const reactionID = data[0].id;
        const deleteUrl = `${apiUrl}/${reactionID}`;

        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (deleteResponse.ok) {
          setFavoritedRecipes((prev) => prev.filter((id) => id !== recipeID));
        } else {
          const errorMessage = await deleteResponse.text();
          alert("Error removing favorite: " + errorMessage);
        }
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    } else {
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
            name: "favorite",
          }),
        });

        if (response.ok) {
          setFavoritedRecipes((prev) => [...prev, recipeID]);
        } else {
          const errorMessage = await response.text();
          alert("Error updating favorite status: " + errorMessage);
        }
      } catch (error) {
        console.error("Failed to update favorite:", error);
      }
    }
  };

  /* ---------- helper: cookbook ---------- */
  const addToCookbook = (recipeID, cookbookName) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentUserID = currentUser.id || currentUser.userID;

    const all = JSON.parse(localStorage.getItem("cookbooks")) || [];
    const updated = all.map((cb) => {
      if (cb.name === cookbookName && cb.ownerID === currentUserID) {
        const merged = Array.from(new Set([...cb.recipes, recipeID]));
        return { ...cb, recipes: merged };
      }
      return cb;
    });

    localStorage.setItem("cookbooks", JSON.stringify(updated));
    alert(`Recipe added to ${cookbookName}`);
  };

  /* ---------- helper: delete ---------- */
  const handleDelete = async (postID) => {
    if (!token) {
      alert("You must be logged in to delete a recipe.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}/posts/${postID}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  /* ---------- ratings helper ---------- */
  const getAverageRating = (postID) => {
    const storedReviews = localStorage.getItem(`reviews-${postID}`);
    if (!storedReviews) return 0;
    const reviews = JSON.parse(storedReviews);
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  /* ---------- sort & preference filters ---------- */
  let sortedPosts = [...posts].map((post) => ({
    ...post,
    averageRating: getAverageRating(post.id),
  }));

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

  if (applyPreferences) {
    sortedPosts = sortedPosts.filter((post) => {
      const attrs = post.attributes || {};
      const allergyTags = (attrs.allergy || []).map((a) => a.toLowerCase());
      const dietTags = (attrs.diet || []).map((d) => d.toLowerCase());

      const matchesAllergy = savedAllergies.every(
        (allergy) => !allergyTags.includes(allergy.toLowerCase())
      );
      const matchesDiet = savedDiets.every((diet) =>
        dietTags.includes(diet.toLowerCase())
      );

      return matchesAllergy && matchesDiet;
    });
  }

  /* ---------- render ---------- */
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

        <label style={{ marginLeft: "16px" }}>
          <input
            type="checkbox"
            checked={applyPreferences}
            onChange={(e) => setApplyPreferences(e.target.checked)}
          />{" "}
          Apply my dietary and allergy preferences
        </label>
      </div>

      <p className="recipe-subheader">
        Explore our community’s shared recipes. Click any card to see details!
      </p>

      {sortedPosts.length > 0 ? (
        <div className="recipe-grid">
          {sortedPosts.map((post) => {
            const authorID = post.authorID;
            const attrs = post.attributes || {};

            /* ------------ visibility check ------------ */
            const isFollowersOnly = attrs.visibility === "Followers Only";

            // flatten possible [dataArray, meta] response
            const flatConnections = Array.isArray(connections) && connections.length
  ? (Array.isArray(connections[0]) ? connections[0] : connections)
  : localConnections;     // ← fallback to the locally‑fetched list


            const isFollowing = flatConnections.some(
              (conn) =>
                String(conn.toUser?.id ?? conn.toUserID) === String(authorID) &&
                conn.attributes?.status !== "blocked"
            );

            const isOwner = String(authorID) === String(currentUserID);

            if (isFollowersOnly && !isFollowing && !isOwner) {
              return null;
            }

            /* ------------ card content ------------ */
            const mainImage = attrs.mainImage;
            const title = attrs.title || post.content;
            const description =
              attrs.description?.trim() && attrs.description !== "undefined"
                ? attrs.description
                : post.content?.trim() || "No description available";
            const shortDescription =
              description.length > 200
                ? description.substring(0, 200) + "..."
                : description;
            const recipeID = post.id;
            const isFavorited = favoritedRecipes.includes(recipeID);
            const averageRating = post.averageRating;

            return (
              <div key={post.id} className="recipe-card-1">
                {mainImage && (
                  <img src={mainImage} alt={title} className="recipe-image-1" />
                )}

                <div className="average-rating-display">
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, i) => {
                      const fullStar = i + 1 <= averageRating;
                      const halfStar =
                        i < averageRating && i + 1 > averageRating;
                      return (
                        <span
                          key={i}
                          className={`star ${
                            fullStar ? "active" : halfStar ? "half-active" : ""
                          }`}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span className="average-rating-value">
                    {" "}
                    {averageRating}
                  </span>
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

                  <p className="recipe-description-1">{shortDescription}</p>

                  <Link to={`/recipe/${post.id}`} className="read-more-button-1">
                    Read More →
                  </Link>

                  {String(authorID) === String(currentUserID) && (
                    <button
                      className="delete-recipe-button-1"
                      onClick={() => handleDelete(post.id)}
                    >
                      🗑 Delete
                    </button>
                  )}

                  <button
                    className={`favorite-button ${
                      isFavorited ? "favorited" : ""
                    }`}
                    onClick={() => handleFavorite(recipeID)}
                  >
                    {isFavorited ? "⭐ Unfavorite" : "☆ Favorite"}
                  </button>

                  {String(authorID) === String(currentUserID) &&
                    userCookbooks.length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              addToCookbook(recipeID, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="" disabled>
                            Add to Cookbook
                          </option>
                          {userCookbooks.map((cb) => (
                            <option key={cb.name} value={cb.name}>
                              {cb.name}
                            </option>
                          ))}
                        </select>
                      </div>
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
