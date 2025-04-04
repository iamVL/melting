import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";

const FilterPage = () => {
  const [posts, setPosts] = useState([]);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
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

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userID = user.id || user.userID;

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
    if (!token || !userID) return;
    fetch(`${process.env.REACT_APP_API_PATH}/post-reactions?userID=${userID}`, {
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
    if (!token) return;
  
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (typeof user === "number") user = { id: user };
    const reactorID = user?.id || user?.userID;
  
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
          setFavoritedRecipes((prev) => prev.filter((id) => id !== recipeID));
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
            reactorID: reactorID, // <-- FIXED
            reactionType: "like",
            name: "favorite",
          }),
        });
  
        if (response.ok) {
          setFavoritedRecipes((prev) => [...prev, recipeID]);
        } else {
          const errorText = await response.text();
          console.error("Favorite failed:", errorText);
        }
      } catch (error) {
        console.error("Failed to favorite:", error);
      }
    }
  };  

  const filteredPosts = posts.filter((post) => {
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
      const allergyTags = (attrs.allergy || []).map(a => a.toLowerCase());
const matchesAllergy = allergyFilters.length
  ? allergyFilters.every(allergy =>
      !allergyTags.includes(allergy.toLowerCase())
    )
  : true;
    
    const dietTags = (attrs.diet || []).map(d => d.toLowerCase()); // assuming diet is an array
    const matchesDiet = dietFilters.length
  ? dietFilters.every(diet =>
      dietTags.includes(diet.toLowerCase())
    )
  : true;
    const matchesCuisine = selectedCuisines.length
    ? selectedCuisines.some((selected) =>
        String(cuisine || "").toLowerCase().includes(selected.toLowerCase())
      )
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

  return (
    <div className="recipe-container">
      <h2 className="recipe-header">Filter Recipes</h2>
      <p className="recipe-subheader">
        Use the advanced filters below to narrow down your recipe search.
      </p>

      <div className="advanced-search-container">
        <input
          type="text"
          placeholder="Search by title..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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
                onChange={() => {
                  setSelectedCuisines((prev) =>
                    prev.includes(cuisine)
                      ? prev.filter((c) => c !== cuisine)
                      : [...prev, cuisine]
                  );
                }}
              />
              {cuisine}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "16px" }}>
        <div className="allergy-filter-tags">
  <h4>Allergies (Exclude ingredients):</h4>
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

<div className="diet-filter-tags">
  <h4>Religious Diets:</h4>
  {["Halal", "Kosher", "Vegetarian", "Vegan"].map((diet) => (
    <label key={diet}>
      <input
        type="checkbox"
        checked={dietFilters.includes(diet)}
        onChange={() =>
          setDietFilters((prev) =>
            prev.includes(diet)
              ? prev.filter((d) => d !== diet)
              : [...prev, diet]
          )
        }
      />
      {diet}
    </label>
  ))}
</div>
</div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="recipe-grid">
          {filteredPosts.map((post) => {
            const attrs = post.attributes || {};
            const title = attrs.title || post.content || "Untitled";
            const rawDescription = attrs.description;
            const description =
  rawDescription && rawDescription.trim() !== "undefined"
    ? rawDescription.trim().substring(0, 100) + (rawDescription.length > 100 ? "..." : "")
    : post.content?.trim().substring(0, 100) + (post.content?.length > 100 ? "..." : "") || "No description available";

            const mainImage = attrs.mainImage || "/default-recipe-image.jpg";
            const recipeID = post.id;
            const isFavorited = favoritedRecipes.includes(recipeID);

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
                    Read More →
                  </Link>
                  <button
                    className={`favorite-button ${isFavorited ? "favorited" : ""}`}
                    onClick={() => handleFavorite(recipeID)}
                  >
                    {isFavorited ? "⭐ Unfavorite" : "☆ Favorite"}
                  </button>
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