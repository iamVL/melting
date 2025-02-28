import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../RecipeDetails.css"; // Ensure you create a CSS file for styling

const RecipeDetails = () => {
    const { id } = useParams(); // Get recipe ID from the URL
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the recipe details using the ID from the URL
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

    if (isLoading) return <p>Loading recipe details...</p>;
    if (error) return <p>Error loading recipe: {error.message}</p>;
    if (!recipe) return <p>Recipe not found.</p>;

    return (
        <div className="recipe-details-container">
            <h2 className="recipe-title">{recipe.attributes?.title}</h2>

            {/* Recipe Image */}
            {recipe.attributes?.image && (
                <img src={recipe.attributes.image} alt={recipe.attributes.title} className="recipe-image" />
            )}

            {/* Recipe Description */}
            <p className="recipe-description">{recipe.content}</p>

            {/* Recipe Details */}
            <div className="recipe-meta">
                <p><strong>Time:</strong> {recipe.attributes?.totalTime}</p>
                <p><strong>Serving Size:</strong> {recipe.attributes?.servingSize}</p>
                <p><strong>Difficulty:</strong> {recipe.attributes?.difficulty}</p>
            </div>

            {/* Ingredients List */}
            <div className="recipe-section">
                <h3>🛒 Ingredients</h3>
                <ul>
                    {recipe.attributes?.ingredients?.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>

            {/* Steps to Prepare */}
            <div className="recipe-section">
                <h3>📖 Steps</h3>
                <ol>
                    {recipe.attributes?.steps?.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>

            {/* Cuisine Tags */}
            {recipe.attributes?.cuisine?.length > 0 && (
                <div className="recipe-section">
                    <h3>🌍 Cuisine</h3>
                    <p>{recipe.attributes.cuisine.join(", ")}</p>
                </div>
            )}
        </div>
    );
};

export default RecipeDetails;
