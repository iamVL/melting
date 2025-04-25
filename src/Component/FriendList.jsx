import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Friend.css";
import Default from "../assets/Default-Avatar.jpg";
import { useLanguage } from "../translator/Languagecontext";
const FriendList = (props) => {
  const navigate = useNavigate();
    const { t } = useLanguage();
  const myId = sessionStorage.getItem("user");

  useEffect(() => {
    props.loadFriends();
  }, []);

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
          // If the user is being blocked, remove the active connection (if they're following you)
          if (status === "blocked") {
            props.connections.forEach((connection) => {
              if (
                connection.attributes.status === "active" &&
                connection.toUser.id.toString() === myId &&
                connection.fromUser.id === id
              ) {
                deleteConnection(connection.id); // Delete the active following connection
              }
            });

            // Manually update the connections in the state to reflect that the user has been blocked
            props.setConnections((prevConnections) =>
              prevConnections.filter(
                (connection) =>
                  !(connection.toUser.id === id && connection.attributes.status === "active")
              )
            );
          }

          // Refresh connections after blocking
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

  const goToChat = (friendId, friend) => {
    const roomId = [Number(myId), Number(friendId)].sort((a, b) => a - b).join("-");
    navigate(`/chat/${roomId}`, { state: { friend } });
  };

  const conditionalAction = (status, id, title) => {
    // Don't render the block button for "People Who Follow You"
    if (title === "People Who Follow You") return null;

    return status === "active" ? (
      <button type="button" onClick={() => updateConnection(id, "blocked")}>
          {t('block')}
      </button>
    ) : (
      <button type="button" onClick={() => updateConnection(id, "active")}>
          {t('unblock')}
      </button>
    );
  };

  // Filtering out blocked users in all scenarios
  const filteredConnections =
    props.title === "Blocked Users"
      ? props.connections.filter(
          (connection) =>
            connection.attributes.status === "blocked" &&
            connection.fromUser.id.toString() === myId
        )
      : props.title === "Your Following"
      ? props.connections.filter(
          (connection) =>
            connection.attributes.status === "active" &&
            connection.fromUser.id.toString() === myId &&
            !props.connections.some(
              (conn) =>
                conn.toUser.id === connection.toUser.id &&
                conn.attributes.status === "blocked"
            )  // Exclude blocked users
        )
      : props.title === "People Who Follow You"
      ? props.connections.filter(
          (connection) =>
            connection.attributes.status === "active" &&
            connection.toUser.id.toString() === myId &&
            !props.connections.some(
              (conn) =>
                conn.fromUser.id === connection.fromUser.id &&
                conn.attributes.status === "blocked"
            )  // Exclude blocked users
        )
      : props.connections.filter(
          (connection) =>
            connection.attributes.status !== "blocked" // General filter for blocked users
        );

  if (props.error) return <div>Error: {props.error.message}</div>;
  if (!props.isLoaded) return <div>Loading…</div>;

  return (
    <div className="friend-posts">
      <h3>{props.title}</h3>

      <div className="friend-listing">
        {filteredConnections
          .slice()
          .reverse()
          .map((connection) => {
            const friend =
              connection.toUser.id.toString() === myId
                ? connection.fromUser
                : connection.toUser;

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
                      {props.title !== "Blocked Users" && connection.attributes.status !== "blocked" && (
                        <button
                          className="message-btn"
                          type="button"
                          onClick={() => goToChat(friend.id, friend)}
                        >
                            {t('message')}
                        </button>
                      )}

                      {props.title !== "Blocked Users" && (
                        <button
                          className="message-btn"
                          type="button"
                          onClick={() => deleteConnection(connection.id)}
                        >
                            {t('remove')}
                        </button>
                      )}

                      {props.title === "Your Following" &&
                        conditionalAction(connection.attributes.status, connection.id, props.title)}

                      {props.title === "Blocked Users" && (
                        <button
                          className="message-btn"
                          type="button"
                          onClick={() => deleteConnection(connection.id)}
                        >
                            {t('unblock')}
                        </button>
                      )}
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
