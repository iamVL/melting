import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../TipDetails.css";

const TipDetails = () => {
  const { id } = useParams();
  const [tip, setTip] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false); // 🌟 Important flag

  // ✅ Fetch tip
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setTip(data))
      .catch((err) => setError(err));
  }, [id]);

  // ✅ Load & normalize reviews
  useEffect(() => {
    const storedReviews = localStorage.getItem(`tip-reviews-${id}`);
    if (storedReviews) {
      const parsed = JSON.parse(storedReviews);
      const normalized = parsed.map((r) => ({
        name: r.name || "",
        text: r.text || "",
        rating: r.rating || 0,
        like: r.like ?? 0,
        dislike: r.dislike ?? 0,
        reaction: r.reaction ?? null,
      }));
      setReviews(normalized);
    }
    setReviewsLoaded(true); // ✅ Flag as loaded
  }, [id]);

  // ✅ Save to localStorage only after reviews are loaded
  useEffect(() => {
    if (reviewsLoaded) {
      localStorage.setItem(`tip-reviews-${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id, reviewsLoaded]);

  // ✅ Add new review
  const handleAddReview = (review) => {
    const newReview = {
      ...review,
      like: 0,
      dislike: 0,
      reaction: null,
    };
    setReviews([...reviews, newReview]);
  };

  // ✅ Like/Dislike reaction
  const handleReaction = (index, type) => {
    setReviews((prevReviews) =>
      prevReviews.map((review, i) => {
        if (i !== index) return review;

        let updated = { ...review };
        if (review.reaction === type) {
          updated.reaction = null;
          type === "like" ? updated.like-- : updated.dislike--;
        } else {
          if (review.reaction === "like") updated.like--;
          if (review.reaction === "dislike") updated.dislike--;
          type === "like" ? updated.like++ : updated.dislike++;
          updated.reaction = type;
        }
        return updated;
      })
    );
  };

  // ✅ Delete review
  const handleDeleteReview = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews.splice(index, 1);
    setReviews(updatedReviews);
  };

  // ✅ Average rating
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (error) return <p>Error loading tip.</p>;
  if (!tip) return <p>Loading...</p>;

  return (
    <div className="tip-details-container">
      <div className="tip-main-content">
        <div className="tip-header-container">
          <div className="tip-header-text">
            <h2 className="tip-details-title">{tip.content}</h2>
            <p className="tip-details-description">{tip.attributes?.description}</p>
          </div>

          {tip.attributes?.mainImage && (
            <img
              src={tip.attributes.mainImage}
              alt={tip.content}
              className="tip-details-main-image"
            />
          )}
        </div>

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
                <img
                  src={step.image}
                  alt={`Step ${index + 1}`}
                  className="tip-step-image"
                />
              )}
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="bottom-review-section">
          <h3 className="review-title">Reviews</h3>
          <p className="review-average">
            ⭐ Average Rating: {getAverageRating()} / 5 ({reviews.length * 20}% positive)
          </p>

          <div className="review-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-box">
                <strong className="review-name">{r.name}</strong>
                <div className="review-stars">{"⭐".repeat(r.rating)}</div>
                <p className="review-text">{r.text}</p>
                <div className="review-reactions">
                  <button
                    className={`reaction-button ${r.reaction === "like" ? "active" : ""}`}
                    onClick={() => handleReaction(i, "like")}
                  >
                    👍 {r.like}
                  </button>
                  <button
                    className={`reaction-button ${r.reaction === "dislike" ? "active" : ""}`}
                    onClick={() => handleReaction(i, "dislike")}
                  >
                    👎 {r.dislike}
                  </button>
                  <button
                    className="reaction-button delete-button"
                    onClick={() => handleDeleteReview(i)}
                    title="Delete this review"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="review-subtitle">Leave a Review</h3>
          <form
            className="review-form"
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value;
              const text = e.target.text.value;
              const rating = parseInt(e.target.rating.value);
              if (!name || !text || !rating) return;
              handleAddReview({ name, text, rating });
              e.target.reset();
            }}
          >
            <div className="review-stars-input">
              <select name="rating" defaultValue="">
                <option value="" disabled>Select rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </select>
            </div>
            <input type="text" name="name" placeholder="Your Name" />
            <textarea name="text" placeholder="Your Review" />
            <button type="submit">Post Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TipDetails;
