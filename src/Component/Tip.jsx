import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Tip.css";
import { useLanguage } from "../translator/Languagecontext";

const TipForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userToken = sessionStorage.getItem("token");

  useEffect(() => {
    if (!userToken) navigate("/");
  }, [userToken]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [steps, setSteps] = useState([{ id: 1, description: "", image: null }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const addStep = () => setSteps([...steps, { id: steps.length + 1, description: "", image: null }]);
  const removeStep = (id) => {
    if (steps.length > 1 && id === steps.length) setSteps(steps.slice(0, -1));
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
    if (!file) return setErrorMessage(t("uploadImage"));
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) return setErrorMessage(t("uploadImageErrorType"));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
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
        setMainImage(canvas.toDataURL("image/jpeg", 0.7));
        setErrorMessage("");
      };
      img.onerror = () => setErrorMessage(t("uploadImageError"));
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mainImage) return setErrorMessage(t("uploadImage"));
    const formattedSteps = steps.map((step, index) => ({ id: index + 1, description: step.description, image: step.image }));
    const postData = {
      authorID: sessionStorage.getItem("user"),
      content: title,
      attributes: {
        postType: "tip",
        steps: formattedSteps,
        mainImage,
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
        const result = await response.json();
        navigate("/tip/" + JSON.stringify(result.id));
      } else {
        const result = await response.json();
        setErrorMessage(t("submitError") + (result.error || "Something went wrong"));
      }
    } catch (error) {
      setErrorMessage(t("uploadTipError"));
    }
  };

  return (
      <div className="whole-tip-page">
        <div className="tip-container">
          <form className="tip-form" onSubmit={handleSubmit}>
            <h2 className="tip-header">{t("uploadTip")}</h2>

            <label className="tip-label">{t("tipTitle")}</label>
            <textarea className="tip-textarea" placeholder={t("enterTitle")}
                      value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label className="tip-label">{t("description")}</label>
            <textarea className="tip-textarea" placeholder={t("enterDescription")}
                      value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label className="tip-label">{t("steps")}</label>
            <div className="tip-steps-container">
              {steps.map((step) => (
                  <div key={step.id} className="tip-step-wrapper">
                <textarea className="tip-step-textarea" placeholder={`${t("stepDescription").replace("1", step.id)}`}
                          value={step.description} onChange={(e) => handleStepChange(step.id, e)} required />
                    <button type="button" className="tip-delete-step-btn" onClick={() => removeStep(step.id)}
                            disabled={step.id !== steps.length} style={{ opacity: step.id === steps.length ? 1 : 0, cursor: step.id === steps.length ? "pointer" : "default" }}>
                      {t("removeStep")}
                    </button>
                  </div>
              ))}
            </div>

            <button type="button" className="tip-add-step-btn" onClick={addStep}>+ {t("addStep")}</button>
            <button type="submit" className="tip-submit-btn">{t("submitTip")}</button>
          </form>

          <div className="tip-image-upload">
            <label className="tip-label">{t("uploadImage")}</label>
            <div className="tip-upload-box">
              <input placeholder={t("addPhoto")} type="file" accept="image/*" onChange={handleMainImageUpload} />
              {mainImage ? (
                  <img src={mainImage} alt="Main" className="tip-image-preview" />
              ) : <p style={{ color: "black", fontSize: "18px" }}>{t("addPhoto")}</p>}
            </div>
            {errorMessage && <p className="tip-error-message">{errorMessage}</p>}
          </div>

          {fullscreenImage && (
              <div className="tip-fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                <img src={fullscreenImage} alt="Full Screen" className="tip-fullscreen-image" />
              </div>
          )}
        </div>
      </div>
  );
};

export default TipForm;
