import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import PostForm from "./PostForm";  // Import the PostForm component
import CommentForm from "./CommentForm";  // Import the CommentForm component
import "../CommunityDetails.css"

const CommunityDetails = () => {
  const { communityId } = useParams(); // Get the communityId from the URL parameters
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch posts for the current community
  useEffect(() => {
    fetch(`/api/posts?communityId=${communityId}`)  // Use `communityId` here
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, [communityId]);

  // Fetch comments for a specific post
  useEffect(() => {
    if (selectedPostId) {
      fetch(`/api/comments?postId=${selectedPostId}`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error("Error fetching comments:", err));
    }
  }, [selectedPostId]);

  // Function to reload posts
  const loadPosts = () => {
    fetch(`/api/posts?communityId=${communityId}`)  // Use `communityId` here
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  // Function to reload comments for the selected post
  const loadComments = (postId) => {
    setSelectedPostId(postId);  // Set the selected post ID
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  };

  return (
    <div>
      <h2>Community Details for Community {communityId}</h2>

      {/* Post Form */}
      <PostForm loadPosts={loadPosts} /> {/* Pass loadPosts to refresh the posts list */}

      <h3>Posts</h3>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <button onClick={() => loadComments(post.id)}>View Comments</button>

          {/* Display comments for the selected post */}
          {selectedPostId === post.id && (
            <div>
              <h4>Comments</h4>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id}>
                    <p>{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet. Be the first to comment!</p>
              )}

              {/* Comment Form for this post */}
              <CommentForm
                postId={post.id}
                loadComments={loadComments}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommunityDetails;


