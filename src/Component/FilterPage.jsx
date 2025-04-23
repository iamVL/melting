import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../RecipeListing.css";
import "../FilterPage.css";


const FilterPage = () => {

  const [posts, setPosts] = useState([]);
  const [reactionMap, setReactionMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [descriptionQuery, setDescriptionQuery] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientFilters, setIngredientFilters] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [minServingSize, setMinServingSize] = useState("");
  const [maxTotalTime, setMaxTotalTime] = useState("");
  const [allergyFilters, setAllergyFilters] = useState([]);
  const [dietFilters, setDietFilters] = useState([]);
  const [showCuisines, setShowCuisines] = useState(true);
  const [showAllergies, setShowAllergies] = useState(true);
  const [showDiets, setShowDiets] = useState(true);
  const [connections, setConnections] = useState([]);
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";
  const raw = sessionStorage.getItem("user");
  const navigate = useNavigate();


  const rawFavIDs = localStorage.getItem("favoritedRecipeIDs");
  const favoritedRecipeIDs = new Set(JSON.parse(rawFavIDs || "[]"));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCuisine = params.get("cuisine");

  const token = sessionStorage.getItem("token");
  const userID = sessionStorage.getItem("user");
  const [user, setUser] = useState({});

  useEffect( () => {
    if (initialCuisine) {
      setSelectedCuisines([initialCuisine]);
      return;
    }
    fetch(`${process.env.REACT_APP_API_PATH}/users/${userID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((result) => {
        console.log("User grabbed:", result);
        setUser(result);
        setDietFilters(result.attributes.dietRegimes);
        setAllergyFilters(result.attributes.allergies);
      })
  },[]);

  useEffect(() => {
    const fetchRandomRecipes = async (token) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_PATH}/posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
   
   
        if (response.ok) {
          const data = await response.json();
          let recipes = [];
   
   
          if (Array.isArray(data)) {
            recipes = data[0].filter((post) => post.attributes?.postType === "recipe");
          } else if (data.posts) {
            recipes = data.posts.filter((post) => post.attributes?.postType === "recipe");
          }
        console.log(recipes);
        setPosts(recipes);
        } else {
          console.error("Failed to fetch recipes, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRandomRecipes(token);
  }, [token]);

  useEffect(() => {
    if (!token || !userID) return;
    fetch(`${process.env.REACT_APP_API_PATH}/post-reactions?userID=${userID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          const map = {};
          data.forEach((reaction) => {
            const postID = String(reaction.postID);
            if (postID && reaction.id) {
              map[postID] = reaction.id;
            }
          });

          setReactionMap(map);
        })
        .catch((err) => console.error("Error fetching reactions:", err));
  }, [token, userID]);

  useEffect(() => {
    if (!token || !userID) return;
    fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${userID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data[0]) ? data[0] : data;
          setConnections(list);
        });
  }, [token, userID]);

  useEffect(() => {
    if (!token || !userID) return;

    fetch(`${process.env.REACT_APP_API_PATH}/post-reactions?reactorID=${userID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          const ids = data.map((r) => String(r.postID)); // Store as strings
          setReactionMap(() => {
            const map = {};
            ids.forEach((id) => map[id] = true);
            return map;
          });
        });
  }, [token, userID]);


  const favoritedPostIDs = new Set(Object.keys(reactionMap));



  const handleFavorite = async (recipeID) => {
    if (!token) return;
    const reactionID = reactionMap[recipeID];
    const isFavorited = !!reactionMap[recipeID];

    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions`;

    if (isFavorited) {
      try {
        const res = await fetch(`${apiUrl}/${reactionID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setReactionMap((prev) => {
            const updated = { ...prev };
            delete updated[recipeID];
            return updated;
          });
          if (res.ok) {
            setReactionMap((prev) => {
              const updated = { ...prev };
              delete updated[recipeID];
              return updated;
            });

          }

        }
      } catch (err) {
        console.error("Failed to remove favorite:", err);
      }
    } else {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postID: recipeID,
            reactorID: userID,
            reactionType: "like",
            name: "favorite",
          }),
        });


        const result = await res.json();

        if (res.ok && result?.id) {
          setReactionMap((prev) => ({
            ...prev,
            [recipeID]: result.id,
          }));

          const existing = JSON.parse(localStorage.getItem("favoritedRecipeIDs") || "[]");
          if (!existing.includes(recipeID)) {
            localStorage.setItem("favoritedRecipeIDs", JSON.stringify([...existing, recipeID]));
          }

          window.dispatchEvent(new Event("favoritesUpdated")); // ✅ Keep this

          setIsModalOpen(true);
          setTimeout(() => {
            setIsModalOpen(false);
          }, 7000); // ✅ Show modal but don't redirect
        }




      } catch (err) {
        console.error("Failed to favorite:", err);

      }
    }

  };


  const filteredPosts = posts.filter((post) => {
    const recipeID = String(post.id);


    const attrs = post.attributes || {};
    const title = attrs.title || post.content || "";
    const description = attrs.description || post.content || "";
    const ingredients = attrs.ingredients || [];
    const cuisine = attrs.cuisine || "";
    const difficulty = attrs.difficulty || "";
    const servingSize = parseInt(attrs.servingSize || 0);
    const totalTimeStr = attrs.totalTime || "";
    const authorID = post.authorID;

    const isFollowersOnly = attrs.visibility === "Followers Only";
    const isCreator = String(authorID) === String(userID);
    const isFollowingAuthor = connections.some(
        (conn) => String(conn.toUser?.id ?? conn.toUserID) === String(authorID)
    );

    if (isFollowersOnly && !isCreator && !isFollowingAuthor) return false;

    const matchesTitle = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDescription = description.toLowerCase().includes(descriptionQuery.toLowerCase());
    const matchesIngredient = ingredientFilters.every((filter) =>
        ingredients.some((ing) => ing.toLowerCase().includes(filter.toLowerCase()))
    );
    const allergyTags = (attrs.allergy || []).map((a) => a.toLowerCase());
    const matchesAllergy = allergyFilters.every(
        (allergy) => !allergyTags.includes(allergy.toLowerCase())
    );
    const dietTags = (attrs.diet || []).map((d) => d.toLowerCase());
    const matchesDiet = dietFilters.every((diet) => dietTags.includes(diet.toLowerCase()));
    const matchesCuisine = selectedCuisines.length
        ? selectedCuisines.some((selected) =>
            String(cuisine || "").toLowerCase().includes(selected.toLowerCase())
        )
        : true;
    const matchesDifficulty = difficultyFilter ? difficulty === difficultyFilter : true;
    const matchesServingSize = minServingSize ? servingSize >= parseInt(minServingSize) : true;
    const matchesMaxTime = maxTotalTime
        ? (() => {
          const timeParts = totalTimeStr.match(/(\d+)\s*hours?\s*(\d+)?\s*minutes?/i);
          if (!timeParts) return true;
          const hours = parseInt(timeParts[1] || "0");
          const minutes = parseInt(timeParts[2] || "0");
          return hours * 60 + minutes <= parseInt(maxTotalTime);
        })()
        : true;

    return (
        matchesTitle &&
        matchesDescription &&
        matchesIngredient &&
        matchesCuisine &&
        matchesDifficulty &&
        matchesServingSize &&
        matchesMaxTime &&
        matchesAllergy &&
        matchesDiet
    );
  });
return(
  <div className="filter-layout">
        {/* ✅ Sidebar (restored from your previous layout) */}
        <aside className="filter-sidebar">
          <div className="sidebar-navigation">
            <h2>Filters</h2>

            <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
                type="text"
                placeholder="Search by description..."
                value={descriptionQuery}
                onChange={(e) => setDescriptionQuery(e.target.value)}
            />

            {/* Ingredient Input */}
            <div className="ingredient-filter">
              <input
                  type="text"
                  placeholder="Add ingredient and press Enter"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && ingredientInput.trim()) {
                      e.preventDefault();
                      const input = ingredientInput.trim().toLowerCase();
                      if (!ingredientFilters.includes(input)) {
                        setIngredientFilters((prev) => [...prev, input]);
                      }
                      setIngredientInput("");
                    }
                  }}
              />
              <div className="ingredient-tags">
                {ingredientFilters.map((ingredient, index) => (
                    <span key={index} className="tag">
                {ingredient}
                      <button onClick={() => setIngredientFilters((prev) => prev.filter((ing) => ing !== ingredient))}>
                  ×
                </button>
              </span>
                ))}
              </div>
            </div>

            <input
                type="number"
                placeholder="Min Serving Size"
                value={minServingSize}
                onChange={(e) => setMinServingSize(e.target.value)}
            />
            <input
                type="number"
                placeholder="Max Total Time (minutes)"
                value={maxTotalTime}
                onChange={(e) => setMaxTotalTime(e.target.value)}
            />

            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Cuisines */}
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => setShowCuisines(!showCuisines)}>
                <h4>Cuisines {showCuisines ? "▲" : "▼"}</h4>
              </div>
              {showCuisines && (
                  <div className="checkbox-group">
                    {["Italian", "Chinese", "American", "Indian", "Mexican", "Japanese", "Spanish"].map(
                        (cuisine) => (
                            <label key={cuisine}>
                              <input
                                  type="checkbox"
                                  checked={selectedCuisines.includes(cuisine)}
                                  onChange={() =>
                                      setSelectedCuisines((prev) =>
                                          prev.includes(cuisine)
                                              ? prev.filter((c) => c !== cuisine)
                                              : [...prev, cuisine]
                                      )
                                  }
                              />
                              {cuisine}
                            </label>
                        )
                    )}
                  </div>
              )}
            </div>

            {/* Allergies */}
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => setShowAllergies(!showAllergies)}>
                <h4>Allergies {showAllergies ? "▲" : "▼"}</h4>
              </div>
              {showAllergies && (
                  <div className="checkbox-group">
                    {["Peanuts", "TreeNuts", "Shellfish", "Gluten", "Eggs", "Dairy"].map((allergy) => (
                        <label key={allergy}>
                          <input
                              type="checkbox"
                              checked={allergyFilters.includes(allergy)}
                              onChange={() =>
                                  setAllergyFilters((prev) =>
                                      prev.includes(allergy)
                                          ? prev.filter((a) => a !== allergy)
                                          : [...prev, allergy]
                                  )
                              }
                          />
                          {allergy}
                        </label>
                    ))}
                  </div>
              )}
            </div>

            {/* Diets */}
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => setShowDiets(!showDiets)}>
                <h4>Dietary Preferences {showDiets ? "▲" : "▼"}</h4>
              </div>
              {showDiets && (
                  <div className="checkbox-group">
                    {["Halal", "Kosher", "Vegetarian", "Vegan"].map((diet) => (
                        <label key={diet}>
                          <input
                              type="checkbox"
                              checked={dietFilters.includes(diet)}
                              onChange={() =>
                                  setDietFilters((prev) =>
                                      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
                                  )
                              }
                          />
                          {diet}
                        </label>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </aside>

        <main className="recipe-listing">
          <h2 className="results-header">Serving { selectedCuisines.length >= 2 || selectedCuisines.length == 0  ?  "Cooking" : selectedCuisines[0]} Recipes!</h2>
          {filteredPosts.length > 0 ? (
              <div className="recipe-grid">
                {filteredPosts.map((post) => {
                  const attrs = post.attributes || {};
                  const title = attrs.title || post.content || "Untitled";
                  const rawDescription = attrs.description || post.content || "";
                  const description =
                      rawDescription && rawDescription.trim() !== "undefined"
                          ? rawDescription.trim().substring(0, 120) +
                          (rawDescription.length > 120 ? "..." : "")
                          : "No description available";
                  const mainImage = attrs.mainImage || "/default-recipe-image.jpg";
                  const recipeID = String(post.id);
                  const isFavorited = !!reactionMap[recipeID];

                  const authorID = post.authorID;
                  const isFollowersOnly = attrs?.visibility === "Followers Only";
                  const isBlocked = Array.isArray(connections) &&
                    connections.some(
                      (connection) =>
                        String(connection.toUser?.id ?? connection.toUserID) === String(authorID) &&
                          connection.attributes?.status === "blocked"
                     );

                        // If blocked, do not show any of their posts
                        if (isBlocked) return null;
                  const isFollowingAuthor = Array.isArray(connections) &&
                      connections.some(
                          (connection) =>
                              String(connection.toUser?.id ?? connection.toUserID) === String(authorID)
                      );
                  const isCreator = String(authorID) === String(userID);

                  if (isFollowersOnly && !isFollowingAuthor && !isCreator) return null;

                  return (
                      <div key={post.id} className="recipe-card">
                        <img
                            src={mainImage}
                            alt={title}
                            className="recipe-image"
                            onError={(e) => (e.target.src = "/default-recipe-image.jpg")}
                        />
                        <div className="recipe-content">
                          <h3>{title}</h3>
                          <p>{description}</p>
                          <Link to={`/recipe/${post.id}`} className="read-more">
                            Read More →
                          </Link>
                          <div className="card-footer">
                            {!favoritedRecipeIDs.has(String(post.id)) && (
                                <button onClick={() => handleFavorite(post.id)}>☆ Favorite</button>
                            )}

                            <div className="recipe-meta">
                              <span>{attrs.cuisine || "N/A"}</span>
                              <span>{attrs.totalTime || "⏱ Unknown"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  );
                })}

              </div>
          ) : (
              <p className="no-recipes">No recipes found matching filters.</p>
          )}
          {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <p>Recipe favorited! <Link to="/favorites">Go to Favorites →</Link></p>

                </div>
              </div>
          )}

        </main>
  </div>

);
};

export default FilterPage;
