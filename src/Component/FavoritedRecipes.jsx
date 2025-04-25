import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../RecipeListing.css";
import { useLanguage } from "../translator/Languagecontext";

const FavoritedRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Only title search
  const token = sessionStorage.getItem("token");
  const rawUser = sessionStorage.getItem("user");
  const [connections, setConnections] = useState([]);
  const { t } = useLanguage();
  let user;
  try {
    user = JSON.parse(rawUser);
    if (typeof user === "number") user = { id: user };
  } catch (e) {
    user = { id: rawUser };
  }

  const reactorID = user?.id || user?.userID || user?.ID || user?.userid;

  useEffect(() => {
    if (!token || !reactorID) return;

    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions?reactorID=${reactorID}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          const reactions = Array.isArray(data[0]) ? data[0] : data;

          const fetchRecipeDetails = async (reaction) => {
            const postID = reaction.postID || reaction.post_id || reaction.post || reaction.recipeID;
            if (!postID) return null;

            const recipeUrl = `${process.env.REACT_APP_API_PATH}/posts/${postID}`;

            try {
              const response = await fetch(recipeUrl, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) return null;

              const recipeData = await response.json();

              const rawDesc =
  recipeData.attributes?.description  // prefer the attrs field
  || recipeData.content               // otherwise post.content
  || recipeData.summary               // then summary (if you really need)
  || "";
const description = rawDesc.trim()
  ? rawDesc
  : "No description available";
  const shortDescription =
              description.length > 100
                ? description.substring(0, 90) + "..."
                : description;

              return {
                id: recipeData.id || postID,
                reactionID: reaction.id,
                title: recipeData.title || recipeData.name || recipeData.attributes?.title || "Untitled Recipe",
                visibility: recipeData.attributes?.visibility,
                authorID:   recipeData.authorID || recipeData.attributes?.authorID,
                description: shortDescription,   
                image: recipeData.image || recipeData.attributes?.mainImage || recipeData.attributes?.thumbnail || "/default-recipe-image.jpg",

              };

            } catch (error) {
              console.error("Failed to fetch recipe details:", error);
              return null;
            }
          };


          Promise.all(reactions.map(fetchRecipeDetails)).then((recipes) => {
            const validRecipes = recipes.filter((recipe) => recipe !== null);
            const uniqueRecipes = Array.from(new Map(validRecipes.map((item) => [item.id, item])).values());
            setFavorites(uniqueRecipes);


            const ids = uniqueRecipes.map((r) => String(r.id));
            localStorage.setItem("favoritedRecipeIDs", JSON.stringify(ids));
          });

        })
        .catch((err) => console.error("Error fetching favorites:", err));
  }, [token, reactorID]);

  // ---------- load your following list ----------
useEffect(() => {
  if (!token || !reactorID) return;

  fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${reactorID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const list = Array.isArray(data[0]) ? data[0] : data;
      setConnections(list);
    })
    .catch((err) => console.error("Error loading connections:", err));
}, [token, reactorID]);


  const removeFavorite = async (reactionID) => {
    if (!token) {
      alert("You must be logged in to remove favorites.");
      return;
    }

    const deleteUrl = `${process.env.REACT_APP_API_PATH}/post-reactions/${reactionID}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavorites((prevFavorites) =>
            prevFavorites.filter((recipe) => recipe.reactionID !== reactionID)
        );
      } else {
        const errorMessage = await response.text();
        alert("Error removing favorite: " + errorMessage);
      }
    } catch (error) {

    }
  };

  if (!token) return <div>Please Log In...</div>;

  const filteredFavorites = favorites.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // helper to test if you follow a given authorID
const isFollowing = (authorID) =>
  connections.some(
    (c) => String(c.toUser?.id ?? c.toUserID) === String(authorID)
  );

const visibleFavorites = filteredFavorites.filter((recipe) => {
  // recipe.visibility you don’t have on your shape yet, so we need to
  // fetch it when we loaded recipeData. Let’s assume you added it:
  const visibility = recipe.visibility || recipe.attributes?.visibility;
  const authorID   = recipe.authorID || recipe.attributes?.authorID;

  const isOwner       = String(authorID) === String(reactorID);
  const followersOnly = visibility === "Followers Only";

  // if it’s followers‐only, and we’re neither owner nor following → hide
  if (followersOnly && !isOwner && !isFollowing(authorID)) {
    return false;
  }
  return true;
});


    return (
        <div className="recipe-container">
          <h2 className="recipe-header">{t("favorites_title")}</h2>
          <p className="favorite-subheader">{t("favorites_subheader")}</p>

          <div className="search-container">
            <input
                type="text"
                placeholder={t("searchByTitle")}
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {visibleFavorites.length > 0 ? (
              <div className="recipe-grid">
                {visibleFavorites.map((recipe, index) => (
                    <div key={recipe.id || recipe.postID || index} className="recipe-card-1">
                      <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="recipe-image-1"
                      />
                      <div className="recipe-content-1">
                        <h3 className="recipe-title-1">{recipe.title}</h3>
                        <p className="recipe-description-1">{recipe.description}</p>
                        <Link to={`/recipe/${recipe.id}`} className="read-more-button-1">
                          {t("viewRecipe")}
                        </Link>
                        <button
                            className="remove-favorite-button"
                            onClick={() => removeFavorite(recipe.reactionID)}
                        >
                          ❌ {t("removeFavorite")}
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <p className="no-recipes-found">{t("noFavorites")}</p>
          )}
        </div>
    );
  };

  export default FavoritedRecipes;
