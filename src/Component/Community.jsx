import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Communities.css";
import Groups from "./Groups";
import GroupList from "./GroupList";
import commentIcon from "../assets/comment-icon.png";  

function CommunityPage() {
  const [groups, setGroups] = useState([]); 
  const [newGroupName, setNewGroupName] = useState(""); 
  const [isLoaded, setIsLoaded] = useState(false); 
  const [showSearchBar, setShowSearchBar] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Fetch groups when the component mounts
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    fetch(process.env.REACT_APP_API_PATH + "/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"), 
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setGroups(result); 
        },
        (error) => {
          setIsLoaded(true);
          console.error(error);
        }
      );
  };

  // Function to create a new group
  const createGroup = () => {
    const trimmedGroupName = newGroupName.trim();

    if (!trimmedGroupName) {
      setErrorMessage("Group name cannot be empty!"); // Set error message
      return; // Exit the function early
    }

    setErrorMessage(""); // Clear any previous error message
    const groupData = { name: newGroupName, description: "New group created" };

    fetch(process.env.REACT_APP_API_PATH + "/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify(groupData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Group Created:", data);
        fetchGroups(); 
        setNewGroupName(""); 
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  // Function to toggle between search bar and create group form
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <div className="ComHeading">
      <h2 className="MainHeading">Welcome to the Community Page</h2>
      <p className="SubHeading">
        Meet others who have the same food interests as you!
      </p>

      {/* Toggle Button */}
      <button className="toggle-btn" onClick={toggleSearchBar}>
        {showSearchBar ? "Create Group" : "Search Groups"}
      </button>

      {/* Conditional Rendering */}
      {showSearchBar ? (
        <div className="SearchBar">
          <input
            type="text"
            className="search-input"
            placeholder="Search groups..."
          />
        </div>
      ) : (
        <div className="CreateGroupForm">
          <input
            type="text"
            className="create-group-input"
            placeholder="Name of the Food Group"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button className="create-group-btn" onClick={createGroup}>
            Create Group
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      )}

      {/* Group list section */}
      <div className="GroupListSection">
        <h3>Communities</h3>
        {isLoaded ? (
          <GroupList groups={groups} />
        ) : (
          <p>Loading groups...</p>
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
