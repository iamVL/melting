import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";

const FilterPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [descriptionQuery, setDescriptionQuery] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientFilters, setIngredientFilters] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [minServingSize, setMinServingSize] = useState("");
  const [maxTotalTime, setMaxTotalTime] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_PATH}/posts?limit=100`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const recipes = Array.isArray(data[0])
          ? data[0].filter(p => p.attributes?.postType === "recipe")
          : data.posts?.filter(p => p.attributes?.postType === "recipe") || [];
        setPosts(recipes);
      })
      .catch(err => console.error("Error fetching recipes:", err));
  }, [token]);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const attrs = post.attributes || {};
      const title = attrs.title || "";
      const description = attrs.description || "";
      const ingredients = attrs.ingredients || [];
      const cuisine = attrs.cuisine || "";
      const difficulty = attrs.difficulty || "";
      const servingSize = parseInt(attrs.servingSize || 0);
      const totalTimeStr = attrs.totalTime || "";

      const matchesTitle = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDescription = description.toLowerCase().includes(descriptionQuery.toLowerCase());
      const matchesIngredient = ingredientFilters.length
        ? ingredientFilters.every(filter =>
            ingredients.some(ing => ing.toLowerCase().includes(filter.toLowerCase()))
          )
        : true;
      const matchesCuisine = selectedCuisines.length
        ? selectedCuisines.includes(cuisine)
        : true;
      const matchesDifficulty = difficultyFilter
        ? difficulty === difficultyFilter
        : true;
      const matchesServingSize = minServingSize
        ? servingSize >= parseInt(minServingSize)
        : true;

      const matchesMaxTime = maxTotalTime
        ? (() => {
            const timeParts = totalTimeStr.match(/(\d+)\s*hours?\s*(\d+)?\s*minutes?/i);
            if (!timeParts) return true;
            const hours = parseInt(timeParts[1] || "0");
            const minutes = parseInt(timeParts[2] || "0");
            const totalMinutes = hours * 60 + minutes;
            return totalMinutes <= parseInt(maxTotalTime);
          })()
        : true;

      return advancedSearch
        ? matchesTitle &&
            matchesDescription &&
            matchesIngredient &&
            matchesCuisine &&
            matchesDifficulty &&
            matchesServingSize &&
            matchesMaxTime
        : matchesTitle;
    });

    setFilteredPosts(filtered);
  }, [searchQuery, descriptionQuery, ingredientFilters, selectedCuisines, difficultyFilter, minServingSize, maxTotalTime, posts, advancedSearch]);

  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Filter Recipes</h2>
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

      {advancedSearch && (
        <div className="advanced-search-container">
          <input
            type="text"
            placeholder="Search by description..."
            className="search-bar"
            value={descriptionQuery}
            onChange={(e) => setDescriptionQuery(e.target.value)}
          />

          <div className="ingredient-input-wrapper">
            <input
              type="text"
              placeholder="Type an ingredient and press Enter"
              className="search-bar"
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
            <div className="ingredient-tags" style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ingredientFilters.map((ingredient, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ffe0b2",
                    border: "1px solid #ff7043",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#5d4037",
                  }}
                >
                  {ingredient}
                  <button
                    onClick={() =>
                      setIngredientFilters((prev) =>
                        prev.filter((ing) => ing !== ingredient)
                      )
                    }
                    style={{
                      background: "none",
                      border: "none",
                      marginLeft: "8px",
                      fontWeight: "bold",
                      color: "#d32f2f",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <select
            className="search-bar-1"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            type="number"
            className="search-bar"
            placeholder="Min Serving Size"
            value={minServingSize}
            onChange={(e) => setMinServingSize(e.target.value)}
            min={1}
          />

          <input
            type="number"
            className="search-bar"
            placeholder="Max Total Time (in minutes)"
            value={maxTotalTime}
            onChange={(e) => setMaxTotalTime(e.target.value)}
            min={1}
          />

          <div className="cuisine-filter-tags">
            {["Italian", "Indian", "Chinese", "Mexican", "Japanese", "American"].map((cuisine) => (
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
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length > 0 ? (
        <div className="recipe-grid">
          {filteredPosts.map((post) => {
            const attrs = post.attributes || {};
            const title = attrs.title || post.content || "Untitled";
            const description = attrs.description?.substring(0, 100) || "No description";
            const mainImage = attrs.mainImage || "/default-recipe-image.jpg";

            return (
              <div key={post.id} className="recipe-card-1">
                <img
                  src={mainImage}
                  alt={title}
                  className="recipe-image-1"
                  onError={(e) => (e.target.src = "/default-recipe-image.jpg")}
                />
                <div className="recipe-content-1">
                  <h3 className="recipe-title-1">{title}</h3>
                  <p className="recipe-description-1">{description}</p>
                  <Link to={`/recipe/${post.id}`} className="read-more-button-1">
                    View Recipe →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-recipes-found">No recipes found matching filters.</p>
      )}
    </div>
  );
};

export default FilterPage;
