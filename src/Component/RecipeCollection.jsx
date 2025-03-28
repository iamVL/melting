import React, { useEffect, useState } from "react";
import RecipeListing from "./RecipeListing";
import FavoritedRecipes from "./FavoritedRecipes";
import FilterPage from "./FilterPage";

const RecipeCollection = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]); // 🔹 Centralized Favorite State

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userID = user.id || user.userID; // Ensure correct user ID format

  // ✅ Fetch all recipes
  const loadPosts = () => {
    if (!token) {
      setError(new Error("No token found. Please log in."));
      return;
    }

    fetch(`${process.env.REACT_APP_API_PATH}/posts?limit=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoaded(true);
        if (Array.isArray(data) && data[0]) {
          const recipePosts = data[0].filter(
            (p) => p.attributes?.postType === "recipe"
          );
          setPosts(recipePosts);
        } else if (data.posts) {
          const recipePosts = data.posts.filter(
            (p) => p.attributes?.postType === "recipe"
          );
          setPosts(recipePosts);
        }
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
        console.error("Error fetching recipes:", err);
      });
  };

  // ✅ Fetch favorite recipes
  const loadFavorites = () => {
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
        const favorited = data.map((reaction) => reaction.postID); // Extract favorited post IDs
        setFavoritedRecipes(favorited);
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  };

  useEffect(() => {
    loadPosts();
    loadFavorites();
  }, []);

  // ✅ Toggle Favorite Function (Updates Global State)
  const handleFavorite = async (recipeID) => {
    if (!token) {
      alert("You must be logged in to favorite recipes.");
      return;
    }

    const isFavorited = favoritedRecipes.includes(recipeID);
    const apiUrl = `${process.env.REACT_APP_API_PATH}/post-reactions`;

    if (isFavorited) {
      // 🔹 Fetch Reaction ID First
      try {
        const fetchUrl = `${apiUrl}?postID=${recipeID}&reactorID=${userID}`;
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
      // 🔹 Add to Favorites
      try {
        const response = await fetch(apiUrl, {
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

  return (
    <>
      <RecipeListing
        posts={posts}
        error={error}
        isLoaded={isLoaded}
        loadPosts={loadPosts}
        favoritedRecipes={favoritedRecipes}
        handleFavorite={handleFavorite} // Pass Favorite Handler
      />
    </>
  );
};

export default RecipeCollection;
