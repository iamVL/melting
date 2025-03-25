import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeListing from "./RecipeListing";
import "../RecipeListing.css"; // For shared recipe styles
import "../CookbookManager.css"; // 🆕 This is your custom cookbook CSS

const CookbookManager = () => {
    const [cookbooks, setCookbooks] = useState([]);
    const [newCookbookName, setNewCookbookName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [favoritedRecipes, setFavoritedRecipes] = useState([]);
    const [selectedRecipes, setSelectedRecipes] = useState([]);

    const token = sessionStorage.getItem("token");
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentUserID = currentUser.id || currentUser.userID;

    useEffect(() => {
        if (!token) return;
        const apiUrl = `${process.env.REACT_APP_API_PATH}/posts?limit=100`;
        fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const recipePosts = Array.isArray(data) && data[0]
                    ? data[0].filter((p) => p.attributes?.postType === "recipe")
                    : data.posts?.filter((p) => p.attributes?.postType === "recipe") || [];
                setRecipes(recipePosts);
            });
    }, [token]);

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

    const handleCreateCookbook = () => {
        if (!newCookbookName.trim()) return;
        if (cookbooks.some((cb) => cb.name === newCookbookName)) {
            alert("Cookbook already exists");
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

    const toggleRecipeSelection = (id) => {
        setSelectedRecipes((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const addToCookbook = (cookbookName) => {
        const updated = cookbooks.map((cb) => {
            if (cb.name === cookbookName && cb.ownerID === currentUserID) {
                const merged = Array.from(new Set([...cb.recipes, ...selectedRecipes]));
                return { ...cb, recipes: merged };
            }
            return cb;
        });
        saveCookbooks(updated);
        alert("Recipes added to cookbook ✅");
        setSelectedRecipes([]);
    };

    const handleDeleteCookbook = (cookbookName) => {
        const confirm = window.confirm(`Delete cookbook "${cookbookName}"?`);
        if (!confirm) return;
        const updated = cookbooks.filter((cb) => cb.name !== cookbookName);
        saveCookbooks(updated);
    };


    return (
        <div className="cookbook-manager">
            <h2 className="recipe-header">Cookbook Manager</h2>
            <p className="recipe-subheader">
                Browse all recipes and add them to your own cookbooks!
            </p>

            {/* Create new cookbook */}
            <div className="create-cookbook-form">
                <input
                    type="text"
                    placeholder="New Cookbook Name"
                    value={newCookbookName}
                    onChange={(e) => setNewCookbookName(e.target.value)}
                />
                <button onClick={handleCreateCookbook}>➕ Create</button>
            </div>

            {/* List of user's cookbooks */}
            <div className="cookbook-list">
                <h3 style={{marginBottom: "1rem"}}>Your Cookbooks</h3>
                <p className="recipe-subheader">
                   Here are the cookbooks you've created! Select on any recipe below and once you see that they are selected click add selected recipes!
                </p>
                {cookbooks.length === 0 ? (
                    <p>You haven't created any cookbooks yet.</p>
                ) : (
                    cookbooks.map((cb, idx) => (
                        <div key={idx} className="cookbook-item">
                            <Link
                                to={`/cookbooks/${encodeURIComponent(cb.name)}`}
                                className="cookbook-link"
                            >
                                {cb.name}
                            </Link>
                            <div>
                                <button onClick={() => addToCookbook(cb.name)}>
                                    Add Selected Recipes
                                </button>
                                <button
                                    className="delete-cookbook-btn"
                                    onClick={() => handleDeleteCookbook(cb.name)}
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>


            {/* Recipe Grid Listing */}
            <RecipeListing
                posts={recipes}
                error={null}
                isLoaded={true}
                loadPosts={() => {}}
                favoritedRecipes={favoritedRecipes}
                handleFavorite={() => {}}
                selectedRecipes={selectedRecipes}
                toggleRecipeSelection={toggleRecipeSelection}
                showCreatedByYouOption={true}
            />
        </div>
    );
};

export default CookbookManager;
