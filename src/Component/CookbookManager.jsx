import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../RecipeListing.css";
import "../CookbookManager.css";
import Modal from "../Component/Modal";
import { useLanguage } from "../translator/Languagecontext";

const CookbookManager = () => {
    const { t } = useLanguage();

    const [cookbooks, setCookbooks] = useState([]);
    const [newCookbookName, setNewCookbookName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [favoritedRecipes, setFavoritedRecipes] = useState([]);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [category, setCategory] = useState("Recipes");

    const token = sessionStorage.getItem("token");
    const currentUserID = sessionStorage.getItem("user");

    const [tips, setTips] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [cookbookToDelete, setCookbookToDelete] = useState(null);

    useEffect(() => {
        if (!token || !currentUserID) return;
        fetch(`${process.env.REACT_APP_API_PATH}/post-reactions?userID=${currentUserID}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const favorited = data.map((reaction) => reaction.postID);
                setFavoritedRecipes(favorited);
            });
    }, [token, currentUserID]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cookbooks")) || [];
        const mine = stored.filter((cb) => cb.ownerID === currentUserID);
        setCookbooks(mine);
    }, [currentUserID]);

    const saveCookbooks = (updated) => {
        localStorage.setItem("cookbooks", JSON.stringify(updated));
        setCookbooks(updated);
    };

    const loadPosts = () => {
        if (!token) {
            setError(new Error(t("error_no_token")));
            return;
        }

        fetch(`${process.env.REACT_APP_API_PATH}/posts?limit=100`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsLoaded(true);
                const recipePosts = Array.isArray(data) && data[0]
                    ? data[0].filter((p) => p.attributes?.postType === "recipe")
                    : data.posts?.filter((p) => p.attributes?.postType === "recipe") || [];
                setPosts(recipePosts);
            })
            .catch((err) => {
                setIsLoaded(true);
                setError(err);
                console.error("Error fetching recipes:", err);
            });
    };

    useEffect(() => {
        loadPosts();
    }, []);

    let sortedPosts = posts
        .filter((post) => String(post.authorID) === String(currentUserID))
        .map((post) => ({ ...post }));

    const loadTips = () => {
        if (!token) {
            setError(new Error(t("error_no_token")));
            return;
        }

        fetch(`${process.env.REACT_APP_API_PATH}/posts?limit=100`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsLoaded(true);
                const cookingTips = Array.isArray(data) && data[0]
                    ? data[0].filter((p) => p.attributes?.postType === "tip")
                    : data.posts?.filter((p) => p.attributes?.postType === "tip") || [];
                setTips(cookingTips);
            })
            .catch((err) => {
                setIsLoaded(true);
                setError(err);
                console.error("Error fetching tips:", err);
            });
    };

    useEffect(() => {
        loadTips();
    }, []);

    let sortedTips = tips
        .filter((tip) => String(tip.authorID) === String(currentUserID))
        .map((tip) => ({ ...tip }));

    const handleCreateCookbook = () => {
        if (!newCookbookName.trim()) return;
        if (cookbooks.some((cb) => cb.name === newCookbookName)) {
            alert(t("cookbook_exists"));
            return;
        }
        const newCB = {
            name: newCookbookName,
            ownerID: currentUserID,
            recipes: [],
            postType: "recipe",
        };
        const updated = [...cookbooks, newCB];
        saveCookbooks(updated);
        setNewCookbookName("");
    };

    return (
        <div className="cookbook-manager">
            <h2 className="recipe-header">{t("cookbook_editor")}</h2>
            <div className="cookbook-categories">
                <button type="button" onClick={(e) => setCategory(e.target.value)} value="Recipes">
                    {t("cookbook_recipes")}
                </button>
                <button type="button" onClick={(e) => setCategory(e.target.value)} value="Tips">
                    {t("cookbook_tips")}
                </button>
            </div>
            <p className="recipe-subheader">{t("cookbook_view_edit")}</p>
            <p className="cookbook-recipe-manager">
                {category === "Recipes" && sortedPosts.map((recipe) => (
                    <div className="cookbook-recipe" key={recipe.id}>
                        <Link to={`/my_recipe/${recipe.id}`}>
                            <img src={recipe.attributes?.mainImage} alt="recipe" />
                            <p id="cookbook-recipe-title">
                                {recipe.attributes.title
                                    ? recipe.attributes.title.length > 20
                                        ? `${recipe.attributes.title.substring(0, 35)}...`
                                        : recipe.attributes.title
                                    : t("cookbook_no_title")}
                            </p>
                            <p id="cookbook-recipe-desc">
                                {recipe.content
                                    ? recipe.content.length > 80
                                        ? `${recipe.content.substring(0, 80)}...`
                                        : recipe.content
                                    : t("cookbook_no_desc")}
                            </p>
                        </Link>
                    </div>
                ))}

                {category === "Tips" && sortedTips.map((tip) => (
                    <div className="cookbook-recipe" key={tip.id}>
                        <Link to={`/my_tip/${tip.id}`}>
                            <img src={tip.attributes?.mainImage} alt="tip" />
                            <p id="cookbook-recipe-title">
                                {tip.content
                                    ? tip.content.length > 20
                                        ? `${tip.content.substring(0, 35)}...`
                                        : tip.content
                                    : t("cookbook_no_title")}
                            </p>
                            <p id="cookbook-recipe-desc">
                                {tip.attributes.description
                                    ? tip.attributes.description.length > 80
                                        ? `${tip.attributes.description.substring(0, 80)}...`
                                        : tip.attributes.description
                                    : t("cookbook_no_desc")}
                            </p>
                        </Link>
                    </div>
                ))}
            </p>

            <h2 className="recipe-header">{t("cookbook_manager")}</h2>
            <p className="recipe-subheader">{t("cookbook_browse_add")}</p>

            <div className="create-cookbook-form">
                <input
                    type="text"
                    placeholder={t("cookbook_new_cookbook")}
                    value={newCookbookName}
                    onChange={(e) => setNewCookbookName(e.target.value)}
                />
                <button onClick={handleCreateCookbook}>➕ {t("cookbook_create")}</button>
            </div>

            <div className="cookbook-list">
                <h3 style={{ marginBottom: "1rem" }}>{t("cookbook_your_cookbooks")}</h3>
                <p className="recipe-subheader">{t("cookbook_here_are_yours")}</p>
                {cookbooks.length === 0 ? (
                    <p>{t("cookbook_none_yet")}</p>
                ) : (
                    cookbooks.map((cb, idx) => (
                        <div key={idx} className="cookbook-item">
                            <Link to={`/cookbooks/${encodeURIComponent(cb.name)}`} className="cookbook-link">
                                {cb.name}
                            </Link>
                            <div>
                                <button
                                    className="delete-cookbook-btn"
                                    onClick={() => {
                                        setCookbookToDelete(cb.name);
                                        setOpenDeleteModal(true);
                                    }}
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <p>{t("cookbook_confirm_delete").replace("{{name}}", cookbookToDelete)}</p>
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={() => setOpenDeleteModal(false)}>
                        {t("modal_cancel")}
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => {
                            const updated = cookbooks.filter((cb) => cb.name !== cookbookToDelete);
                            saveCookbooks(updated);
                            setOpenDeleteModal(false);
                            setCookbookToDelete(null);
                        }}
                    >
                        {t("modal_confirm_delete")}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default CookbookManager;
