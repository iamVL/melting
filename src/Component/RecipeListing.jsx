import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";
import ConfirmModal from "../Component/ConfirmModal";


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
  const userID = sessionStorage.getItem("user");
  const [savedAllergies, setSavedAllergies] = useState([]);
  const [savedDiets, setSavedDiets] = useState([]);

  const [sortOption, setSortOption] = useState("rating-h-l");
  const [userCookbooks, setUserCookbooks] = useState([]);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
  const [applyPreferences, setApplyPreferences] = useState(false);
  const [localConnections, setLocalConnections] = useState([]);
  const [postRatings, setPostRatings] = useState({});

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showCookbookModal, setShowCookbookModal] = useState(false);


  useEffect( () => {
    fetch(`${process.env.REACT_APP_API_PATH}/users/${userID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((result) => {
        console.log("User grabbed:", result);
        setSavedDiets(result.attributes.dietRegimes);
        setSavedAllergies(result.attributes.allergies);
      })
  },[]);

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
          setShowFavoriteModal(true);
          setTimeout(() => setShowFavoriteModal(false), 2000);
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
    setShowCookbookModal(true);
    setTimeout(() => setShowCookbookModal(false), 2000); // Auto-close after 2 seconds
  };

  /* ---------- helper: delete ---------- */
  const deleteRecipe = async (postID) => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${postID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setDeleteTargetId(null);

        window.location.href = "/recipes"; // or use navigate()
      } else {
        const errorText = await res.text();
        console.error("Delete failed:", errorText);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
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
 useEffect(() => {
  const fetchAllRatings = async () => {
    const promises = posts.map(async (post) => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=${post.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        const reviews = result[0] || [];
        const total = reviews.reduce((sum, r) => sum + (r.attributes?.rating || 0), 0);
        const avg = reviews.length > 0 ? (total / reviews.length).toFixed(1) : "0.0";
        return { postID: post.id, avg };
      } catch (err) {
        console.warn(`Could not fetch rating for post ${post.id}`);
        return { postID: post.id, avg: "0.0" };
      }
    });

    const results = await Promise.all(promises);

    const ratings = {};
    results.forEach(({ postID, avg }) => {
      ratings[postID] = avg;
    });

    setPostRatings(ratings);
  };

  if (posts.length > 0) fetchAllRatings();
}, [posts, token]);
  

  /* ---------- sort & preference filters ---------- */
  let sortedPosts = [...posts].map((post) => ({
    ...post,
    averageRating: postRatings[post.id],
  }));

  if (sortOption === "created") {
    sortedPosts = sortedPosts.filter(
      (post) => String(post.authorID) === String(currentUserID)
    );
  } else if (sortOption === "rating-h-l") {
    sortedPosts.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sortOption === "title-a-z") {
    sortedPosts.sort((a, b) =>
      (a.attributes?.title || "").trim().localeCompare((b.attributes?.title || "").trim())
  );
  } else if (sortOption === "rating-l-h") {
    sortedPosts.sort((a, b) => a.averageRating - b.averageRating);
  } else if (sortOption === "title-z-a") {
    sortedPosts.sort((a, b) =>
      (b.attributes?.title || "").trim().localeCompare((a.attributes?.title || "").trim())
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
            <option value="rating-h-l">Rating (High to Low)</option>
            <option value="rating-l-h">Rating (Low to High)</option>
            <option value="title-a-z">Title (A to Z)</option>
            <option value="title-z-a">Title (Z to A)</option>
            {showCreatedByYouOption && (
              <option value="created">Created by You</option>
            )}
          </select>
        </div>

      </div>
      
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <p className="recipe-subheader" style={{margin:"0px"}}>
          Explore our community’s shared recipes. Click any card to see details!
        </p>
        
        <label style={{ marginLeft: "16px", display:"flex", flexDirection:"row", height:"50px", alignItems:"center", gap:"10px"}}>
          <input
            style={{width:"20px", height:"20px", margin:"0px"}}
            type="checkbox"
            checked={applyPreferences}
            onChange={(e) => setApplyPreferences(e.target.checked)}
          />{" "}
          <p className="recipe-subheader" style={{margin:"0px"}}>
            Apply my dietary and allergy preferences
          </p>
        </label>
      </div>

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
            const shortTitle =
                  title.length > 35
                ? title.substring(0, 35) + "..."
                : title;
            
            const description =
              attrs.description?.trim() && attrs.description !== "undefined"
                ? attrs.description
                : post.content?.trim() || "No description available";
            const shortDescription =
              description.length > 100
                ? description.substring(0, 90) + "..."
                : description;
            const recipeID = post.id;
            const isFavorited = favoritedRecipes.includes(recipeID);
            const averageRating = postRatings[post.id] || "0.0";

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
                  <h3 className="recipe-title-1">{shortTitle}</h3>

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
                  
                  <div style={{display:"flex", gap:"10px"}}>
                    <button
                      style={{width: String(authorID) === String(currentUserID) ? "40%" : "100%"}}
                      className={`favorite-button-btn ${
                        isFavorited ? "favorited" : ""
                      }`}
                      onClick={() => handleFavorite(recipeID)}
                    >
                      {isFavorited ? "⭐ Unfavorite" : "☆ Favorite"}
                    </button>

                    {String(authorID) === String(currentUserID) && (
                                <button
                                    className="delete-recipe-btn"
                                    onClick={() => setDeleteTargetId(recipeID)}
                                >
                                  🗑️ Delete Recipe
                                </button>
                            )}
                  </div>

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

      {deleteTargetId && (
            <ConfirmModal
                message="Are you sure you want to delete this recipe?"
                onConfirm={() => {
                  deleteRecipe(deleteTargetId);
                }}
                onCancel={() => setDeleteTargetId(null)}
            />
        )}
        {showFavoriteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>Recipe favorited!</p>
              </div>
            </div>
        )}

        {showCookbookModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>Recipe added to cookbook!</p>
              </div>
            </div>
        )}
    </div>
  );
};

export default RecipeListing;

