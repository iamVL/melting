import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../TipDetails.css";

import { useLanguage } from "../translator/Languagecontext";
const TipDetails = () => {
  const { id } = useParams();
  const [tip, setTip] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false); // 🌟 Important flag


  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const reviewsRef = useRef(null);
  const { t } = useLanguage();

  
  // ✅ Fetch tip
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setTip(data))
      .catch((err) => setError(err));
  }, [id]);

  useEffect(() => {
    const findReviews = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=${id}`);
      const data = await res.json();
      setReviews(data[0]);
    };

    findReviews();
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
    const totalRating = reviews.reduce((sum, review) => sum + review.attributes.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRatingPercentage = () => ((getAverageRating() / 5) * 100).toFixed(0);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (rating === 0) {
      alert("Choose a rating 1-5!");
      return;
    } else if (commentText === "") {
      alert("Fill in a review!");
      return;
    }

    fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        content: commentText,
        parentID: id,
        attributes: {
          postType: "review",
          rating: rating,
          likes: [],
          dislikes: [],
        },
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        setReviews((prev) => [result, ...prev]);
        setCommentText("");
        setRating(0);   
        console.log(result);
      })
      .catch((error) => {
        console.log("Review Submit error:", error);
      });
  };

  const handleCommentUpdate = (review, editComment, editRating) => {
    if (editComment === "") {
      alert("Review cannot be blank!");
      return;
    }
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${review.id}`, {
        method:"PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          authorID: sessionStorage.getItem("user"),
          content: editComment,
          parentID: review.parentID,
          attributes: {
            postType: "review",
            rating: editRating,
            likes: review.attributes.likes || [],
            dislikes: review.attributes.dislikes || [],
          },
        })
      })
      .then(async (res) => {
        const result = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === result.id ? result : r))
        );        
        console.log("Edited Review:", result);
      })
      .catch((error) => {
        console.log("Review Update error:", error);
      });
    }

  const handleDeleteReview = (reviewID) => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${reviewID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }) .then((res) => {
      setReviews((prev) => prev.filter((r) => r.id !== reviewID));
    })
  };

  const ReviewItem = ({ review, index, setReviews}) => {
    const [like, setLike] = useState(0);
    const [dislike, setDislike] = useState(0);
    const [reaction, setReaction] = useState(null);
    const [showFull, setShowFull] = useState(false);

    const [editReview, setEditReview] = useState(null);
    const [editComment, setEditComment] = useState(review.content);
    const [editRating, setEditRating] = useState(review.attributes?.rating);

    const toggleReaction = (type, review) => {
      if (type === "like") {
        let new_likes = [...review.attributes.likes];

        if (new_likes.some(like => like.userID === sessionStorage.getItem("user"))) {
          for (let i = 0; i <new_likes.length; i++) {
            if (new_likes[i].userID === sessionStorage.getItem("user")) {
              new_likes.splice(i, 1);
              break;
            }
          }
        } else {
          new_likes.push({userID: sessionStorage.getItem("user")});
        }

        fetch(`${process.env.REACT_APP_API_PATH}/posts/${review.id}`, {
          method:"PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            authorID: review.authorID,
            content: review.content,
            parentID: review.parentID,
            attributes: {
              postType: "review",
              rating: review.attributes.rating,
              likes: new_likes || [],
              dislikes: review.attributes.dislikes || [],
            },
          })
        })
        .then(async (res) => {
          const result = await res.json();
          setReviews(prev =>
            prev.map(r => (r.id === result.id ? result : r))
          );
          console.log(result);
        })
        .catch((error) => {
          console.log("Review Update error:", error);
        })
      } else if (type === "dislike") {
        let new_dislikes = [...review.attributes.dislikes];

        if (new_dislikes.some(dislike => dislike.userID === sessionStorage.getItem("user"))) {
          for (let i = 0; i <new_dislikes.length; i++) {
            if (new_dislikes[i].userID === sessionStorage.getItem("user")) {
              new_dislikes.splice(i, 1);
              break;
            }
          }
        } else {
          new_dislikes.push({userID: sessionStorage.getItem("user")});
        }

        fetch(`${process.env.REACT_APP_API_PATH}/posts/${review.id}`, {
          method:"PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            authorID: review.authorID,
            content: review.content,
            parentID: review.parentID,
            attributes: {
              postType: "review",
              rating: review.attributes.rating,
              likes: review.attributes.likes || [],
              dislikes: new_dislikes || [],
            },
          })
        })
        .then(async (res) => {
          const result = await res.json();
          setReviews(prev =>
            prev.map(r => (r.id === result.id ? result : r))
          );
          console.log(result);
        })
        .catch((error) => {
          console.log("Review Update error:", error);
        })
      }
    };

    return (
        <div className={`review-item ${showFull ? "expanded" : ""}`}>
          { editReview !== review.id ? (<>

          <div className="review-header">
            <strong>{review.author.attributes?.username}</strong>
            <div className="review-rating">
              {Array.from({ length: review.attributes?.rating }, (_, i) => (
                  <span key={i} className="star">★</span>
              ))}
              {Array.from({ length: 5 - review.attributes?.rating }, (_, i) => (
                  <span key={i} className="empty-stars">★</span>
              ))}
            </div>
          </div>

          <div className={`review-text ${showFull ? "expanded" : "collapsed"}`}>
            {review.content}
          </div>

          {review.content.length > 100 && (
              <button className="show-more-button" onClick={() => setShowFull(!showFull)}>
                {showFull ? "Show Less" : "Show More"}
              </button>
          )}
            <div className="review-reactions">
              <button className={`reaction-button ${reaction === "like" ? "active" : ""}`} onClick={() => toggleReaction("like", review)}>👍 {review.attributes.likes.length}</button>
              <button className={`reaction-button ${reaction === "dislike" ? "active" : ""}`} onClick={() => toggleReaction("dislike", review)}>👎 {review.attributes.dislikes.length}</button>
              {parseInt(review.authorID) === parseInt(sessionStorage.getItem("user")) &&
                <button className="reaction-button delete-button" onClick={() => {setEditReview(review.id); setEditRating(review.attributes?.rating); setEditComment(review.content);}}>Edit ✏️</button>
              }
            </div>
            </> ) : ( <>
              <div className="review-header">
                <strong>{review.author.attributes?.username}</strong>
                <div className="empty-stars-background">
                  {[1, 2, 3, 4, 5].map((star) => (
                      <span
                          key={star}
                          className={`star ${star <= editRating ? "edit-active" : "edit"}`}
                          onClick={() => setEditRating(star)}
                      >★</span>
                  ))}
                </div>
                <div className="rating-stars">
              </div>
              </div>

              <textarea id="review-textarea" placeholder="Enter review text" value={editComment} onChange={(e) => setEditComment(e.target.value)} />

              <div className="review-reactions">
                <button className="reaction-button delete-button" onClick={() => handleDeleteReview(review.id)}>🗑️</button>
                <button className="reaction-button delete-button" onClick={() => handleCommentUpdate(review, editComment, editRating)}>Save</button>
                <button className="reaction-button delete-button" onClick={() => setEditReview(null)}>Cancel</button>
              </div>
            </>
            )
          }
        </div>
    );
  };

  if (error) return <p>{t("error_loading_tip")}</p>;
  if (!tip) return <p>{t("loading_tip")}</p>;

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

          <h3 className="tip-directions-title">{t("tip_directions")}</h3>
          <div className="tip-steps-container">
            {tip.attributes?.steps?.map((step, index) => (
                <div key={index} className="tip-step">
                  <div className="tip-step-content">
                    <div className="tip-step-header">
                      <span className="tip-step-number">{`${t("tip_step")} ${index + 1}`}</span>
                      <h4 className="tip-step-title">{step.title}</h4>
                    </div>
                    <p className="tip-step-description">{step.description}</p>
                  </div>
                  {step.image && (
                      <img
                          src={step.image}
                          alt={`${t("tip_step")} ${index + 1}`}
                          className="tip-step-image"
                      />
                  )}
                </div>
            ))}
          </div>

          <div className="recipe-section">
            <h3 className="reviews">{t("reviews_title")}</h3>
            {reviews.length > 0 && (
                <div className="average-rating">
                  ⭐ {t("reviews_average_rating")}: {getAverageRating()} / 5 ({getRatingPercentage()}% {t("reviews_positive")})
                </div>
            )}

            {reviews.length > 2 && (
                <div className="scroll-buttons">
                  <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>
                  <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
                </div>
            )}

            <div className="reviews-list-tips" ref={reviewsRef}>
              {reviews.map((review, index) => (
                  <ReviewItem key={index} review={review} index={index} setReviews={setReviews} />
              ))}
            </div>
          </div>

          <div className="recipe-section">
            <h3 className="leave-comment">{t("reviews_leave_review")}</h3>
            <div className="comment-form">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? "active" : ""}`}
                        onClick={() => setRating(star)}
                    >★</span>
                ))}
              </div>
              <textarea
                  placeholder={t("reviews_input_placeholder")}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>{t("reviews_submit_button")}</button>
            </div>
          </div>
        </div>
      </div>
  );

};

export default TipDetails;
