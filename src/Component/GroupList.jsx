import React, { useState, useEffect } from "react";
import blockIcon from "../assets/block_white_216x216.png";
import unblockIcon from "../assets/thumbsup.png";
import deleteIcon from "../assets/delete.png";
import { Link } from 'react-router-dom';
import { useLanguage } from "../translator/Languagecontext";

const GroupList = () => {
  const userID = parseInt(sessionStorage.getItem("user"));
  const groupID = useState("");

  const [groups, setGroups] = useState([]);
  const [mygroups, setMygroups] = useState([]);
  const [mygroupIDs, setMygroupIDs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    loadGroups();
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  const currentUserID = sessionStorage.getItem("user");

  // this will load all available groups
  const loadGroups = () => {
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
          if (result) {
            setIsLoaded(true);
            setGroups(result[0]);
          }
          // now, pull all the groups that the current user belongs to.  This allows us to mark each groups
          // membership status
          fetch(
            process.env.REACT_APP_API_PATH +
              "/group-members?userID=" +
              sessionStorage.getItem("user"),
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          )
            .then((res2) => res2.json())
            .then(
              (result2) => {
                if (result2) {
                  let memberships = [];
                  let membershipIDs = [];
                  if (Array.isArray(result2)) {
                    console.log("GOT MEMBERS ", result2[0]);
                    membershipIDs = result2[0].map(
                      (groupmember) => groupmember.groupID
                    );
                    memberships = result2[0];
                    console.log("GROUP LIST", memberships);
                  } else {
                    membershipIDs.push(result2.groupID);
                    memberships.push(result2);
                  }
                  setIsLoaded(true);
                  setMygroupIDs(membershipIDs);
                  setMygroups(memberships);
                }
              },
              (error) => {
                setIsLoaded(true);
                setError(error);
              }
            );
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  // THIS IS AN EXAMPLE CALL ONLY
  // if you want to update a group, this will update the name of group 1 to "test".
  // Naturally, you would want to make sure that the user was the owner of the
  // group, and allow them to type in new information, etc.
  const testGroupUpdate = () => {
    fetch(process.env.REACT_APP_API_PATH + "/groups/1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: "test",
        attributes: { test: "test" },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        loadGroups();
      });
  };

  // THIS IS AN EXAMPLE CALL ONLY
  // if you want to add a group, you would probably want to let the user define all of this!
  const testGroupAdd = () => {
    fetch(process.env.REACT_APP_API_PATH + "/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: "Test ADD Group",
        attributes: { test: "test" },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        loadGroups();
      });
  };

  // THIS IS AN EXAMPLE CALL ONLY - it lets anyone delete the group, and it doesn't do any
  // clean up of group members...
  const deleteGroup = (gid) => {
    fetch(process.env.REACT_APP_API_PATH + "/groups/" + gid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    }).then((result) => {
      loadGroups();
    });
  };

  const getGroupMemberId = (groupid) => {
    console.log("LOOKING FOR GROUP", groupid);
    for (const membership of mygroups) {
      console.log("MEMBERSHIP", membership);
      if (membership.groupID === groupid) {
        console.log("returning ", membership.id);
        return membership.id;
      } else {
        console.log(membership.groupID, "is not ", groupid);
      }
    }
    return -1;
  };

  // updateConnection will toggle the membership of the current user in the selected group.
  // if they are active, this makes them inactive, and vice-versa.
  const updateConnection = (id, status) => {
    //make the api call to the group-members list
    if (status === "inactive") {
      fetch(
        process.env.REACT_APP_API_PATH +
          "/group-members/" +
          getGroupMemberId(id),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      ).then((response) => {
        if (response.status === 204) {
          //alert("deleted");
        } else if (response.status === 404) {
          //alert("membership not found");
        }
        setResponseMessage(response.Status);

        console.log("LOADING GROUPS");
        loadGroups();
      });
    } else {
      if (getGroupMemberId(id) != -1) {
        console.log("Member is already in the group");
        return;
      }
      fetch(process.env.REACT_APP_API_PATH + "/group-members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          userID: sessionStorage.getItem("user"),
          groupID: id,
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setResponseMessage(result.Status);
            loadGroups();
          },
          (error) => {
            alert("error!");
          }
        );
    }
  };

  // This method will render the icon indicating group membership.  If the list of current groups
  // for the logged in user includes this group, we'll show the block icon (you will naturally want to pick a better one)
  // and if not, it shows the unblock icon.  It also sets the clickhandler for the icons to the
  // appropriate update call, to either add or remove the current user from that group.
  const conditionalAction = (id) => {
    if (mygroupIDs.includes(id)) {
      return (
        <img
          src={blockIcon}
          className="sidenav-icon deleteIcon"
          alt="Block User"
          title="Block User"
          onClick={(e) => updateConnection(id, "inactive")}
        />
      );
    } else {
      return (
        <img
          src={unblockIcon}
          className="sidenav-icon deleteIcon"
          alt="Unblock User"
          title="Unblock User"
          onClick={(e) => updateConnection(id, "active")}
        />
      );
    }
  };

  // Draw the list of available groups to the screen, and for each one,
  // indicate if the current user is a member or not.  Note that this uses
  // poorly named styles borrowed from other screens - you would probably want
  // to update those to be specific to the way you manage groups.

  if (error) {
    return <div>{t("error")}: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>{t("loading")}</div>;
  } else {
    return (
        <div>
          <p style={{ color: "black", marginBottom: "0px" }}>{t("my_communities")}</p>
          <div className="community-box">
            {mygroups.map((group) => (
                <div key={group.groupID} className="community-model">
                  <h4>{group.group.name}</h4>
                  <div className="group-buttons">
                    {group.group.attributes?.ownerID == userID ? (
                        <button onClick={() => deleteGroup(group.groupID)}>{t("delete")}</button>
                    ) : (
                        <button onClick={() => updateConnection(group.groupID, "inactive")}>{t("leave")}</button>
                    )}
                    <a
                        href={`/hci/teams/melting/community-details/${group.groupID}/${group.group.name}`}
                        onClick={() => console.log(`Viewing ${group.name}`)}
                    >
                      {t("view_community")}
                    </a>
                  </div>
                </div>
            ))}
          </div>
          <p style={{ color: "black", marginBottom: "0px" }}>{t("all_communities")}</p>
          <div className="community-box">
            {groups.map((group) => (
                <div key={group.id} className="community-model">
                  <h4>{group.name}</h4>
                  <button onClick={() => updateConnection(group.id, "active")}>{t("join")}</button>
                </div>
            ))}
          </div>
        </div>
    );
  }

};

export default GroupList;