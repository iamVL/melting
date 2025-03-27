import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostForm from "./PostForm";
import Post from "./Post";  // Ensure Post component exists
import CommentForm from "./CommentForm";
import "../CommunityDetails.css";  // Ensure this file exists

const CommunityDetails = () => {
  const { communityId } = useParams();  // Get communityId from URL
  const [posts, setPosts] = useState([]);  // Stores posts
  const [selectedPostId, setSelectedPostId] = useState(null);  // Tracks selected post
  const [comments, setComments] = useState([]);  // Stores comments

  /** Fetch posts for this community */
  useEffect(() => {
    loadPosts();
  }, [communityId]);  // Reload when communityId changes

  /** Function to fetch posts */
  const loadPosts = () => {
    fetch(`/api/posts?communityId=${communityId}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  /** Function to fetch comments for a post */
  const loadComments = (postId) => {
    setSelectedPostId(postId);  // Set selected post
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  };

  return (
    <div className="community-container">
      <h2>Community Details: {communityId}</h2>

      {/* Post Form */}
      <PostForm loadPosts={loadPosts} />  {/* Ensure loadPosts is passed here */}

      <h3>Comments</h3>
      {posts.length === 0 ? (
        <p>No posts in this community yet. Be the first to post!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-container">
            <Post post={post} />  {/* Ensure Post component handles post details */}
            <button onClick={() => loadComments(post.id)}>View Comments</button>

            {/* Show comments only for the selected post */}
            {selectedPostId === post.id && (
              <div className="comments-container">
                <h4>Comments</h4>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <p>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}

                {/* Comment Form */}
                <CommentForm postId={post.id} loadComments={loadComments} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommunityDetails;


