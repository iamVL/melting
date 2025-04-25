import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../RecipeListing.css";
import { useLanguage } from "../translator/Languagecontext";

const CookbookDetail = () => {
    const { t } = useLanguage();
    const { cookbookName } = useParams();
    const [recipes, setRecipes] = useState([]);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const allCookbooks = JSON.parse(localStorage.getItem("cookbooks")) || [];
        const cookbook = allCookbooks.find(cb => cb.name === cookbookName);
        if (!cookbook || !cookbook.recipes?.length) return;

        const fetchAllRecipes = async () => {
            const promises = cookbook.recipes.map(async (id) => {
                const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                const post = Array.isArray(data) && data[0] ? data[0] : data;
                return {
                    id: post.id || id,
                    title: post.attributes?.title || t("cookbook_untitled"),
                    description: post.attributes?.description || t("cookbook_no_desc"),
                    image: post.attributes?.mainImage || "/default-recipe-image.jpg"
                };
            });

            const fetched = await Promise.all(promises);
            setRecipes(fetched);
        };

        fetchAllRecipes();
    }, [cookbookName, token, t]);

    const removeRecipeFromCookbook = (recipeID) => {
        const allCookbooks = JSON.parse(localStorage.getItem("cookbooks")) || [];
        const updatedCookbooks = allCookbooks.map(cb => {
            if (cb.name === cookbookName) {
                return {
                    ...cb,
                    recipes: cb.recipes.filter(id => id !== recipeID)
                };
            }
            return cb;
        });

        localStorage.setItem("cookbooks", JSON.stringify(updatedCookbooks));
        setRecipes(prev => prev.filter(r => r.id !== recipeID));
    };

    return (
        <div className="recipe-container">
            <Link to="/cookbooks" className="back-button">
                ← {t("cookbook_back")}
            </Link>
            <h2 className="recipe-header">{t("cookbook_title")}: {cookbookName}</h2>
            <p className="recipe-subheader">{t("cookbook_all_recipes")}</p>

            {recipes.length ? (
                <div className="recipe-grid">
                    {recipes.map((recipe, index) => (
                        <div key={index} className="recipe-card-1">
                            <img src={recipe.image} alt={recipe.title} className="recipe-image-1" />
                            <div className="recipe-content-1">
                                <h3 className="recipe-title-1">{recipe.title}</h3>
                                <p className="recipe-description-1">{recipe.description}</p>
                                <Link to={`/recipe/${recipe.id}`} className="read-more-button-1">
                                    {t("cookbook_view_recipe")} →
                                </Link>
                                <button
                                    className="delete-recipe-button-1"
                                    onClick={() => removeRecipeFromCookbook(recipe.id)}
                                >
                                    🗑 {t("cookbook_remove")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-recipes-found">{t("cookbook_empty")}</p>
            )}
        </div>
    );
};

export default CookbookDetail;
