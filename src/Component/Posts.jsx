import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../UploadRecipe.css";

const UploadRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    timeHours: "",
    timeMinutes: "",
    servingSize: "",
    difficulty: "",
    ingredients: "",
    steps: [""],
    image: null,
    cuisine:"",
  });

  const [newIngredient, setNewIngredient] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setRecipe((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient],
      }));
      setNewIngredient("");
    }
  };

  const handleAddStep = () => {
    setRecipe((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...recipe.steps];
    newSteps[index] = value;
    setRecipe((prev) => ({...prev, steps: newSteps }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files;
    setRecipe((prev) => ({...prev, image: file }));
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleCuisineToggle = (cuisine) => {
    setRecipe((prevRecipe) => {
      const updatedCuisines = prevRecipe.cuisine.includes(cuisine)
          ? prevRecipe.cuisine.filter((c) => c!== cuisine)
          : [...prevRecipe.cuisine, cuisine];
      return {...prevRecipe, cuisine: updatedCuisines };
    });
  };

  const handleSubmit = () => {
    // Check if required fields are filled
    if (!recipe.title ||!recipe.description ||!recipe.servingSize ||!recipe.difficulty || recipe.ingredients.length === 0 || recipe.steps.length === 0 ||!recipe.image) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("description", recipe.description);
    formData.append("timeHours", recipe.timeHours);
    formData.append("timeMinutes", recipe.timeMinutes);
    formData.append("servingSize", recipe.servingSize);
    formData.append("difficulty", recipe.difficulty);
    recipe.ingredients.forEach((ingredient) => formData.append("ingredients", ingredient));
    recipe.steps.forEach((step) => formData.append("steps", step));
    formData.append("image", recipe.image);
    recipe.cuisine.forEach((cuisine) => formData.append("cuisine", cuisine));

    fetch(process.env.REACT_APP_API_PATH + "/recipes", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData,
    })
        .then((res) => res.json())
        .then(
            (result) => {
              setIsLoaded(true);
              console.log("Recipe uploaded successfully:", result);
              navigate("/posts");
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
              console.log("Error uploading recipe:", error);
            }
        );
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsLoaded(true);
    }
  },);

  const cuisineOptions = ["Italian", "Chinese", "American", "Indian", "Mexican", "Japanese"];

  return (
      <div className="page-container">
        <div className="upload-recipe-header">Upload Recipe</div>
        {isLoaded? (
            <div className="upload-recipe-container">
              <div className="upload-recipe-form">
                <label>Recipe Title *</label>
                <input type="text" name="title" value={recipe.title} onChange={handleChange} required maxLength={60} />

                <label>Description *</label>
                <textarea name="description" value={recipe.description} onChange={handleChange} required maxLength={125} />

                <div className="time-inputs">
                  <label>Total Time *</label>
                  <input type="number" name="timeHours" value={recipe.timeHours} onChange={handleChange} placeholder="hr" />
                  <input type="number" name="timeMinutes" value={recipe.timeMinutes} onChange={handleChange} placeholder="min" />
                </div>

                <label>Serving Size *</label>
                <input type="number" name="servingSize" value={recipe.servingSize} onChange={handleChange} required />

                <div className="difficulty-options">
                  {["Easy", "Medium", "Hard"].map((level) => (
                      <button key={level} className={`difficulty-btn ${recipe.difficulty === level? "selected": ""}`} onClick={() => setRecipe({...recipe, difficulty: level })}>
                        {level}
                      </button>
                  ))}
                </div>

                <label>List of Ingredients *</label>
                <div className="ingredient-input">
                  <input type="text" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder="Add Ingredient" />
                  <button type="button" onClick={handleAddIngredient}>
                    +
                  </button>
                </div>
                <ul className="ingredient-list">
                  {recipe.ingredients.map((item, index) => (
                      <li key={index}>{`${index + 1}. ${item}`}</li>
                  ))}
                </ul>

                <label>Steps to Create Recipe *</label>
                {recipe.steps.map((step, index) => (
                    <div key={index} className="step-input">
                      <textarea value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder={`Step ${index + 1}`} />
                    </div>
                ))}
                <button type="button" onClick={handleAddStep}>
                  Add Step
                </button>

                <label>Cuisine Tags</label>
                <div className="cuisine-tags">
                  {cuisineOptions.map((cuisine) => (
                      <div key={cuisine} className={`cuisine-tag ${recipe.cuisine.includes(cuisine)? "selected": ""}`} onClick={() => handleCuisineToggle(cuisine)}>
                        {cuisine}
                      </div>
                  ))}
                </div>

                <button type="button" className="submit-btn" onClick={handleSubmit}>
                  Serve
                </button>
              </div>
              <div className="upload-recipe-image">
                <label>Upload an Image *</label>
                <div className="file-upload-box" onClick={() => document.getElementById("imageUpload").click()}>
                  <span>Choose a file or drag and drop it here</span>
                  <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} required />
                </div>
                {selectedImage && <img src={selectedImage} alt="Preview" className="preview-img" />}
              </div>
            </div>
        ): (
            <div>Loading...</div>
        )}
      </div>
  );
};

export default UploadRecipe;