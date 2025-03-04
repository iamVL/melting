import React, { useEffect, useState } from "react";
import RecipeListing from "./RecipeListing";

const RecipeCollection = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadPosts = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError(new Error("No token found. Please log in."));
      return;
    }

    // Fetch all posts but filter for postType === "recipe"
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

        // The API might return data in [data[0]] or data.posts, adjust as needed
        if (Array.isArray(data) && data[0]) {
          // Filter for "recipe" type
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

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <RecipeListing
      posts={posts}
      error={error}
      isLoaded={isLoaded}
      loadPosts={loadPosts}
    />
  );
};

export default RecipeCollection;
