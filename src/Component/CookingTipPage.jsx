import React, { useEffect, useState } from "react";
import TipListing from "./TipListing";
import { useLanguage } from "../translator/Languagecontext";
const Posts = ({ doRefreshPosts, appRefresh }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useLanguage();
  const loadPosts = () => {
    if (sessionStorage.getItem("token")) {
      let url = process.env.REACT_APP_API_PATH + "/posts?parentID="; // Remove attributes filter
  
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            setIsLoaded(true);
  
            // 🔥 Filter posts manually where postType === "tip"
            const filteredPosts = result[0].filter(
              (post) => post.attributes?.postType === "tip"
            );
  
            setPosts(filteredPosts);
            console.log("Got Tip Posts:", filteredPosts);
          }
        })
        .catch((err) => {
          setIsLoaded(true);
          setError(err);
          console.log("ERROR loading posts");
        });
    }
  };
  
  

  useEffect(() => {
    // the first thing we do when the component is ready is load the posts.
    loadPosts();
  }, []);

  return (
    <div>
      <TipListing
        refresh={appRefresh}
        posts={posts}
        error={error}
        isLoaded={isLoaded}
        type="postlist"
        loadPosts={loadPosts}
      />
    </div>
  );
};

export default Posts;
