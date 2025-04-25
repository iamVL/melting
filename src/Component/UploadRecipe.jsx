import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UploadRecipe.css";

import Modal from "../Component/Modal";
import { useLanguage } from "../translator/Languagecontext";


const UploadRecipe = () => {
    const [recipe, setRecipe] = useState({
        title: "",
        description: "",
        timeHours: "",
        timeMinutes: "",
        servingSize: "",
        difficulty: "",
        ingredients: [],
        steps: [],
        image: null,
        cuisine: [],
        allergy: [],
        diet: [],
        visibility: "Public",
    });
    const { t } = useLanguage();

    const [newIngredient, setNewIngredient] = useState("");
    const [newStep, setNewStep] = useState(""); // ✅ NEW STATE
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
    };


    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            setRecipe((prev) => ({
                ...prev,
                ingredients: [...prev.ingredients, newIngredient.trim()],
            }));
            setNewIngredient("");
        }
    };


    const handleDeleteIngredient = (index) => {
        setRecipe((prev) => {
            const updated = [...prev.ingredients];
            updated.splice(index, 1);
            return { ...prev, ingredients: updated };
        });
    };


    const handleAddStep = () => {
        if (newStep.trim()) {
            setRecipe((prev) => ({
                ...prev,
                steps: [...prev.steps, newStep.trim()],
            }));
            setNewStep("");
        }
    };


    const handleDeleteStep = (index) => {
        setRecipe((prev) => {
            const updated = [...prev.steps];
            updated.splice(index, 1);
            return { ...prev, steps: updated };
        });
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };


    const handleCuisineToggle = (cuisine) => {
        setRecipe((prev) => {
            const updated = prev.cuisine.includes(cuisine)
                ? prev.cuisine.filter((c) => c !== cuisine)
                : [...prev.cuisine, cuisine];
            return { ...prev, cuisine: updated };
        });
    };


    const handleAllergyToggle = (allergy) => {
        setRecipe((prev) => {
            const updated = prev.allergy.includes(allergy)
                ? prev.allergy.filter((a) => a !== allergy)
                : [...prev.allergy, allergy];
            return { ...prev, allergy: updated };
        });
    };


    const handleDietToggle = (diet) => {
        setRecipe((prev) => {
            const updated = prev.diet.includes(diet)
                ? prev.diet.filter((d) => d !== diet)
                : [...prev.diet, diet];
            return { ...prev, diet: updated };
        });
    };


    const handleVisibility = (visibility) => {
        setRecipe((prev) => ({ ...prev, visibility }));
    };


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


    const handleSubmit = async () => {
        if (recipe.timeHours < 0 || recipe.timeMinutes < 0) {
            setError("Hours/Minutes cannot be negative!");
            setShowErrorModal(true);
            return;
        }
        if (recipe.timeHours > 1000 || recipe.timeMinutes > 1000) {
            setError("Hours/Minutes is too large!");
            setShowErrorModal(true);
            return;
        }
        if (recipe.servingSize < 0) {
            setError("Serving Size cannot be negative!");
            setShowErrorModal(true);
            return;
        }
        if (recipe.servingSize > 1000) {
            setError("Serving Size is too large!");
            setShowErrorModal(true);
            return;
        }
        
        if (
            !recipe.title ||
            !recipe.description ||
            !recipe.servingSize ||
            !recipe.difficulty ||
            recipe.ingredients.length === 0 ||
            recipe.steps.length === 0
        ) {
            setError("Please fill in all required fields.");
            setShowErrorModal(true);
            return;

        }


        setIsLoaded(false);


        let uploadedImageUrl = null;
        if (imageFile) {
            uploadedImageUrl = await uploadImage();
            if (!uploadedImageUrl) {
                setError("Image upload failed.");
                setShowErrorModal(true);
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
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    cuisine: recipe.cuisine,
                    allergy: recipe.allergy,
                    diet: recipe.diet,
                    mainImage: uploadedImageUrl,
                    visibility: recipe.visibility,
                },
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setIsLoaded(true);
                navigate(`/recipe/${data.id}`);
            })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setIsLoaded(true);
                navigate(`/recipe/${data.id}`);
            })
            .catch((error) => {
                setIsLoaded(true);
                setError("Something went wrong while submitting your recipe. Please try again.");
                setShowErrorModal(true);
                console.error("Upload error:", error);
            });

        if (!uploadedImageUrl) {
            setError("Image upload failed.");
            setShowErrorModal(true);
            return;
        }


    };


    useEffect(() => {
        if (sessionStorage.getItem("token")) setIsLoaded(true);
    }, []);


    const cuisineOptions = ["Italian", "Chinese", "American", "Indian", "Mexican", "Japanese", "Spanish"];
    const allergyOptions = ["Peanuts", "TreeNuts", "Shellfish", "Gluten", "Eggs", "Dairy"];
    const dietOptions = ["Kosher", "Halal", "Vegetarian", "Vegan", "Pescitarian"];
    const visibilityOptions = ["Public", "Followers Only"];


    return (
        <div className="page-container">
            {isLoaded ? (
                <div className="upload-recipe-container">
                    <div className="upload-recipe-form">
                        <div className="upload-recipe-header">{t("uploadRecipe_title")}</div>

                        <label>{t("recipeTitle")}</label>
                        <input placeholder={t("recipeTitle")} type="text" name="title" value={recipe.title} onChange={handleChange} required maxLength={60} />

                        <label>{t("description")}</label>
                        <textarea placeholder={t("description")} name="description" value={recipe.description} onChange={handleChange} required maxLength={125} />

                        <label>{t("totalTime")}</label>
                        <div className="time-inputs">
                            <input type="number" name="timeHours" value={recipe.timeHours} onChange={handleChange} placeholder={t("hours")} />
                            <input type="number" name="timeMinutes" value={recipe.timeMinutes} onChange={handleChange} placeholder={t("minutes")} />
                        </div>

                        <label>{t("servingSize")}</label>
                        <input placeholder={t("servingSize")} type="number" name="servingSize" value={recipe.servingSize} onChange={handleChange} required />

                        <label>{t("selectDifficulty")}</label>
                        <div className="difficulty-options">
                            {["Easy", "Medium", "Hard"].map((level) => (
                                <button key={level} className={`difficulty-btn ${recipe.difficulty === level ? "selected" : ""}`} onClick={() => setRecipe({ ...recipe, difficulty: level })}>
                                    {t(level.toLowerCase())}
                                </button>
                            ))}
                        </div>

                        <label>{t("listOfIngredients")}</label>
                        <div className="ingredient-input">
                            <input type="text" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder={t("addIngredient")} />
                            <button type="button" onClick={handleAddIngredient}>+</button>
                        </div>
                        <ul className="ingredient-list">
                            {recipe.ingredients.map((item, index) => (
                                <li key={index}>{`${index + 1}. ${item}`} <button type="button" onClick={() => handleDeleteIngredient(index)}>❌</button></li>
                            ))}
                        </ul>

                        <label>{t("stepsToCreate")}</label>
                        <div className="ingredient-input">
                            <input type="text" value={newStep} onChange={(e) => setNewStep(e.target.value)} placeholder={t("addStep")} />
                            <button type="button" onClick={handleAddStep}>+</button>
                        </div>
                        <ul className="ingredient-list">
                            {recipe.steps.map((step, index) => (
                                <li key={index}>{`${index + 1}. ${step}`} <button type="button" onClick={() => handleDeleteStep(index)}>❌</button></li>
                            ))}
                        </ul>

                        <label>{t("cuisineTags")}</label>
                        <div className="cuisine-tags">
                            {cuisineOptions.map((cuisine) => (
                                <div key={cuisine} className={`cuisine-tagz ${recipe.cuisine.includes(cuisine) ? "selected" : ""}`} onClick={() => handleCuisineToggle(cuisine)}>
                                    {t(cuisine.toLowerCase())}
                                </div>
                            ))}
                        </div>

                        <label>{t("allergyTags")}</label>
                        <div className="cuisine-tags">
                            {allergyOptions.map((allergy) => (
                                <div key={allergy} className={`cuisine-tagz ${recipe.allergy.includes(allergy) ? "selected" : ""}`} onClick={() => handleAllergyToggle(allergy)}>
                                    {t(allergy.toLowerCase())}
                                </div>
                            ))}
                        </div>

                        <label>{t("dietTags")}</label>
                        <div className="cuisine-tags">
                            {dietOptions.map((diet) => (
                                <div key={diet} className={`cuisine-tagz ${recipe.diet.includes(diet) ? "selected" : ""}`} onClick={() => handleDietToggle(diet)}>
                                    {t(diet.toLowerCase())}
                                </div>
                            ))}
                        </div>

                        <label>{t("visibility")}</label>
                        <div className="cuisine-tags">
                            {visibilityOptions.map((option) => (
                                <div key={option} className={`cuisine-tagz ${recipe.visibility === option ? "selected" : ""}`} onClick={() => handleVisibility(option)}>
                                    {t(option.toLowerCase().replace(" ", ""))}
                                </div>
                            ))}
                        </div>

                        <button type="button" className="submit-btn" onClick={handleSubmit}>{t("serve")}</button>
                    </div>

                    <div className="upload-recipe-image">
                        <label>{t("image")}</label>
                        <div className="file-upload-box" onClick={() => document.getElementById("imageUpload").click()}>
                            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} required hidden />
                            <span>{t("chooseFile")}</span>
                        </div>
                        {selectedImage && <img src={selectedImage} alt="Preview" className="preview-img" />}
                    </div>

                    <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
                        <h2 style={{ color: "#b00020" }}>{t("uploadRecipe_error_title")}</h2>
                        <p>{error || t("uploadRecipe_fill_required_fields")}</p>
                        <button className="modal-button" onClick={() => setShowErrorModal(false)}>
                            {t("modalCloseButton")}
                        </button>
                    </Modal>

                </div>
            ) : (
                <div>{t("loading")}</div>
            )}
        </div>
    );
};

export default UploadRecipe;