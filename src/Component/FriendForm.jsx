import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete.jsx";
import "../Friend.css";

const FriendForm = ({ userid, loadFriends, connections, blocked }) => {
  const [friendname, setFriendname] = useState("");
  const [friendid, setFriendid] = useState("");
  const [responseMessage, setResponseMessage] = useState("");  // Error message state
  const [responseMessage2, setResponseMessage2] = useState(""); // Success message state
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_PATH + "/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result) {
            let names = [];
            result[0].forEach((element) => {
              if (element.attributes && element.attributes.username) {
                names.push(element);
              }
            });
            setUsers(names);
            setResponseMessage(""); // Clear any previous error messages
            setResponseMessage2(""); // Clear any previous success messages
          }
        },
        () => {
          setResponseMessage("Error fetching users.");
        }
      );
  }, []);

  const selectAutocomplete = (friendID) => {
    setFriendid(friendID);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const selfID = Number(sessionStorage.getItem("user"));
    const numericFriendID = Number(friendid);

    if (numericFriendID === selfID) {
      setResponseMessage("You cannot follow yourself.");
      setResponseMessage2(""); // Clear success message
      return;
    }

    const alreadyFollowing = connections.find(
      (conn) => conn.toUserID === numericFriendID
    );
    if (alreadyFollowing) {
      setResponseMessage("Person is blocked or you're already following");
      setResponseMessage2(""); // Clear success message
      return;
    }

    // Log to check if blocking data is correct
    console.log("Blocked Array:", blocked);
    const isBlockedByUser = blocked.some(
      (b) => b.fromUserID === selfID && b.toUserID === numericFriendID // You blocked this user
    );
    const isBlockedByTarget = blocked.some(
      (b) => b.fromUserID === numericFriendID && b.toUserID === selfID // This user blocked you
    );

    // Log the blocking conditions to help debug
    console.log("isBlockedByUser:", isBlockedByUser);
    console.log("isBlockedByTarget:", isBlockedByTarget);

    // Check if either user has blocked the other
    if (isBlockedByUser || isBlockedByTarget) {
      setResponseMessage("You cannot follow this person because they have blocked you or you have blocked them.");
      setResponseMessage2(""); // Clear success message
      return;
    }

    fetch(process.env.REACT_APP_API_PATH + "/connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        toUserID: friendid,
        fromUserID: sessionStorage.getItem("user"),
        attributes: { type: "friend", status: "active" },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setResponseMessage2("Friend followed successfully!");
          setResponseMessage(""); // Clear error message
          loadFriends();
          sessionStorage.setItem("refreshConnections", "true");
          sessionStorage.setItem("refreshPosts", "true");
        },
        () => {
          setResponseMessage("Error adding friend.");
          setResponseMessage2(""); // Clear success message
        }
      );
  };

  return (
    <>
      <form onSubmit={submitHandler} className="friend-form">
        <label style={{ color: "white", marginBottom: "0px" }}>
          Follow a Friend!
        </label>
        <Autocomplete
          suggestions={users}
          selectAutocomplete={(e) => selectAutocomplete(e)}
        />
        <input id="follow-submit" type="submit" value="submit" />
      </form>

      {responseMessage && (
        <div>
          <div className="alert error">{responseMessage}</div>
        </div>
      )}
      {responseMessage2 && (
        <div>
          <div className="alert success">{responseMessage2}</div>
        </div>
      )}
    </>
  );
};

export default FriendForm;
