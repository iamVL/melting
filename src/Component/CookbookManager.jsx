import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../RecipeListing.css"; // For shared recipe styles
import "../CookbookManager.css";
import Modal from "../Component/Modal";


const CookbookManager = () => {
    const [cookbooks, setCookbooks] = useState([]);
    const [newCookbookName, setNewCookbookName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [favoritedRecipes, setFavoritedRecipes] = useState([]);


    const token = sessionStorage.getItem("token");
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentUserID = currentUser.id || currentUser.userID;

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
          setError(new Error("No token found. Please log in."));
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
            if (Array.isArray(data) && data[0]) {
              const recipePosts = data[0].filter(
                (p) => p.attributes?.postType === "recipe"
              );
              setPosts(recipePosts);
            } else if (data.posts) {
              const recipePosts = data.posts.filter(
                (p) => p.attributes?.postType === "recipe"
              );
              setPosts(recipePosts);
            }
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
        .filter((post) => String(post.authorID) === String(sessionStorage.getItem("user")))
        .map((post) => ({
        ...post,
  }));
    console.log(posts);
    console.log(sortedPosts);

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

    const handleDeleteCookbook = (cookbookName) => {
        const confirm = window.confirm(`Delete cookbook "${cookbookName}"?`);
        if (!confirm) return;
        const updated = cookbooks.filter((cb) => cb.name !== cookbookName);
        saveCookbooks(updated);
    };


    return (
        <div className="cookbook-manager">
            <h2 className="recipe-header">My Recipes</h2>
            <p className="recipe-subheader">
                Click to view/edit your own recipe!
            </p>
            <p className="cookbook-recipe-manager">
                {sortedPosts.map( (recipe) => {
                    return (
                        <div className="cookbook-recipe">
                            <Link to={`/my_recipe/${recipe.id}`}>
                                <img src={recipe.attributes?.mainImage} alt="recipe" />
                                {/* title */}
                                <p id="cookbook-recipe-title">{recipe.attributes.title
                                    ? recipe.attributes.title.length > 20
                                    ? `${recipe.attributes.title.substring(0, 35)}...`
                                    : recipe.attributes.title
                                    : "No title available"}
                                </p>   
                                {/* description */}
                                <p id="cookbook-recipe-desc">{recipe.content
                                    ? recipe.content.length > 80
                                    ? `${recipe.content.substring(0, 80)}...`
                                    : recipe.content
                                    : "No description available"}
                                </p>    
                            </Link>
                        </div>
                    )
                })}
            </p>

            <h2 className="recipe-header">Cookbook Manager</h2>
            <p className="recipe-subheader">
                Browse all recipes and add them to your own cookbooks!
            </p>


            <div className="create-cookbook-form">
                <input
                    type="text"
                    placeholder="New Cookbook Name"
                    value={newCookbookName}
                    onChange={(e) => setNewCookbookName(e.target.value)}
                />
                <button onClick={handleCreateCookbook}>➕ Create</button>
            </div>


            <div className="cookbook-list">
                <h3 style={{marginBottom: "1rem"}}>Your Cookbooks</h3>
                <p className="recipe-subheader">
                   Here are the cookbooks you've created!
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
                <p>Are you sure you want to delete the cookbook "<strong>{cookbookToDelete}</strong>"?</p>
                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={() => setOpenDeleteModal(false)}>Cancel</button>
                    <button
                        className="delete-btn"
                        onClick={() => {
                            const updated = cookbooks.filter((cb) => cb.name !== cookbookToDelete);
                            saveCookbooks(updated);
                            setOpenDeleteModal(false);
                            setCookbookToDelete(null);
                        }}
                    >
                        Yes, Delete
                    </button>
                </div>
            </Modal>


        </div>
    );
};

export default CookbookManager;
