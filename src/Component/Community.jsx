import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Communities.css";
import Groups from "./Groups";
import GroupList from "./GroupList";
import CommentForm from "./CommentForm";

function CommunityPage() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch groups when the component mounts
  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch the groups list
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
          console.log("Fetched Groups:", result);
          setIsLoaded(true);
          setGroups(result); // Adjust if the API response is nested
        },
        (error) => {
          setIsLoaded(true);
          console.error(error);
        }
      );
  };

  // Fetch the selected group details, including its name
  useEffect(() => {
    if (selectedGroup) {
      fetch(`${process.env.REACT_APP_API_PATH}/groups/${selectedGroup}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setGroupName(data.name);  // Assuming the group name is in the `name` field
        })
        .catch((error) => console.error("Error fetching group details:", error));
    }
  }, [selectedGroup]);

  // Handle group click
  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
  };

  // Function to create a new group
  const createGroup = () => {
    const trimmedGroupName = newGroupName.trim();

    if (!trimmedGroupName) {
      setErrorMessage("Group name cannot be empty!");
      return;
    }

    setErrorMessage("");
    const groupData = { name: newGroupName, description: "New group created", attributes: {ownerID: sessionStorage.getItem("user"), description: "None"}};

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

        // automatically make user a member when creating the group
        fetch(process.env.REACT_APP_API_PATH + "/group-members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            userID: sessionStorage.getItem("user"),
            groupID: data.id,
          }),
        })
          .then((res) => res.json())
          .then(
            (result) => {
              console.log("result:",result);
            },
            (error) => {
              alert("error!");
            }
          );
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
        {isLoaded ? (
          <GroupList groups={groups} onGroupClick={handleGroupClick} />
        ) : (
          <p>Loading groups...</p>
        )}
      </div>

      {/* Show the group name if a group is selected */}
      {selectedGroup && (
        <div>
          <h2>Selected Group: {groupName}</h2>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
