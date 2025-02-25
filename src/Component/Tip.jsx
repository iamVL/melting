import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Tip.css";

const TipForm = () => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("token");

  useEffect(() => {
    if (!userToken) {
      navigate("/");
    }
  }, [userToken]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [steps, setSteps] = useState([{ id: 1, description: "", image: null }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const addStep = () => setSteps([...steps, { id: steps.length + 1, description: "", image: null }]);

  const removeStep = (id) => {
    if (steps.length > 1 && id === steps.length) {
      setSteps(steps.slice(0, -1)); // ✅ Remove last step only
    }
  };

  const handleStepChange = (id, event) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, description: event.target.value } : step)));
  };

  const handleStepImageUpload = (id, event) => {
    const file = event.target.files[0];
    setSteps(steps.map((step) => (step.id === id ? { ...step, image: file } : step)));
  };

  const handleMainImageUpload = (event) => {
  const file = event.target.files[0];

  if (!file) {
    setErrorMessage("Please select a valid image file.");
    return;
  }

  // ✅ Ensure the file type is recognized correctly
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    setErrorMessage("Only JPEG and PNG files are allowed.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // ✅ Set max width & height (adjust as needed)
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width > height) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        } else {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // ✅ Ensure the format is always correct
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // Forces JPEG format

      setMainImage(compressedBase64);
      setErrorMessage("");
    };

    img.onerror = () => {
      setErrorMessage("Error loading image. Please try again.");
    };
  };
};

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!mainImage) {
      setErrorMessage("Please upload a main picture!");
      return;
    }
  
    // Convert steps into a proper JSON array
    const formattedSteps = steps.map((step, index) => ({
      id: index + 1,
      description: step.description,
      image: step.image, // Assuming this is a URL or base64 string
    }));
  
    const postData = {
      authorID: sessionStorage.getItem("user"),
      content: title, // Using the title as the main content
      attributes: {
        postType: "tip",
        steps: formattedSteps,
        mainImage, // Assuming it's a URL or base64 string
        description,
      },
    };
  
    try {
      const response = await fetch(process.env.REACT_APP_API_PATH + "/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify(postData),
      });
  
      if (response.ok) {
        setErrorMessage("");
        setTitle("");
        setMainImage(null);
        setSteps([{ id: 1, description: "", image: null }]);
        setDescription("");
      } else {
        const result = await response.json();
        setErrorMessage("Error: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      setErrorMessage("Error uploading tip!");
    }
  };
  

  return (
    <div className="tip-container">
      <form className="tip-form" onSubmit={handleSubmit}>
        <h2 className="tip-header">Upload a Cooking Tip</h2>

        <label className="tip-label">Title *</label>
        <textarea className="tip-textarea" placeholder="Enter tip title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label className="tip-label">Description *</label>
        <textarea className="tip-textarea" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label className="tip-label">Steps/Directions *</label>
        <div className="tip-steps-container">
          {steps.map((step) => (
            <div key={step.id} className="tip-step-wrapper">
              <textarea className="tip-step-textarea" placeholder={`Step ${step.id} description`} value={step.description} onChange={(e) => handleStepChange(step.id, e)} required />
              <div className="tip-upload-box tip-step-upload">
                <input type="file" accept="image/*" onChange={(e) => handleStepImageUpload(step.id, e)} />
                {step.image && (
                  <img
                    src={URL.createObjectURL(step.image)}
                    alt={`Step ${step.id}`}
                    className="tip-step-image-preview"
                    onClick={() => setFullscreenImage(URL.createObjectURL(step.image))}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
              <button
                type="button"
                className="tip-delete-step-btn"
                onClick={() => removeStep(step.id)}
                disabled={step.id !== steps.length}
                style={{ opacity: step.id === steps.length ? 1 : 0, cursor: step.id === steps.length ? "pointer" : "default" }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="tip-add-step-btn" onClick={addStep}>+ Add Step</button>
        <button type="submit" className="tip-submit-btn">Submit Tip</button>
      </form>

      <div className="tip-image-upload">
        <label className="tip-label">Main Picture *</label>
        <div className="tip-upload-box">
          <input type="file" accept="image/*" onChange={handleMainImageUpload} />
          {mainImage && (
            <img
              src={mainImage}  // ✅ Base64 works directly as an image src
              alt="Main"
              className="tip-image-preview"
            />
          )}
        </div>

        {errorMessage && (
          <p className="tip-error-message">{errorMessage}</p>
        )}
      </div>

      {fullscreenImage && (
        <div className="tip-fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="Full Screen" className="tip-fullscreen-image" />
        </div>
      )}
    </div>
  );
};

export default TipForm;
