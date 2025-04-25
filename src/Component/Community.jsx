import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Communities.css";
import Groups from "./Groups";
import GroupList from "./GroupList";
import CommentForm from "./CommentForm";
import Modal from "../Component/Modal";
import { useLanguage } from "../translator/Languagecontext";

function CommunityPage() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useLanguage();

  const foodQuotes = [
    t("quote_1"),
    t("quote_2"),
    t("quote_3"),
    t("quote_4"),
    t("quote_5")
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    fetchGroups();
  }, []);

  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % foodQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
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
        .then((result) => {
          setIsLoaded(true);
          setGroups(result);
        })
        .catch((error) => {
          setIsLoaded(true);
          console.error(error);
        });
  };

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
            setGroupName(data.name);
          })
          .catch((error) => console.error("Error fetching group details:", error));
    }
  }, [selectedGroup]);

  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
  };

  const createGroup = () => {
    if (newGroupName === "") {
      setError("New Group cannot have an empty name!");
      setShowErrorModal(true);
      return;
  }

    const trimmedGroupName = newGroupName.trim();
    if (!trimmedGroupName) {
      setErrorMessage(t("error_group_name_empty"));
      return;
    }

    setErrorMessage("");
    const groupData = {
      name: newGroupName,
      description: "New group created",
      attributes: { ownerID: sessionStorage.getItem("user"), description: "None" }
    };

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
          fetchGroups();
          setNewGroupName("");
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
          });
        })
        .catch((error) => {
          console.error("Error creating group:", error);
        });
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
      <div className="ComHeading">
        <h2 className="MainHeading">🍽️ {t("main_heading")}</h2>
        <p className="SubHeading">{t("sub_heading")}</p>
        <div className="quote-ticker-container">
          <div className="quote-ticker">
            <span>{foodQuotes[currentQuoteIndex]}</span>
          </div>
        </div>

        <button className="toggle-btn" onClick={toggleSearchBar}>
          {showSearchBar ? `👨‍🍳 ${t("start_group")}` : `🔍 ${t("back_to_search")}`}
        </button>

        {showSearchBar ? (<>
        </>
        ) : (
            <div className="CreateGroupForm">
              <input
                  type="text"
                  className="create-group-input"
                  placeholder={t("group_name_placeholder")}
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
              />
              <button className="create-group-btn" onClick={createGroup}>
                🚀 {t("create_button")}
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        )}

        <div className="GroupListSection">
          {isLoaded ? (
              <GroupList groups={groups} onGroupClick={handleGroupClick} />
          ) : (
              <p>{t("loading_groups")}</p>
          )}
        </div>

        {selectedGroup && (
            <div>
              <h2>{t("selected_group")}: {groupName}</h2>
            </div>
        )}
        <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
            <h2 style={{ color: "#b00020" }}>⚠️ Error</h2>
            <p>{error || t("somethingWentWrong")}</p>
            <button className="modal-button" onClick={() => setShowErrorModal(false)}>{t("close")}</button>
        </Modal>
      </div>
  );
}

export default CommunityPage;
