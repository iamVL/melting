import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm.jsx"; // ✅ Import the comment form
import Post from "./Post.jsx"; // ✅ Import the Post component for comments
import "../TipDetails.css"; // ✅ Ensure CSS is imported

const TipDetails = () => {
  const { id } = useParams(); // ✅ Get tip ID from the URL
  const [tip, setTip] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Fetch tip details
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setTip(data))
      .catch((err) => setError(err));

    loadComments(); // ✅ Load comments on first render
  }, [id]);

  // ✅ Function to load comments
  const loadComments = () => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data[0] || []))
      .catch((err) => setError(err));
  };

  // ✅ Function to add a new comment and update state immediately
  const handleCommentSubmit = () => {
    loadComments(); // ✅ Reload comments after submitting
  };

  if (error) return <p>Error loading tip.</p>;
  if (!tip) return <p>Loading...</p>;

  return (
    <div className="tip-details-container">
      {/* ✅ Main content and comments container */}
      <div className="tip-main-content">
        {/* ✅ Header Section with Title & Image */}
        <div className="tip-header-container">
          <div className="tip-header-text">
            <h2 className="tip-details-title">{tip.content}</h2>
            <p className="tip-details-description">{tip.attributes?.description}</p>
          </div>
          {tip.attributes?.mainImage && (
            <img src={tip.attributes.mainImage} alt={tip.content} className="tip-details-main-image" />
          )}
        </div>

        {/* ✅ Directions / Steps Section */}
        <h3 className="tip-directions-title">Directions</h3>
        <div className="tip-steps-container">
          {tip.attributes?.steps?.map((step, index) => (
            <div key={index} className="tip-step">
              <div className="tip-step-content">
                <div className="tip-step-header">
                  <span className="tip-step-number">{`Step ${index + 1}`}</span>
                  <h4 className="tip-step-title">{step.title}</h4>
                </div>
                <p className="tip-step-description">{step.description}</p>
              </div>
              {step.image && (
                <img src={step.image} alt={`Step ${index + 1}`} className="tip-step-image" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Comments Section (Now Updates Instantly) */}
      <div className="tip-comments-container">
        <h3 className="comments-title">Comments</h3>
        <CommentForm parent={id} loadPosts={handleCommentSubmit} loadComments={handleCommentSubmit} />
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Post key={comment.id} post={comment} type="commentlist" loadPosts={handleCommentSubmit} />
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipDetails;
