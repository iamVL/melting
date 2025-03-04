import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation
import "../RecipeList.css"; // ✅ Ensure CSS is imported
import Recipe from "../Component/RecipeDetails"; // Assuming a Recipe component exists
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const RecipeList = ({ refresh, recipes, error, isLoaded, type, loadRecipes }) => {
    const currentUserID = sessionStorage.getItem("user"); // ✅ Get logged-in user ID

    if (!sessionStorage.getItem("token")) {
        return <div>Please Log In...</div>;
    } else if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (recipeID) => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to delete a recipe.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_PATH}/recipe/${recipeID}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response Status:", response.status); // Log status code
            const result = await response.json();
            console.log("Response Body:", result); // Log response body

            if (response.ok) {
                alert("Recipe deleted successfully!");
                loadRecipes(); // ✅ Refresh the list after deletion
            } else {
                alert("Error deleting recipe: " + (result.error || "Something went wrong"));
            }
        } catch (error) {
            console.error("Failed to delete the recipe:", error); // Log full error
            alert("Failed to delete the recipe.");
        }
    };

    return (
        <div className="recipe-container">
            <h2 className="recipe-header">Recipe Listings</h2>
            <p className="recipe-subheader">Explore delicious recipes from all around the world!</p>

            {recipes.length > 0 ? (
                <div className="recipe-grid">
                    {recipes.map((recipe) => {
                        const authorID = recipe.authorID;
                        const mainImage = recipe.attributes?.mainImage;
                        const description = recipe.attributes?.description || "No description available";

                        return (
                            <div key={recipe.id} className="recipe-card">
                                {mainImage && <img src={mainImage} alt={recipe.content} className="recipe-image" />}
                                <div className="recipe-content">
                                    <h3 className="recipe-title">{recipe.content}</h3>
                                    <p className="recipe-description">{description}</p>

                                    {/* ✅ "Read More" button linking to the full recipe page */}
                                    <Link to={`/recipe/${recipe.id}`} className="read-more-button">Read More →</Link>

                                    {/* ✅ Show delete button only if the user owns the recipe */}
                                    {String(authorID) === String(currentUserID) && (
                                        <button className="delete-button" onClick={() => handleDelete(recipe.id)}>🗑 Delete</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="recipe-no-recipes">No Recipes Found</div>
            )}
        </div>
    );
};

export default RecipeList;
