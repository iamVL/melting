import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "../RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [reviews, setReviews] = useState([]);
  const reviewsRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${id}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [id]);

  const scrollLeft = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRatingPercentage = () => {
    return ((getAverageRating() / 5) * 100).toFixed(0);
  };

  const handleCommentSubmit = () => {
    if (commentName && commentText && rating > 0) {
      const newReview = {
        name: commentName,
        text: commentText,
        rating: rating,
      };

      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));

      setCommentName("");
      setCommentText("");
      setRating(0);
    } else {
      alert("Please fill in all fields for the review.");
    }
  };

  const handleDeleteReview = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews.splice(index, 1);
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
  };

  const ReviewItem = ({ review, index }) => {
    const [like, setLike] = useState(0);
    const [dislike, setDislike] = useState(0);
    const [reaction, setReaction] = useState(null);

    const toggleReaction = (type) => {
      if (reaction === type) {
        setReaction(null);
        type === "like" ? setLike(like - 1) : setDislike(dislike - 1);
      } else {
        if (reaction === "like") setLike(like - 1);
        if (reaction === "dislike") setDislike(dislike - 1);
        type === "like" ? setLike(like + 1) : setDislike(dislike + 1);
        setReaction(type);
      }
    };

    return (
      <div className="review-item">
        <div className="review-header">
          <strong>{review.name}</strong>
          <div className="review-rating">
            {Array.from({ length: review.rating }, (_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
        </div>
        <p className="review-text">{review.text}</p>
        <div className="review-reactions">
          <button
            className={`reaction-button ${reaction === "like" ? "active" : ""}`}
            onClick={() => toggleReaction("like")}
          >
            👍 {like}
          </button>
          <button
            className={`reaction-button ${reaction === "dislike" ? "active" : ""}`}
            onClick={() => toggleReaction("dislike")}
          >
            👎 {dislike}
          </button>
          <button
            className="reaction-button delete-button"
            onClick={() => handleDeleteReview(index)}
            title="Delete this review"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) return <p>Loading recipe details...</p>;
  if (error) return <p>Error loading recipe: {error.message}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="recipe-details-container">
      <div className="back-to-recipes">
        <Link to="/recipes" className="back-button">
          ← All Recipes
        </Link>
      </div>

      <div className="recipe-content">
        {/* Recipe Header */}
        <div className="recipe-header">
          <div className="recipe-text-content">
            <h2 className="recipe-title">{recipe.attributes?.title}</h2>
            <p className="recipe-description">{recipe.content}</p>
          </div>
          {recipe.attributes?.image && (
            <img src={recipe.attributes.image} alt={recipe.attributes.title} className="recipe-image-top" />
          )}
        </div>

        {/* Ingredients */}
        <div className="recipe-section">
          <h3 className="ingredients">Ingredients</h3>
          <ul className="recipe-ingredients-list">
            {recipe.attributes?.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="recipe-section">
          <h3 className="steps">Recipe Instructions</h3>
          <div className="steps-container">
            {recipe.attributes?.steps?.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-title">Step {index + 1}</div>
                <p className="step-instruction">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="recipe-section">
          <h3 className="reviews">Reviews</h3>
          {reviews.length > 0 && (
            <div className="average-rating">
              ⭐ Average Rating: {getAverageRating()} / 5 ({getRatingPercentage()}% positive)
            </div>
          )}

          {reviews.length > 2 && (
            <div className="scroll-buttons">
              <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>
              <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
            </div>
          )}

          <div className="reviews-list" ref={reviewsRef}>
            {reviews.map((review, index) => (
              <ReviewItem key={index} review={review} index={index} />
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="recipe-section">
          <h3 className="leave-comment">Leave a Review</h3>
          <div className="comment-form">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Your Name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
            />
            <textarea
              placeholder="Your Review"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Post Review</button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="recipe-sidebar">
        <div className="sidebar-section">
          <h4>Total Time</h4>
          <div className="total-time-display">
            {recipe.attributes?.totalTime || "N/A"}
          </div>
        </div>
        <div className="sidebar-section">
          <h4>Cooking Level</h4>
          <div className="cooking-level-display">
            {recipe.attributes?.difficulty || "Medium"}
          </div>
        </div>
        <div className="sidebar-section">
          <h4>Serving Size</h4>
          <div className="serving-size-display">
            {recipe.attributes?.servingSize}
          </div>
        </div>
        <div className="sidebar-section">
          <h4>Cuisine</h4>
          <div className="cuisine-tags">
            {Array.isArray(recipe.attributes?.cuisine)
              ? recipe.attributes.cuisine.map((cuisine, index) => (
                  <div key={index} className="cuisine-tag">
                    {cuisine}
                  </div>
                ))
              : <div className="cuisine-tag">{recipe.attributes?.cuisine}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
