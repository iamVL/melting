import React, { useEffect, useState, useRef } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import "../MyRecipe.css";
//import { all } from "axios";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [followMessage, setFollowMessage] = useState("");

  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setRecipe(data);
          setIngredients(data.attributes.ingredients);
          setInstructions(data.attributes.steps);
          setTitle(data.attributes.title);
          setDesc(data.content);
          console.log("Recipe:", data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
  }, [id]);

  const updateRecipe = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
      method:"PATCH",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body : JSON.stringify({
        authorID: recipe.authorID,
        content: desc, // changed description
        attributes: {
          postType: "recipe",
          totalTime: recipe.attributes.totalTime,
          servingSize: recipe.attributes.servingSize,
          difficulty: recipe.attributes.difficulty,
          cuisine: recipe.attributes.cuisine,
          allergy: recipe.attributes.allergy,
          diet: recipe.attributes.diet,
          mainImage: recipe.attributes.mainImage,

          // changes ingredients, steps, title
          ingredients: ingredients,
          steps: instructions,
          title: title,
        }
      }),
    }) .then ( (res) => res.json()) 
      .then ( (result) => {
        setEditMode(false);
        window.location.reload();
        console.log(result);
    })
  }

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
            if (sessionStorage.getItem("user") != data.id) {
              navigate('/cookbooks');
            }
            setAuthorInfo({ ...data.attributes, id: data.id }); // ⬅️ Fix: keep ID!
          }
        })
        .catch((err) => console.error("Error fetching author info:", err));
  }, [recipe]);

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${id}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, [id]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = event.target.value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, event) => {
    const newSteps = [...instructions];
    newSteps[index] = event.target.value;
    setInstructions(newSteps);
  };

  const handleDeleteReview = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews.splice(index, 1);
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
  };

  const handleDelete = async () => {
    let token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a recipe.");
      return;
    }
 
 
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;
 
 
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
 
 
      if (response.ok) {
        alert("Recipe deleted successfully!");
        navigate("/cookbooks");
      } else {
        const result = await response.json();
        alert("Error deleting recipe: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      alert("Failed to delete the recipe. Please try again.");
    }
  };

  if (isLoading) return <p>Loading recipe details...</p>;
  if (error) return <p>Error loading recipe: {error.message}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    (editMode ? (
      <form onSubmit={(event) => updateRecipe(event)}>
      <div className="recipe-details-container">
        <div className="back-to-recipes">
          <Link to="/recipes" className="back-button">← All Recipes</Link>
        </div>

        <div className="recipe-content">
          <div className="recipe-header">
            <div className="recipe-text-content">
            <input style={{color:"#555555"}} value={title} onChange={(e) => setTitle(e.target.value)}/>
            <input style={{color:"#555555"}} value={desc} onChange={(e) => setDesc(e.target.value)}/>
            </div>
            {recipe.attributes?.mainImage && (
                <img src={recipe.attributes.mainImage} alt={recipe.attributes.title} className="recipe-image-top" />
            )}
          </div>
          
          <button type="submit" id="save-my-recipe"> Save Changes </button>

          <div className="recipe-section">
            <h3 className="ingredients">Ingredients</h3>
            <ul className="recipe-ingredients-list">
              {ingredients.map((ingredient, index) => (<>
                    <input style={{color:"#555555"}} key={index} value={ingredient} onChange={(e) => handleChange(index, e)}/>
                  </>
              ))}
            </ul>
          </div>

          <div className="recipe-section">
            <h3 className="steps">Recipe Instructions</h3>
            <div className="steps-container">
              {instructions.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-title">Step {index + 1}</div>
                    <input style={{color:"#555555"}} key={index} value={step} onChange={(e) => handleStepChange(index, e)}/>
                  </div>
              ))}
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
            <h4>Recipe Created By</h4>

            <div className="created-by">
              {authorInfo ? (
                  <>
                    <span>{authorInfo.username}</span>
                  </>
              ) : (
                  <span>Loading user...</span>
              )}
            </div>
          </div>
        </div>
        </div>
      </form>

    ) : ( 
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

          <div style={{display:"flex", gap:"10px", alignItems:"center", justifyContent:"center"}}> 
            <button type="button" onClick={() => setEditMode(true)} id="edit-my-recipe"> Edit Recipe </button>
            <button type="button" onClick={() => handleDelete()} id="edit-my-recipe" style={{backgroundColor:"#ffa0a0"}}> Delete </button>
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
            <h4>Recipe Created By</h4>

            <div className="created-by">
              {authorInfo ? (
                  <>
                    <span>{authorInfo.username}</span>
                  </>
              ) : (
                  <span>Loading user...</span>
              )}
            </div>
          </div>
        </div>
        </div>
    ))
  
        );
        };

        export default RecipeDetails;
