import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import "../RecipeDetails.css";
import Modal from "../Component/Modal";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ NEW
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [followMessage, setFollowMessage] = useState("");
  const reviewsRef = useRef(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [commentName, setCommentName] = useState("");


//AI was used to create this site


  const [connections, setConnections] = useState([]);
  const [followClick, setFollowClick] = useState(false);

  useEffect(() => {
    const fetchRecipeWithVisibilityCheck = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`);
        const data = await res.json();

        // ⛔ Protect "Followers Only" posts
        if (data.attributes?.visibility === "Followers Only") {
          const currentUser = sessionStorage.getItem("user");
          const token = sessionStorage.getItem("token");

          if (!token || !currentUser) {
            navigate("/unauthorized");
            return;
          }

          const response = await fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${currentUser}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const connections = await response.json();
          const isFollowing = connections[0]?.some((conn) => conn.toUser.id == data.authorID);

          const isOwner = String(currentUser) === String(data.authorID);

          if (!isFollowing && !isOwner) {
            navigate("/unauthorized");
            return;
          }
        }

        setRecipe(data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchRecipeWithVisibilityCheck();
  }, [id, navigate]);



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
    if (!recipe?.authorID) return;

    fetch(`${process.env.REACT_APP_API_PATH}/users/${recipe.authorID}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.attributes) {
            setAuthorInfo({ ...data.attributes, id: data.id }); // ⬅️ Fix: keep ID!
          }
        })
        .catch((err) => console.error("Error fetching author info:", err));
  }, [recipe]);

  useEffect(() => {
    const findReviews = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=${id}`);
      const data = await res.json();
      setReviews(data[0]);
    };

    const loadFriends = () => {
      fetch(
        process.env.REACT_APP_API_PATH +
          "/connections?fromUserID=" +
          sessionStorage.getItem("user"),
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setConnections(result[0]);
            console.log("Following", result[0]);
          },
          (error) => {
            setError(error);
          }
        );
    };

    loadFriends();
    findReviews();
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
    const totalRating = reviews.reduce((sum, review) => sum + review.attributes.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRatingPercentage = () => ((getAverageRating() / 5) * 100).toFixed(0);


  const handleCommentSubmit = () => {
    if (commentName && commentText && rating > 0) {
      const newReview = { name: commentName, text: commentText, rating };
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
      setCommentName("");
      setCommentText("");
      setRating(0);
      setModalMessage("✅ Review submitted!");
    } else {
      setModalMessage("⚠️ Please fill in all fields before submitting.");

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

  const toggleExpand = (index) => {
    setExpandedReview(expandedReview === index ? null : index);
  };

  const handleFollowUser = () => {
    const currentUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!currentUser || !authorInfo?.id) {
      setFollowMessage("❌ Something went wrong. Please try again later.");
      return;
    }

    if (currentUser === authorInfo.id.toString()) {
      setFollowMessage("❌ You can't follow yourself.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_PATH}/connections?fromUserID=${currentUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          const alreadyFollowing = data[0]?.some(
              (conn) =>
                  conn.toUser.id === authorInfo.id &&
                  conn.attributes.status !== "blocked"
          );

          if (alreadyFollowing) {
            setFollowMessage("❌ You are already following this user.");
          } else {
            fetch(`${process.env.REACT_APP_API_PATH}/connections`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                attributes: {
                  status: "active",
                  type: "friend",
                },
                fromUserID: currentUser,
                toUserID: authorInfo.id,
              }),
            })
                .then((res) => res.json())
                .then(() => {
                  setFollowMessage("✅ You are now following this user!");
                })
                .catch((err) => {
                  console.error("Error creating connection:", err);
                  setFollowMessage("❌ Failed to follow user. Try again.");
                });
          }
        })
        .catch((err) => {
          console.error("Error checking follow status:", err);
          setFollowMessage("❌ Unable to check follow status.");
        });
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

  if (isLoading) return <p>Loading recipe details...</p>;
  if (error) return <p>Error loading recipe: {error.message}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
      <div className="recipe-details-container">
        <div className="back-to-recipes">
          <Link to="/recipes" className="back-button">← All Recipes</Link>
        </div>

        <div className="recipe-content">
          <div className="recipe-header">
            <div className="recipe-text-content">
              <h2 className="recipe-title">{recipe.attributes?.title}</h2>
              <p className="recipe-description">{recipe.content}</p>
            </div>
            {recipe.attributes?.mainImage && (
                <img src={recipe.attributes.mainImage} alt={recipe.attributes.title} className="recipe-image-top" />
            )}
          </div>

          <div className="recipe-section">
            <h3 className="ingredients">Ingredients</h3>
            <ul className="recipe-ingredients-list">
              {recipe.attributes?.ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

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
                  <ReviewItem key={index} review={review} index={index} setReviews={setReviews}/>
              ))}
            </div>
          </div>

          <div className="recipe-section">
            <h3 className="leave-comment">Leave a Review</h3>
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
              <textarea placeholder="Your Review" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              <button onClick={handleCommentSubmit}>Post Review</button>
            </div>
          </div>
        </div>

        <div className="recipe-sidebar">
          <div className="sidebar-section">
            <h4>Total Time</h4>
            <div className="total-time-display">{recipe.attributes?.totalTime || "N/A"}</div>
          </div>
          <div className="sidebar-section">
            <h4>Cooking Level</h4>
            <div className="cooking-level-display">{recipe.attributes?.difficulty || "Medium"}</div>
          </div>
          <div className="sidebar-section">
            <h4>Serving Size</h4>
            <div className="serving-size-display">{recipe.attributes?.servingSize}</div>
          </div>
          <div className="sidebar-section">
            <h4>Cuisine</h4>
            <div className="cuisine-tags">
              {Array.isArray(recipe.attributes?.cuisine)
                  ? ( recipe.attributes?.cuisine.length !== 0 ? (
                    recipe.attributes.cuisine.map((cuisine, index) => (
                      <div key={index} className="cuisine-tag">{cuisine}</div>
                  ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
            </div>
          </div>
        <div className="sidebar-section">
          <h4 style={{margin:"0px"}}>Allergy</h4>
          <div className="cuisine-tags">
            {Array.isArray(recipe.attributes?.allergy)
                ? ( recipe.attributes?.allergy.length !== 0 ? (
                  recipe.attributes.allergy.map((allergy, index) => (
                    <div key={index} className="cuisine-tag">{allergy}</div>
                ))
                ): ( 
                  <div className="cuisine-tag">None</div>
                ))
                : <div className="cuisine-tag">None</div>}
          </div>
        </div>
        <div className="sidebar-section">
          <h4 style={{margin:"0px"}}>Diet</h4>
          <div className="cuisine-tags">
              {Array.isArray(recipe.attributes?.diet)
                  ? ( recipe.attributes?.diet.length !== 0 ? (
                    recipe.attributes.diet.map((diet, index) => (
                      <div key={index} className="cuisine-tag">{diet}</div>
                  ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
            </div>
          </div>
        <div className="sidebar-section">
           <h4 style={{ margin: "0px" }}>Visible To</h4>
            {recipe.attributes?.visibility && (
            <div className="cuisine-tags">
              <div className="cuisine-tag">
                {recipe.attributes.visibility === "Followers Only" ? "Followers Only" : "Public"}
              </div>
            </div>
              )}
        </div>


          <div className="sidebar-section">
            <h4>Recipe Created By</h4>

            <div className="created-by">
              {authorInfo ? (
                  <>
                    <span>{authorInfo.username}</span>
                    <br/>
                    { ( parseInt(authorInfo.id) !== parseInt(sessionStorage.getItem("user")) && connections.some(conn => conn.toUserID === authorInfo.id) == false && !followClick) && 
                      <button onClick={() => {handleFollowUser(); setFollowClick(true);}} className="orange-follow-button">
                        ➕ Follow this user
                      </button>
                    }

                    {connections.some(conn => conn.toUserID === authorInfo.id) === true && <>
                    <p style={{marginTop:"35px", color:"#e67e22", fontWeight:"1000"}}> You are following this user!</p>
                    </>}

                    {followMessage && (
                        <p style={{
                          color: followMessage.includes("❌") ? "red" : "green",
                          marginTop: "35px",
                          fontWeight: "bold"
                        }}>
                          {followMessage}
                        </p>
                    )}
                  </>
              ) : (
                  <span>Loading user...</span>
              )}
            </div>
          </div>
        </div>
        {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage("")} />}

      </div>
        );
        };

        export default RecipeDetails;

