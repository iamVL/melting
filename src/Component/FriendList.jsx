import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Friend.css";
import Default from "../assets/Default-Avatar.jpg";

const FriendList = (props) => {
  const navigate = useNavigate();

  /* -------------------------------------------------
     Helpers
  ------------------------------------------------- */

  // 1 × per mount → refresh the list
  useEffect(() => {
    props.loadFriends();
  }, []);                   // eslint‑disable‑line react-hooks/exhaustive-deps

  const updateConnection = (id, status) => {
    fetch(process.env.REACT_APP_API_PATH + "/connections/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        attributes: { status, type: "friend" },
      }),
    })
      .then((res) => res.json())
      .then(
        () => {
          props.setConnections([]);
          props.loadFriends();
        },
        () => alert("error!")
      );
  };

  const deleteConnection = (id) => {
    fetch(process.env.REACT_APP_API_PATH + "/connections/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    }).then(() => {
      props.setConnections([]);
      props.loadFriends();
    });
  };

  /* -------------------------------------------------
     NEW → lightweight redirect for “Message” button
  ------------------------------------------------- */
  const goToChat = (friendId, friend) => {
    const myId = sessionStorage.getItem("user");
    const roomId = [Number(myId), Number(friendId)].sort((a, b) => a - b).join("-");
    navigate(`/chat/${roomId}`, { state: { friend } });
  };

  const conditionalAction = (status, id) =>
    status === "active" ? (
      <button type="button" onClick={() => updateConnection(id, "blocked")}>
        Block
      </button>
    ) : (
      <button type="button" onClick={() => updateConnection(id, "active")}>
        Unblock
      </button>
    );

  /* -------------------------------------------------
     Render
  ------------------------------------------------- */
  if (props.error) return <div>Error: {props.error.message}</div>;
  if (!props.isLoaded) return <div>Loading…</div>;

  return (
    <div className="friend-posts">
      <h3>{props.title}</h3>

      {/* newest first */}
      <div className="friend-listing">
        {props.connections
          .slice()                      // don’t mutate original
          .reverse()
          .map((connection) => {
            const friend =
              props.title === "Your Following"
                ? connection.toUser          // you follow THEM
                : connection.fromUser;       // they follow YOU

            return (
              <div key={connection.id} className="user-list">
                <div className="friend-info">
                  {friend.attributes.picture ? (
                    <img src={friend.attributes.picture} alt="user avatar" />
                  ) : (
                    <img src={Default} alt="user avatar" />
                  )}

                  <div className="friend-information">
                    <p>{friend.attributes.username}</p>

                    <div className="friend-buttons">
                      <button
                        className="message-btn"
                        type="button"
                        onClick={() => goToChat(friend.id, friend)}
                      >
                        Message
                      </button>

                      {/* keep existing Block/Unblock (only on “following” view) */}
                      {props.title === "Your Following" &&
                        conditionalAction(
                          connection.attributes.status,
                          connection.id
                        )}

                      <button
                      className="message-btn"
                        type="button"
                        onClick={() => goToChat(friend.id, friend)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FriendList;
