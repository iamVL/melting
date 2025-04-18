import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";
import "../Friend.css";
import Default from "../assets/Default-Avatar.jpg"

const FriendList = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.loadFriends();
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  const updateConnection = (id, status) => {
    console.log(`Attempting to update connection ${id} to status ${status}`);

    //make the api call to the user controller with a PATCH request for updating a connection with another user
    fetch(process.env.REACT_APP_API_PATH + "/connections/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        attributes: { status: status, type: "friend" },
      }
      ),
    })

      .then((res) => res.json())
      .then(
        (result) => {
          props.setConnections([]);
          props.loadFriends();
        },
        (error) => {
          alert("error!");
        }
      );
  };

  const deleteConnection = (id, status) => {
    console.log(`Attempting to delete connection ${id} to status ${status}`);

    //make the api call to the user controller with a PATCH request for updating a connection with another user
    fetch(process.env.REACT_APP_API_PATH + "/connections/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((res) => {
        props.setConnections([]);
        props.loadFriends();
      });
  };
  const handleMessageClick = async (connectionUser) => {
    const fromUserID = sessionStorage.getItem("user");
    const toUserID = connectionUser.id;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_PATH}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ fromUserID, toUserID }),
      });

      const data = await res.json();
      const roomID = data.roomID;
      sessionStorage.setItem("roomID", roomID);
      sessionStorage.setItem("toUserID", toUserID);
      sessionStorage.setItem("toUsername", connectionUser.attributes.username);

      navigate(`/messages/${roomID}`);
    } catch (error) {
      console.error("Failed to get or create room:", error);
    }
  };

  // If the user is not blocked, show the block icon
  // Otherwise, show the unblock icon and update the connection
  // with the updateConnection function
  const conditionalAction = (status, id) => {
    console.log(`Rendering action based on status: ${status} for connection ${id}`);
    if (status === "active") {
      return (
        <button type="button" onClick={() => updateConnection(id, "blocked")}> Block </button>
      );
    } else {
      return (
        <button type="button" onClick={() => updateConnection(id, "active")}> Unblock </button>
      );
    }
  };

  useEffect(() => {
    const handleCreateRoom = (data) => {
      console.log("Received data on /room-created event:", data);
      if (data && data.roomID) {
        console.log("Navigating to room:", data.roomID);

        navigate(`/messages/${data.roomID}`);
        sessionStorage.setItem("toUserID", props.userId);
      }
    };

    //Listen for a response after room creation
    // socket.on is used to listen for incoming events from the server.
    // it's used to set up a listener for room creation
    // if it is the first time, it will create a room between the two users, otherwise it will join a room
    // that has already been established
    socket.on("/room-created", handleCreateRoom);
    // cleanup
    return () => {

      // when the user leaves the component/page, this socket.off will be called which will turn off the listener
      // for room creation
      socket.off("/room-created", handleCreateRoom);
    };
  }, [navigate, props.userId]);



  if (props.error) {
    return <div> Error: {props.error.message} </div>;
  } else if (!props.isLoaded) {
    return <div> Loading... </div>;
  } else {
    return (
      <div className="friend-posts">
          {/* the list comes back in oldest first order, reverse so newest shows at the top */}
          <h3>{props.title}</h3>
          <div className="friend-listing">
            {props.connections.reverse().map((connection) => (
              <div key={connection.id} className="user-list">
                <div className="friend-info">
                { (props.title === "Your Following") ?
                <>
                { connection.toUser.attributes.picture !== undefined  && connection.toUser.attributes.picture !== "" ?
                    <>
                      <img src={connection.toUser.attributes.picture} alt="user picture"/>
                    </>
                  :
                  <>
                      <img src={Default} alt="user picture"/>
                      </>
                  }
                  <div className="friend-information">
                    <p>
                      {connection.toUser.attributes.username}
                    </p>
                    <div className="friend-buttons">
                      <button type="button" onClick={() => handleMessageClick(connection.toUser)}> Message </button>
                      {conditionalAction(
                          connection.attributes.status,
                          connection.id
                        )}
                      <button type="button" onClick={() => deleteConnection(connection.id, connection.attributes.status)}> Remove </button>
                    </div>
                  </div></> : <>
                  { connection.fromUser.attributes.picture !== undefined  && connection.fromUser.attributes.picture !== "" ?
                    <>
                      <img src={connection.fromUser.attributes.picture} alt="user picture"/>
                    </>
                  :
                  <>
                      <img src={Default} alt="user picture" />
                      </>
                  }
                  <div className="friend-information">
                    <p>
                      {connection.fromUser.attributes.username}
                    </p>
                    <div className="friend-buttons">
                      <button type="button" onClick={() => handleMessageClick(connection.fromUser)}> Message </button>
                      <button type="button" onClick={() => deleteConnection(connection.id, connection.attributes.status)}> Remove </button>
                    </div>
                  </div></>}
                </div>
            </div>
            ))}
          </div>
      </div>
    );
  }
};

export default FriendList;