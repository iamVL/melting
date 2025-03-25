import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../UploadRecipe.css";

const UploadRecipe = () => {
    //storing recipe details
    const [recipe, setRecipe] = useState({
        title: "",
        description: "",
        timeHours: "",
        timeMinutes: "",
        servingSize: "",
        difficulty: "",
        ingredients:[],
        steps: [""],
        image: null,
        cuisine:[],
    });
   //Additional states for handling user input
    const [newIngredient, setNewIngredient] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();
    //changes in text input fields and updates the recipe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({...prev, [name]: value }));
    };
    //adds a new ingredient to the list if it's not empty.
    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            setRecipe((prev) => ({
                ...prev,
                //trim whitespace
                ingredients: [...prev.ingredients, newIngredient.trim()],
            }));
            setNewIngredient("");
        }
    };
    //Deletes an ingredient from the list based on the given index.
    const handleDeleteIngredient = (index) => {
        setRecipe((prev) => {
            const updatedIngredients = [...prev.ingredients];
            updatedIngredients.splice(index, 1);
            return {...prev, ingredients: updatedIngredients };
        });
    };
    //adds a step
    const handleAddStep = () => {
        setRecipe((prev) => ({
            ...prev,
            steps: [...prev.steps, ""],
        }));
    };
    //deletes a step
    const handleDeleteStep = (index) => {
        setRecipe((prev) => {
            const updatedSteps = [...prev.steps];
            updatedSteps.splice(index, 1);
            return { ...prev, steps: updatedSteps };
        });
    };
    //updtes given index when the user modifies the input
    const handleStepChange = (index, value) => {
        const newSteps = [...recipe.steps];
        newSteps[index] = value;
        setRecipe((prev) => ({...prev, steps: newSteps }));
    };
    //file selection for image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            //allows you to preview image
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    //adding or removing cuisine
    const handleCuisineToggle = (cuisine) => {
        setRecipe((prevRecipe) => {
            const updatedCuisines = prevRecipe.cuisine.includes(cuisine)
                ? prevRecipe.cuisine.filter((c) => c!== cuisine)
                : [...prevRecipe.cuisine, cuisine];
            return {...prevRecipe, cuisine: updatedCuisines };
        });
    };
    //uploads the selected image to the API and returns the image URL
    const uploadImage = async () => {
        if (!imageFile) return null;

        const userID = sessionStorage.getItem("user");
        const formData = new FormData();
        formData.append("uploaderID", userID); 
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

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Image upload failed:", errorText);
                throw new Error(errorText);
            }

            const data = await response.json();
            console.log("Image uploaded successfully:", data);
            //// return full image URL
            return `https://webdev.cse.buffalo.edu${data.path}`;
        } catch (error) {
            console.error("Image upload error:", error);
            return null;
        }
    };
    //submits the recipe to the API
    const handleSubmit = async () => {
        if (!recipe.title || !recipe.description || !recipe.servingSize || !recipe.difficulty || recipe.ingredients.length === 0 || recipe.steps.length === 0) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsLoaded(false);

        let uploadedImageUrl = null;
        if (imageFile) {
            uploadedImageUrl = await uploadImage();
            if (!uploadedImageUrl) {
                alert("Image upload failed. Please try different images such as .heic");
                return;
            }
        }

        fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                authorID: sessionStorage.getItem("user"),
                content: recipe.description,
                attributes: {
                    postType: "recipe",
                    title: recipe.title,
                    totalTime: `${recipe.timeHours}hours ${recipe.timeMinutes}minutes`,
                    servingSize: parseInt(recipe.servingSize) || 1,
                    difficulty: recipe.difficulty || "Easy",
                    ingredients: recipe.ingredients.length ? recipe.ingredients : ["Unknown"],
                    steps: recipe.steps,
                    cuisine: recipe.cuisine,
                    mainImage: uploadedImageUrl,
                },
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to upload recipe.");

                setIsLoaded(true);
                console.log("Recipe uploaded successfully:", data);

                // ✅ Remove the state object from navigate
                navigate(`/recipe/${data.id}`);
            })
            .catch((error) => {
                setIsLoaded(true);
                setError(error);
                console.log("Error uploading recipe:", error);
            });

    };
    //check if the user is logged in.
    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            setIsLoaded(true);
        }
    }, []);

    //options for cuisine toggle
    const cuisineOptions = ["Italian", "Chinese", "American", "Indian", "Mexican", "Japanese", "Spanish"];

    return (
        <div className="page-container">
            <div className="upload-recipe-header">Upload Recipe</div>
            {isLoaded? (
                <div className="upload-recipe-container">
                    <div className="upload-recipe-form">
                        <label>Recipe Title *</label>
                        <input type="text" name="title" value={recipe.title} onChange={handleChange} required
                               maxLength={60}/>

                        <label>Description *</label>
                        <textarea name="description" value={recipe.description} onChange={handleChange} required
                                  maxLength={125}/>

                        <label>Total Time *</label>
                        <div className="time-inputs">
                            <input type="number" name="timeHours" value={recipe.timeHours} onChange={handleChange}
                                   placeholder="hr"/>
                            <input type="number" name="timeMinutes" value={recipe.timeMinutes} onChange={handleChange}
                                   placeholder="min"/>
                        </div>

                        <label>Serving Size *</label>
                        <input type="number" name="servingSize" value={recipe.servingSize} onChange={handleChange}
                               required/>

                        <label>Select Difficulty *</label>
                        <div className="difficulty-options">

                            {["Easy", "Medium", "Hard"].map((level) => (
                                <button key={level}
                                        className={`difficulty-btn ${recipe.difficulty === level ? "selected" : ""}`}
                                        onClick={() => setRecipe({...recipe, difficulty: level})}>
                                    {level}
                                </button>
                            ))}
                        </div>

                        <label>List of Ingredients *</label>
                        <div className="ingredient-input">
                            <input type="text" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)}
                                   placeholder="Add Ingredient"/>
                            <button type="button" onClick={handleAddIngredient}>+</button>
                        </div>
                        <ul className="ingredient-list">
                            {recipe.ingredients.map((item, index) => (
                                <li key={index}>
                                    {`${index + 1}. ${item}`}
                                    <button type="button" onClick={() => handleDeleteIngredient(index)}>❌</button>
                                    {/* Delete button */}
                                </li>
                            ))}
                        </ul>

                        <label>Steps to Create Recipe *</label>
                        {recipe.steps.map((step, index) => (
                            <div key={index} className="step-input">
                                <textarea value={step} onChange={(e) => handleStepChange(index, e.target.value)}
                                          placeholder={`Step ${index + 1}`}/>
                                {recipe.steps.length > 1 && (
                                    <button type="button" className="delete-btn"
                                            onClick={() => handleDeleteStep(index)}>❌</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddStep}>Add Step</button>

                        <label>Cuisine Tags</label>
                        <div className="cuisine-tags">
                            {cuisineOptions.map((cuisine) => (
                                <div key={cuisine}
                                     className={`cuisine-tag ${recipe.cuisine.includes(cuisine) ? "selected" : ""}`}
                                     onClick={() => handleCuisineToggle(cuisine)}>
                                    {cuisine}
                                </div>
                            ))}
                        </div>



                        <button type="button" className="submit-btn"
                                onClick={handleSubmit}>Serve
                        </button>

                    </div>
                    <div className="upload-recipe-image">
                        <label>Upload an Image *</label>
                        <div className="file-upload-box" onClick={() => document.getElementById('imageUpload').click()}>
                            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} required
                                   hidden/>

                            <span>Choose a file or drag and drop it here</span> {/* Then the span */}
                        </div>
                        {selectedImage && <img src={selectedImage} alt="Preview" className="preview-img"/>}
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default UploadRecipe;