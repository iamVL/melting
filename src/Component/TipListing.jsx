import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation
import "../TipListing.css"; // ✅ Ensure CSS is imported
import Tip from "../Component/Tip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const TipListing = ({ refresh, posts, error, isLoaded, type, loadPosts }) => {
  const currentUserID = sessionStorage.getItem("user"); // ✅ Get logged-in user ID

  const [searchQuery, setSearchQuery] = useState(""); // Search query for title
  const [advancedSearch, setAdvancedSearch] = useState(false); // Toggle advanced search
  const [descriptionQuery, setDescriptionQuery] = useState(""); // Search query for description

  if (!sessionStorage.getItem("token")) {
    return <div>Please Log In...</div>;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // ✅ Filter posts based on search criteria
  const filteredPosts = posts.filter((post) => {
    const matchesTitle = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDescription = post.attributes?.description?.toLowerCase().includes(descriptionQuery.toLowerCase());

    if (advancedSearch) {
      return matchesTitle && matchesDescription; // Both filters apply in advanced mode
    }
    return matchesTitle; // Basic search only checks title
  });

  const handleDelete = async (postID) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a post.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this tip?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${postID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Tip deleted successfully!");
        loadPosts(); // ✅ Refresh the list after deletion
      } else {
        const result = await response.json();
        alert("Error deleting tip: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      alert("Failed to delete the tip.");
    }
  };

  return (
    <div className="tip-container-2">
      <h2 className="tip-header-2">Cooking Tips & Tricks</h2>
      <p className="tip-subheader-2">Discover culinary secrets from around the world in this melting pot of flavors!</p>

      {/* ✅ Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title..."
          className="search-bar"
          style={{ width: "300px" }} // Force width
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="toggle-advanced-btn" onClick={() => setAdvancedSearch(!advancedSearch)}>
          {advancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
      </div>

      {/* ✅ Advanced Search Options */}
      {advancedSearch && (
        <div className="advanced-search-container">
          <input
            type="text"
            placeholder="Search by description..."
            className="search-bar"
            style={{ width: "300px" }} // Force width
            value={descriptionQuery}
            onChange={(e) => setDescriptionQuery(e.target.value)}
          />
        </div>
      )}

      {/* ✅ Display Filtered Tips */}
      {filteredPosts.length > 0 ? (
        <div className="tip-grid-2">
          {filteredPosts.map((post) => {
            const authorID = post.authorID;
            const mainImage = post.attributes?.mainImage;
            const description = post.attributes?.description || "No description available";

            return (
              <div key={post.id} className="tip-card-2">
                {mainImage && <img src={mainImage} alt={post.content} className="tip-image-2" />}
                <div className="tip-content-2">
                  <h3 className="tip-title-2">{post.content}</h3>
                  <p className="tip-description-2">{description}</p>

                  {/* ✅ "Read More" button linking to the full tip page */}
                  <Link to={`/tip/${post.id}`} className="read-more-button">Read More →</Link>

                  {/* ✅ Show delete button only if the user owns the post */}
                  {String(authorID) === String(currentUserID) && (
                    <button className="delete-button-2" onClick={() => handleDelete(post.id)}>🗑 Delete</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="tip-no-posts-2">No Cooking Tips Found</div>
      )}
    </div>
  );
};

export default TipListing;
