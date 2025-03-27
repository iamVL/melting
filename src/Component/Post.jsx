import React from "react";
import "../App.css";
import helpIcon from "../assets/delete.png";

/*
  This will render a single post, minus all the comment and reaction stuff.
  post: the current post to load/display
  type: - postlist if the post is the main post (no parentId)
        - commentlist if the post is a comment (has a parentId)
  loadPosts: a function to reload posts/comments
*/
const Post = ({ post, type, loadPosts }) => {
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

  return (
    <div key={post.id} className={[type, "postbody"].join(" ")}>
      <div className="deletePost">
        user: {getUsername(post.author)}
        <span style={{ fontWeight: "normal" }}> ({post.created})</span>
        {showDelete()}
      </div>
      <div className="commentText">// {post.content}</div>
    </div>
  );
};

export default Post;
