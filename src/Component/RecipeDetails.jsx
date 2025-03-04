import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../RecipeDetails.css"; // Ensure you have this CSS for styling
import CommentForm from "./CommentForm.jsx"; // Import the Comment Form
import Post from "./Post.jsx"; // Import Post Component for Comments

const RecipeDetails = () => {
    const { id } = useParams(); // Get recipe ID from URL
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);

    // ✅ Fetch the recipe details
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

        loadComments(); // Load comments as well
    }, [id]);

    // ✅ Load Comments
    const loadComments = () => {
        fetch(`${process.env.REACT_APP_API_PATH}/posts?parentID=${id}`)
            .then((res) => res.json())
            .then((data) => setComments(data[0] || []))
            .catch((err) => setError(err));
    };

    // ✅ Reload comments after submitting a new one
    const handleCommentSubmit = () => {
        loadComments();
    };

    if (isLoading) return <p>Loading recipe details...</p>;
    if (error) return <p>Error loading recipe: {error.message}</p>;
    if (!recipe) return <p>Recipe not found.</p>;

    return (
        <div className="recipe-details-container-2">
            {/* ✅ Main Content (Recipe Details) */}
            <div className="recipe-main-content-2">
                <div className="recipe-header-container-2">
                    <div className="recipe-header-text-2">
                        <h2 className="recipe-title-2">{recipe.attributes?.title}</h2>
                        <p className="recipe-description-2">{recipe.content}</p>
                    </div>
                    {recipe.attributes?.mainImage && (
                        <img src={recipe.attributes.mainImage} alt={recipe.attributes.title} className="recipe-main-image-2" />
                    )}
                </div>

                {/* ✅ Recipe Metadata */}
                <div className="recipe-meta-2">
                    <p><strong>⏳ Time:</strong> {recipe.attributes?.totalTime}</p>
                    <p><strong>🍽 Serving Size:</strong> {recipe.attributes?.servingSize}</p>
                    <p><strong>🔥 Difficulty:</strong> {recipe.attributes?.difficulty}</p>
                </div>

                {/* ✅ Ingredients Section */}
                <div className="recipe-section-2">
                    <h3>🛒 Ingredients</h3>
                    <ul>
                        {recipe.attributes?.ingredients?.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                {/* ✅ Steps Section */}
                <div className="recipe-section-2">
                    <h3>📖 Steps</h3>
                    <div className="recipe-steps-container-2">
                        {recipe.attributes?.steps?.map((step, index) => (
                            <div key={index} className="recipe-step-2">
                                <div className="recipe-step-content-1">
                                    <span className="recipe-step-number-2">{`Step ${index + 1}`}</span>
                                    <p className="recipe-step-description-1">{step}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✅ Cuisine Tags */}
                {recipe.attributes?.cuisine?.length > 0 && (
                    <div className="recipe-section-2">
                        <h3>🌍 Cuisine</h3>
                        <p>{recipe.attributes.cuisine.join(", ")}</p>
                    </div>
                )}
            </div>

            {/* ✅ Comments Section (Right Side) */}
            <div className="recipe-comments-container-2">
                <h3 className="comments-title-3">Comments</h3>
                <CommentForm parent={id} loadPosts={handleCommentSubmit} loadComments={handleCommentSubmit} />
                <div className="comments-list-3">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Post key={comment.id} post={comment} type="commentlist" loadPosts={handleCommentSubmit} />
                        ))
                    ) : (
                        <p className="no-comments-3">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
