import React, { useState, useEffect } from "react";
import "../App.css";
import CommentForm from "./CommentForm.jsx";
import helpIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import likeIcon from "../assets/thumbsup.png";
import dislikeIcon from "../assets/thumbsdown.png";

/* 
   This will render a single post, with all of the options like comments, delete, tags, etc. 
   post: the current post to load/display
   type: - postlist if the post is the main post (no parentId)
         - commentlist if the post is a comment (has a parentId)
   loadPosts: a function to reload posts/comments
*/
const Post = ({ post, type, loadPosts }) => {
  const [showModal, setShowModal] = useState(false);
  const [showTags, setShowTags] = useState(post.reactions.length > 0);
  const [comments, setComments] = useState(parseInt(post._count.children || 0));
  const [isLoaded, setIsLoaded] = useState(false);
  const [postComments, setPostComments] = useState([]);

  // Compute separate counts for "like" and "dislike"
  const likeCount = post.reactions.filter((r) => r.name === "like").length;
  const dislikeCount = post.reactions.filter((r) => r.name === "dislike").length;

  // Toggle/Remove existing "like" reaction
  const tagPost = (tag, thisPostID) => {
    let userReaction = -1;
    post.reactions.forEach((reaction) => {
      if (reaction.reactorID === parseInt(sessionStorage.getItem("user")) &&
          reaction.name === "like") {
        userReaction = reaction.id;
      }
    });

    if (userReaction >= 0) {
      // remove existing "like"
      fetch(process.env.REACT_APP_API_PATH + "/post-reactions/" + userReaction, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }).then(
        () => loadPosts(),
        (error) => alert("error!" + error)
      );
    } else {
      // add a new "like"
      fetch(process.env.REACT_APP_API_PATH + "/post-reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          reactorID: sessionStorage.getItem("user"),
          postID: thisPostID,
          name: "like",
        }),
      }).then(
        () => loadPosts(),
        (error) => alert("error!" + error)
      );
    }
  };

  // Toggle/Remove existing "dislike" reaction
  const dislikePost = (thisPostID) => {
    // Don’t allow disliking your own post
    if (post.authorID === parseInt(sessionStorage.getItem("user"))) {
      alert("You cannot dislike your own post!");
      return;
    }

    let userReaction = -1;
    post.reactions.forEach((reaction) => {
      if (
        reaction.reactorID === parseInt(sessionStorage.getItem("user")) &&
        reaction.name === "dislike"
      ) {
        userReaction = reaction.id;
      }
    });

    if (userReaction >= 0) {
      // remove existing "dislike"
      fetch(process.env.REACT_APP_API_PATH + "/post-reactions/" + userReaction, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }).then(
        () => loadPosts(),
        (error) => alert("error!" + error)
      );
    } else {
      // add a new "dislike"
      fetch(process.env.REACT_APP_API_PATH + "/post-reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          reactorID: sessionStorage.getItem("user"),
          postID: thisPostID,
          name: "dislike",
        }),
      }).then(
        () => loadPosts(),
        (error) => alert("error!" + error)
      );
    }
  };

  // Show/hide comment list
  const showHideComments = () => (showModal ? "comments show" : "comments hide");

  // Show/hide tag icons
  const showHideTags = () => {
    if (showTags) {
      // If we have any reactions, check if the current user has reacted
      if (post.reactions.length > 0) {
        for (let i = 0; i < post.reactions.length; i++) {
          if (post.reactions[i].reactorID === sessionStorage.getItem("user")) {
            return "tags show tag-active";
          }
        }
      }
      return "tags show";
    }
    return "tags hide";
  };

  // Delete post (if you're the author)
  const deletePost = (postID) => {
    fetch(process.env.REACT_APP_API_PATH + "/posts/" + postID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then(() => loadPosts())
      .catch((error) => alert("error!" + error));
  };

  // Load comments on this post
  const loadComments = () => {
    if (sessionStorage.getItem("token")) {
      const url = process.env.REACT_APP_API_PATH + "/posts?parentID=" + post.id;
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            setIsLoaded(true);
            setPostComments(result[0]);
            setComments(result[0].length);
          }
        })
        .catch((err) => {
          setIsLoaded(true);
          console.log("ERROR loading posts", err);
        });
    }
  };

  // Load comments whenever showModal is toggled
  useEffect(() => {
    loadComments();
    // eslint-disable-next-line
  }, [showModal]);

  // Return the block containing the "like/dislike" and comments
  const commentDisplay = () => (
    <div className="comment-block">
      <div className="tag-block">
        <button
          value="tag post"
          onClick={() => setShowTags((prev) => !prev)}
        >
          tag post
        </button>
      </div>
      <div name="tagDiv" className={showHideTags()}>
        {/* Like/Dislike Container */}
        <div className="like-dislike-buttons">
          {/* Like section */}
          <div className="like-box">
            <img
              src={likeIcon}
              className="comment-icon"
              onClick={() => tagPost("like", post.id)}
              alt="Like Post"
            />
            <span className="reaction-count">({likeCount})</span>
          </div>
          {/* Dislike section */}
          <div className="dislike-box">
            <img
              src={dislikeIcon}
              className="comment-icon"
              onClick={() => dislikePost(post.id)}
              alt="Dislike Post"
            />
            <span className="reaction-count">({dislikeCount})</span>
          </div>
        </div>
      </div>

      <div className="comment-indicator">
        <div className="comment-indicator-text">{comments} Comments</div>
        <img
          src={commentIcon}
          className="comment-icon"
          onClick={() => setShowModal((prev) => !prev)}
          alt="View Comments"
        />
      </div>
      <div className={showHideComments()}>
        <CommentForm
          parent={post.id}
          loadPosts={loadPosts}
          loadComments={loadComments}
        />
        <div className="posts">
          <div>
            {postComments.length > 0 &&
              postComments.map((comment) => (
                <Post
                  key={comment.id}
                  post={comment}
                  type="commentlist"
                  loadPosts={loadComments}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Show the delete icon if user is the author
  const showDelete = () => {
    if (post.authorID === parseInt(sessionStorage.getItem("user"))) {
      return (
        <img
          src={helpIcon}
          className="sidenav-icon deleteIcon"
          alt="Delete Post"
          title="Delete Post"
          onClick={() => deletePost(post.id)}
        />
      );
    }
    return null;
  };

  const getUsername = (author) => {
    if (author.attributes) {
      return author.attributes.username;
    }
    return "";
  };

  // Render the overall post
  return (
    <div key={post.id} className={[type, "postbody"].join(" ")}>
      <div className="deletePost">
        {getUsername(post.author)} ({post.created})
        {showDelete()}
      </div>
      <br />
      {post.content}
      {commentDisplay()}
    </div>
  );
};


export default Post;
