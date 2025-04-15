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

  const [totalTime, setTotalTime] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [cuisine, setCuisine] = useState([]);
  const [allergy, setAllergy] = useState([]);
  const [diet, setDiet] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
 const [imageFile, setImageFile] = useState(null);

  const [diffDrop, setDiffDrop] = useState(false);
  const [cuisineDrop, setCuisineDrop] = useState(false);
  const [allergyDrop, setAllergyDrop] = useState(false);
  const [dietDrop, setDietDrop] = useState(false); 
  
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {    
    fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setRecipe(data);
          setIngredients(data.attributes.ingredients);
          setInstructions(data.attributes.steps);
          setTitle(data.attributes.title);
          setDesc(data.content);
          setDifficulty(data.attributes.difficulty);
          setServingSize(data.attributes.servingSize);
          setTotalTime(data.attributes.totalTime);
          setSelectedImage(data.attributes.mainImage);
          setCuisine(data.attributes.cuisine);
          setAllergy(data.attributes.allergy);
          setDiet(data.attributes.diet);
          console.log("Recipe:", data);
          setIsLoading(false);

          const str = data.attributes.totalTime;
          const numbers = str.match(/\d+/g);

          setHours(parseInt(numbers[0]));
          setMinutes(parseInt(numbers[1]));
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
  }, [id]);

  const updateRecipe = async (event) => {
    event.preventDefault();
    
    if (title === "") {
      alert("Fill out title!");
      return;
    }

    if (desc === "") {
      alert("Fill out description!");
      return;
    }

    for (let ingred of ingredients) {
      if (ingred === "") {
        alert("Fill Out Ingredients!");
        return;
      }
    }

    for (let instruc of instructions) {
      if (instruc === "") {
        alert("Fill Out Instructions!");
        return;
      }
    }

    if (servingSize === "" || servingSize === "0" || servingSize < 0) {
      alert("Fill Out a Valid Serving Size!");
      return;
    }

    let uploadedImageUrl = null;
    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        alert("Image upload failed.");
        return;
      }
    }

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
          diet: recipe.attributes.diet,
          mainImage: recipe.attributes.mainImage,

          // changed the following below
          mainImage: uploadedImageUrl,
          totalTime: totalTime,
          cuisine: cuisine,
          allergy: allergy,
          diet: diet,
          ingredients: ingredients,
          servingSize: servingSize,
          steps: instructions,
          title: title,
          difficulty: difficulty,
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

  const addNewIngredient = () => {
    const newIngredients = [...ingredients];
    newIngredients.push("");
    setIngredients(newIngredients);
  }

  const addNewInstruction = () => {
    const newInstructions = [...instructions];
    newInstructions.push("");
    setInstructions(newInstructions);
  }

  const removeIngredient = (ingredient) => {
    if (ingredients.length === 1) {
      alert("You must have atleast 1 ingredient!");
      return;
    }

    const newIngredients = [...ingredients];
    for (let i = 0; i < newIngredients.length; i++) {
      if (ingredient === newIngredients[i]) {
        newIngredients.splice(i, 1);  
        break;
      }
    }
    setIngredients(newIngredients);
    console.log(newIngredients);
  }

  const removeStep = (step) => {
    if (instructions.length === 1) {
      alert("You must have atleast 1 instruction!");
      return;
    }

    const newSteps = [...instructions];
    for (let i = 0; i < newSteps.length; i++) {
      if (step === newSteps[i]) {
        newSteps.splice(i, 1);  
        break;
      }
    }
    setInstructions(newSteps);
    console.log(newSteps);
  }

  const cancelRecipe = () => {
    setEditMode(false)
    setIngredients(recipe.attributes.ingredients);
    setInstructions(recipe.attributes.steps);
    setTitle(recipe.attributes.title);
    setDesc(recipe.content);
    setDifficulty(recipe.attributes.difficulty);
    setServingSize(recipe.attributes.servingSize);
  }

  const handleCuisine = (cuis) => {
    console.log("Add/Remove:", cuis);

    const newCuisine = [...cuisine];
    if (cuisine.includes(cuis)) {
      for (let i = 0 ; i < cuisine.length; i++) {
        if (newCuisine[i] === cuis) {
          newCuisine.splice(i, 1);
        }
      }
    } else {
      newCuisine.push(cuis);
    }
    setCuisine(newCuisine);
  }

  const handleAllergy = (aller) => {
    console.log("Add/Remove:", aller);

    const newAllegy = [...allergy];
    if (allergy.includes(aller)) {
      for (let i = 0 ; i < allergy.length; i++) {
        if (newAllegy[i] === aller) {
          newAllegy.splice(i, 1);
        }
      }
    } else {
      newAllegy.push(aller);
    }
    setAllergy(newAllegy);
  }

  const handleDiet = (die) => {
    console.log("Add/Remove:", die);

    const newDiet = [...diet];
    if (diet.includes(die)) {
      for (let i = 0 ; i < diet.length; i++) {
        if (newDiet[i] === die) {
          newDiet.splice(i, 1);
        }
      }
    } else {
      newDiet.push(die);
    }
    setDiet(newDiet);
  }

  const handleTime = (value, type) => {
    if (value === "") {
      value = 0;
    }

    let hour = hours;
    let minute = minutes;
    if (type === "hour") {
      hour = value.toString();
    } else if (type === "minute") {
      minute = value.toString();
    }

    const total_string = hour +"hours "+ minute +"minutes";
    setTotalTime(total_string);

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

  const allCuisines = ["Italian", "Chinese", "American", "Indian", "Mexican", "Japanese", "Spanish"];
  const allAllergies = ["Peanuts", "TreeNuts", "Shellfish", "Gluten", "Eggs", "Dairy"];
  const allDiets = ["Kosher", "Halal", "Vegetarian", "Vegan", "Pescitarian"];

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
            <input name ="title" style={{color:"#555555"}} value={title} onChange={(e) => setTitle(e.target.value)}/>
            <input name ="desc" style={{color:"#555555"}} value={desc} onChange={(e) => setDesc(e.target.value)}/>
            </div>
            <div className="upload-recipe-image">
              <div className="file-upload-box" onClick={() => document.getElementById("imageUpload").click()}>
                <input name="recipe-pic" type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} required hidden />
                {selectedImage && <img src={selectedImage} alt="Preview" className="preview-img" />}
                </div>
            </div>
          </div>

          <div style={{display:"flex", gap:"10px", alignItems:"center", justifyContent:"center"}}> 
            <button type="button" onClick={cancelRecipe} id="edit-my-recipe"> Cancel </button>
            <button type="submit" id="save-my-recipe"> Save Changes </button>
          </div>

          <div className="recipe-section">
            <h3 className="ingredients">Ingredients</h3>
            <ul className="recipe-ingredients-list">
              {ingredients.map((ingredient, index) => (
                <>
                  <div className="instruction-flex">
                    <input name ="ingredient" style={{color:"#555555"}} key={index} placeholder="Fill Out" value={ingredient} onChange={(e) => handleChange(index, e)}/>
                    <button type="button" className="delete-button-recipe" onClick={(index) => {removeIngredient(ingredient)}}>Remove</button>
                  </div>
                </>         
              ))}
              <button type="button" className="add-recipe-button" onClick={addNewIngredient}> Add Ingredient</button>
            </ul>
          </div>

          <div className="recipe-section">
            <h3 className="steps">Recipe Instructions</h3>
            <div className="steps-container">
              {instructions.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-title">Step {index + 1}</div>
                    <div className="instruction-flex">
                      <input name ="instruction" style={{color:"#555555"}} key={index} placeholder="Fill Out" value={step} onChange={(e) => handleStepChange(index, e)}/>
                      <button type="button" className="delete-button-recipe" onClick={(index) => {removeStep(step)}}>Remove</button>
                    </div>
                  </div>
              ))}
              <button type="button" className="add-recipe-button" onClick={addNewInstruction}> Add Instruction</button>
            </div>
          </div>
        </div>

        <div className="recipe-sidebar">
          <div className="sidebar-section">
            <h4>Total Time</h4>
            {editMode ? ( <>
              <input name ="hour" type="number" value={hours} placeholder={hours} onChange={(e) => {setHours(e.target.value); handleTime(e.target.value, "hour");}}/>
              <input name ="minute" type="number" value={minutes} placeholder={minutes} onChange={(e) => {setMinutes(e.target.value); handleTime(e.target.value, "minute");}}/>

            </>): (<>
              <div className="total-time-display">{recipe.attributes?.totalTime || "N/A"}</div>
            </>)}
          </div>
          <div className="sidebar-section">
            <h4>Cooking Level</h4>
            <button id="edit-cooking-level" type="button" onClick={() => {setDiffDrop(!diffDrop)}}>{difficulty}</button>
            {diffDrop && <> 
              <div className="difficulty-menu">
                {difficulty === "Easy" && <>
                  <button onClick={() => {setDifficulty("Easy"); setDiffDrop(false);}} style={{backgroundColor:"#fec89a"}} type="button">Easy</button>
                  <button onClick={() => {setDifficulty("Medium"); setDiffDrop(false);}}type="button">Medium</button>
                  <button onClick={() => {setDifficulty("Hard"); setDiffDrop(false);}} type="button">Hard</button>
                </>}

                {difficulty === "Medium" && <>
                  <button onClick={() => {setDifficulty("Easy"); setDiffDrop(false);}} type="button">Easy</button>
                  <button onClick={() => {setDifficulty("Medium"); setDiffDrop(false);}}style={{backgroundColor:"#fec89a"}} type="button">Medium</button>
                  <button onClick={() => {setDifficulty("Hard"); setDiffDrop(false);}} type="button">Hard</button>
                </>}

                {difficulty === "Hard" && <>
                  <button type="button" onClick={() => {setDifficulty("Easy"); setDiffDrop(false);}}>Easy</button>
                  <button type="button" onClick={() => {setDifficulty("Medium"); setDiffDrop(false);}}>Medium</button>
                  <button onClick={() => {setDifficulty("Hard"); setDiffDrop(false);}} style={{backgroundColor:"#fec89a"}} type="button">Hard</button>
                </>}
              </div>
            </>}
          </div>
          <div className="sidebar-section">
            <h4>Serving Size</h4>
            <input name ="serving" type="number" value={servingSize} placeholder={servingSize} onChange={(e) => setServingSize(e.target.value)}/>
          </div>
          <div className="sidebar-section">
            <h4>Cuisine</h4>
            <div className="cuisine-tags">
            { editMode ? (<>
              {Array.isArray(allCuisines)
                  ? ( allCuisines.length !== 0 ? (
                    allCuisines.map((cuis, index) => (
                      ( cuisine.includes(cuis) ? ( <>
                        <button type="button" style={{backgroundColor:"#e67e22"}} onClick={() => {handleCuisine(cuis); setCuisineDrop(false);}}>{cuis}</button>
                      </>) : ( <>
                        <button type="button" onClick={() => {handleCuisine(cuis); setCuisineDrop(false);}}>{cuis}</button>
                      </>))
                    ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
              </>
             ) : (<>
             {Array.isArray(cuisine)
                  ? ( cuisine.length !== 0 ? (
                    cuisine.map((cuisine, index) => (
                      <div key={index} className="cuisine-tag">{cuisine}</div>
                  ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
              
            </>)}
            </div>
          </div>
        <div className="sidebar-section">
          <h4 style={{margin:"0px"}}>Allergy</h4>
          <div style={{marginTop:"10px"}} className="cuisine-tags">
          { editMode ? (<>
              {Array.isArray(allAllergies)
                  ? ( allAllergies.length !== 0 ? (
                    allAllergies.map((aller, index) => (
                      ( allergy.includes(aller) ? ( <>
                        <button type="button" style={{backgroundColor:"#e67e22"}} onClick={() => {handleAllergy(aller); setAllergyDrop(false);}}>{aller}</button>
                      </>) : ( <>
                        <button type="button" onClick={() => {handleAllergy(aller); setAllergyDrop(false);}}>{aller}</button>
                      </>))
                    ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
              </>
             ) : (<>
             {Array.isArray(recipe.attributes?.allergy)
                ? ( recipe.attributes?.allergy.length !== 0 ? (
                  recipe.attributes.allergy.map((allergy, index) => (
                    <div key={index} className="cuisine-tag">{allergy}</div>
                ))
                ): ( 
                  <div className="cuisine-tag">None</div>
                ))
                : <div className="cuisine-tag">None</div>}
              
            </>)}
          </div>
        </div>
        <div className="sidebar-section">
          <h4 style={{margin:"0px"}}>Diet</h4>
          <div style={{marginTop:"10px"}} className="cuisine-tags">
          { editMode ? (<>
              {Array.isArray(allDiets)
                  ? ( allDiets.length !== 0 ? (
                    allDiets.map((die, index) => (
                      ( diet.includes(die) ? ( <>
                        <button type="button" style={{backgroundColor:"#e67e22"}} onClick={() => {handleDiet(die); setDietDrop(false);}}>{die}</button>
                      </>) : ( <>
                        <button type="button" onClick={() => {handleDiet(die); setDietDrop(false);}}>{die}</button>
                      </>))
                    ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
              </>
             ) : (<>
             {Array.isArray(recipe.attributes?.diet)
                  ? ( recipe.attributes?.diet.length !== 0 ? (
                    recipe.attributes.diet.map((diet, index) => (
                      <div key={index} className="cuisine-tag">{diet}</div>
                  ))
                  ): ( 
                    <div className="cuisine-tag">None</div>
                  ))
                  : <div className="cuisine-tag">None</div>}
            </>)}
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
