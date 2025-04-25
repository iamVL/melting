import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../TipDetails.css";
import Modal from "../Component/Modal";


const TipDetails = () => {
  const { id } = useParams();
  const [tip, setTip] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");
  const [steps,setSteps] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!tip?.authorID) return;

    fetch(`${process.env.REACT_APP_API_PATH}/users/${tip.authorID}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.attributes) {
            if (sessionStorage.getItem("user") != data.id) {
              navigate('/cookbooks');
            }
          }
        })
        .catch((err) => console.error("Error fetching author info:", err));
  }, [tip]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTip(data);
        setTitle(data.content);
        setDesc(data.attributes.description);
        setSelectedImage(data.attributes.mainImage);
        setSteps(data.attributes.steps);
      })
      .catch((err) => setError(err));
  }, [id]);

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
    setReviewsLoaded(true);
  }, [id]);

  useEffect(() => {
    if (reviewsLoaded) {
      localStorage.setItem(`tip-reviews-${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id, reviewsLoaded]);

  const handleAddReview = (review) => {
    const newReview = {
      ...review,
      like: 0,
      dislike: 0,
      reaction: null,
    };
    setReviews([...reviews, newReview]);
  };

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

  const updateTip = async (event) => {
    event.preventDefault();

    if (title === "") {
      setModalMessage("❗ Please fill out the title.");
      return;
    }
    if (desc === "") {
      setModalMessage("❗ Please fill out the description.");
      return;
    }
    for (let step of steps) {
      if (step.description === "") {
        setModalMessage("❗ Please complete all step instructions.");
        return;
      }
    }


    let uploadedImageUrl = null;
    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        setModalMessage("🖼️ Image upload failed.");
        return;
      }

    } else {
      uploadedImageUrl = tip.attributes.mainImage;
    }

    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
      method:"PATCH",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body : JSON.stringify({
        authorID: tip.authorID,
        content: title, // changed description
        attributes: {
          postType: "tip",

          // changed the following below
          mainImage: uploadedImageUrl,
          steps: steps,
          description: desc,
        }
      }),
    }) .then ( (res) => res.json()) 
      .then ( (result) => {
        setEditMode(false);
        window.location.reload();
        console.log(result);
    })
  }

  const handleStepChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index].description = event.target.value;
    setSteps(newSteps);
  };

  const addNewStep = () => {
    setSteps([...steps, { description: "" }]);
  }

  const removeStep = (step) => {
    if (steps.length === 1) {
      setModalMessage("🚫 You must have at least 1 instruction.");
      return;
    }

    console.log("Step:", step);

    const newSteps = [...steps];
    newSteps.splice(step, 1);  

    setSteps(newSteps);
    console.log(newSteps);
  }

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("uploaderID", sessionStorage.getItem("user"));
    formData.append("attributes", JSON.stringify({}));
    formData.append("file", imageFile);
 
 
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/file-uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });
 
 
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return `https://webdev.cse.buffalo.edu${data.path}`;
    } catch (err) {
      console.error("Image upload error:", err);
      return null;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const confirmActualDelete = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setModalMessage("✅ Recipe deleted successfully!");
        setShowConfirmModal(false);
        setTimeout(() => navigate("/cookbooks"), 1500);
      } else {
        const result = await response.json();
        setModalMessage("❌ Error deleting recipe: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      setModalMessage("❌ Failed to delete the recipe. Please try again.");
    }

    setPendingDelete(false);
  };


  const handleDelete = async () => {
    let token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a recipe.");
      return;
    }


    setShowConfirmModal(true);
    setPendingDelete(true);


    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
 
 
      if (response.ok) {
        setModalMessage("✅ Recipe deleted successfully!");
        setTimeout(() => navigate("/cookbooks"), 2000);
      } else {
        const result = await response.json();
        setModalMessage("❌ Error deleting recipe: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      setModalMessage("❌ Failed to delete the recipe. Please try again.");
    }
  };

  if (error) return <p>Error loading tip.</p>;
  if (!tip) return <p>Loading...</p>;

  const cancelTip = () => {
    setEditMode(false);
    setTitle(tip.content);
    setDesc(tip.attributes.description);
    setSteps(tip.attributes.steps);
  }

  return (
    (editMode ? (<> <div className="tip-details-container">
      <form onSubmit={updateTip}>
        <div className="tip-main-content">
          <div className="tip-header-container">
            <div className="tip-header-text">
              <input name ="title" style={{color:"#555555"}} value={title} onChange={(e) => setTitle(e.target.value)}/>
              <input name ="desc" style={{color:"#555555"}} value={desc} onChange={(e) => setDesc(e.target.value)}/>
              <div id="tip-header-button" style={{display:"flex", gap:"10px", alignItems:"center", justifyContent:"center"}}> 
                <button type="button" onClick={cancelTip} id="edit-my-recipe"> Cancel </button>
                <button type="submit" id="save-my-recipe"> Save Changes </button>
            </div>
            </div>

            <div className="upload-recipe-image">
              <div className="file-upload-box" onClick={() => document.getElementById("imageUpload").click()}>
                <input name="tip-pic" type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} hidden />
                {selectedImage && <img src={selectedImage} alt="Preview" className="preview-img" />}
                </div>
            </div>
          </div>

          <h3 className="tip-directions-title">Directions</h3>
          <div className="tip-steps-container">
            {steps.map((step, index) => (
              <div key={index} className="tip-step">
                <div className="tip-step-content">
                  <div className="tip-step-header">
                    <span className="tip-step-number">{`Step ${index + 1}`}</span>
                    {/* ignore this line */}
                    <h4 className="tip-step-title">{step.title}</h4>
                  </div>
                  <input name ="instruction" style={{color:"#555555"}} key={index} placeholder="Fill Out" value={step.description} onChange={(e) => handleStepChange(index, e)}/>
                  <div style={{display:"flex", gap:"10px", alignItems:"center", justifyContent:"center"}}> 
                    <button type="button" className="delete-button-recipe" onClick={() => {removeStep(index)}}>Remove</button>
                  </div>
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
          <button style={{marginTop:"20px"}} type="button" className="add-recipe-button" onClick={addNewStep}> Add Step</button>
        </div>
      </form>
    </div>
    </>) :(<>
    <div className="tip-details-container">
      <div className="tip-main-content">
        <div className="tip-header-container">
          <div className="tip-header-text">
            <h2 className="tip-details-title">{tip.content}</h2>
            <p className="tip-details-description">{tip.attributes?.description}</p>
            <div id="tip-header-button" style={{display:"flex", gap:"10px", alignItems:"center", justifyContent:"center"}}> 
              <button type="button" onClick={() => setEditMode(true)} id="edit-my-recipe"> Edit Tip </button>
              <button type="button" onClick={() => handleDelete()} id="edit-my-recipe" style={{backgroundColor:"#ffa0a0"}}> Delete </button>
            </div>
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
      </div>
      {modalMessage && (
          <Modal show={true} onClose={() => setModalMessage("")}>
            <h2 style={{ color: "#b00020" }}>Notice</h2>
            <p>{modalMessage}</p>
            <button className="modal-button" onClick={() => setModalMessage("")}>
              Close
            </button>
          </Modal>
      )}
      {showConfirmModal && (
          <Modal show={true} onClose={() => setShowConfirmModal(false)}>
            <h2 style={{ color: "#e67e22" }}>⚠️ Confirm Deletion</h2>
            <p>Are you sure you want to delete this recipe?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="delete-btn" onClick={confirmActualDelete}>Delete</button>
            </div>
          </Modal>
      )}


    </div>
    </>
    ))
  );
};

export default TipDetails;
