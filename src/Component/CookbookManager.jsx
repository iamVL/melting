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
    const [category, setCategory] = useState("Recipes");

    const token = sessionStorage.getItem("token");
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentUserID = currentUser.id || currentUser.userID;

    const [tips, setTips] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);


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

  const loadTips = () => {
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
              const cookingTips = data[0].filter(
                (p) => p.attributes?.postType === "tip"
              );
              setTips(cookingTips);
            } else if (data.posts) {
              const cookingTips = data.posts.filter(
                (p) => p.attributes?.postType === "tip"
              );
              setTips(cookingTips);
            }
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
        .filter((tip) => String(tip.authorID) === String(sessionStorage.getItem("user")))
        .map((tip) => ({
        ...tip,
  }));

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
            <h2 className="recipe-header">Melting Pot Editor</h2>
            <div className="cookbook-categories">
                <button type="button" onClick={(e) => setCategory(e.target.value)} value="Recipes"> Recipes </button>
                <button type="button" onClick={(e) => setCategory(e.target.value)} value="Tips"> Tips </button>
            </div>
            <p className="recipe-subheader">
                Click to view/edit your own listings!
            </p>
            <p className="cookbook-recipe-manager">
                {category === "Recipes" && <>
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
                </>}

                {category === "Tips" && <>
                    {sortedTips.map( (tip) => {
                        return (
                            <div className="cookbook-recipe">
                                <Link to={`/my_tip/${tip.id}`}>
                                    <img src={tip.attributes?.mainImage} alt="tip" />
                                    {/* title */}
                                    <p id="cookbook-recipe-title">{tip.content
                                        ? tip.content.length > 20
                                        ? `${tip.content.substring(0, 35)}...`
                                        : tip.content
                                        : "No title available"}
                                    </p>   
                                    {/* description */}
                                    <p id="cookbook-recipe-desc">{tip.attributes.description
                                        ? tip.attributes.description.length > 80
                                        ? `${tip.attributes.description.substring(0, 80)}...`
                                        : tip.attributes.description
                                        : "No description available"}
                                    </p>    
                                </Link>
                            </div>
                        )
                    })}
                </>}
            </p>

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

        </div>
    );
};

export default CookbookManager;
