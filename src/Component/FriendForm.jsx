import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete.jsx";
import "../Friend.css";
import { useLanguage } from "../translator/Languagecontext";

const FriendForm = ({ userid, loadFriends, connections, blocked }) => {
  const { t } = useLanguage();
  const [friendname, setFriendname] = useState("");
  const [friendid, setFriendid] = useState("");
  const [responseMessage, setResponseMessage] = useState("");  // Error message
  const [responseMessage2, setResponseMessage2] = useState(""); // Success message
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
                setResponseMessage("");
                setResponseMessage2("");
              }
            },
            () => {
              setResponseMessage(t("friendform_error_fetching_users"));
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
      setResponseMessage(t("friendform_error_follow_self"));
      setResponseMessage2("");
      return;
    }

    const alreadyFollowing = connections.find(
        (conn) => conn.toUserID === numericFriendID
    );
    if (alreadyFollowing) {
      setResponseMessage(t("friendform_error_already_following"));
      setResponseMessage2("");
      return;
    }

    const isBlockedByUser = blocked.some(
        (b) => b.fromUserID === selfID && b.toUserID === numericFriendID
    );
    const isBlockedByTarget = blocked.some(
        (b) => b.fromUserID === numericFriendID && b.toUserID === selfID
    );

    if (isBlockedByUser || isBlockedByTarget) {
      setResponseMessage(t("friendform_error_blocked"));
      setResponseMessage2("");
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
            () => {
              setResponseMessage2(t("friendform_success"));
              setResponseMessage("");
              loadFriends();
              sessionStorage.setItem("refreshConnections", "true");
              sessionStorage.setItem("refreshPosts", "true");
            },
            () => {
              setResponseMessage(t("friendform_error_adding"));
              setResponseMessage2("");
            }
        );
  };

  return (
      <>
        <form onSubmit={submitHandler} className="friend-form">
          <label style={{ color: "white", marginBottom: "0px" }}>
            {t("friendform_label")}
          </label>
          <Autocomplete
              suggestions={users}
              selectAutocomplete={(e) => selectAutocomplete(e)}
          />
          <input id="follow-submit" type="submit" value={t("friendform_submit")} />
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
