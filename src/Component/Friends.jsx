import React, { useState, useEffect } from "react";
import FriendForm from "./FriendForm";
import FriendList from "./FriendList";
import { useNavigate } from "react-router-dom";
import "../Friend.css";

const Friends = () => {
  const [connections, setConnections] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [blockedByYou, setBlockedByYou] = useState([]);
  const [blockedByOthers, setBlockedByOthers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userToken = sessionStorage.getItem("token");

  useEffect(() => {
    console.log(userToken);

    if (!userToken) {
      navigate("/");
    }
  }, [userToken, navigate]);

  const loadConnections = () => {
    fetch(
      process.env.REACT_APP_API_PATH +
        "/connections?fromUserID=" +
        sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setConnections(result[0]);

          // Extract who you blocked
          const blocked = result[0].filter(
            (conn) => conn.attributes.status === "blocked"
          );
          setBlockedByYou(blocked);
        },
        (error) => {
          setError(error);
        }
      );
  };

  const loadFollowers = () => {
    fetch(
      process.env.REACT_APP_API_PATH +
        "/connections?toUserID=" +
        sessionStorage.getItem("user"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setFollowers(result[0]);

          // Extract users who blocked you
          const blockedYou = result[0].filter(
            (conn) => conn.attributes.status === "blocked"
          );
          setBlockedByOthers(blockedYou);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    loadConnections();
    loadFollowers();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="friends-page-container">
        <div className="add-a-friend">
          <FriendForm
            userid={sessionStorage.getItem("user")}
            loadFriends={loadConnections}
            connections={connections}
            blocked={[...blockedByYou, ...blockedByOthers]} // Combining both blocked lists
          />
        </div>

        <FriendList
          title="Your Following"
          userid={sessionStorage.getItem("user")}
          loadFriends={loadConnections}
          connections={connections.filter(
            (conn) => conn.attributes.status !== "blocked"
          )}
          setConnections={setConnections}
          isLoaded={isLoaded}
          error={error}
        />

        <FriendList
          title="People Who Follow You"
          userid={sessionStorage.getItem("user")}
          loadFriends={loadFollowers}
          connections={followers.filter(
            (conn) => conn.attributes.status !== "blocked"
          )}
          setConnections={setFollowers}
          isLoaded={isLoaded}
          error={error}
        />

        <FriendList
          title="Blocked Users"
          userid={sessionStorage.getItem("user")}
          loadFriends={loadConnections}
          connections={[...blockedByYou, ...blockedByOthers]} // Showing blocked relationships from both sides
          setConnections={(setBlockedByYou, setBlockedByOthers)} // Handles both blocked lists
          isLoaded={isLoaded}
          error={error}
        />
      </div>
    );
  }
};

export default Friends;
