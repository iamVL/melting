import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostForm from "./PostForm";
import CommentForm from "./CommentForm";
import "../CommunityDetails.css";  // Ensure this file exists

const CommunityDetails = () => {
  const { communityId, communityName } = useParams();
  const [posts, setPosts] = useState([]); 
  const [selectedPostId, setSelectedPostId] = useState(null); 
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState(""); 
  const [mainImage, setMainImage] = useState(null); 
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPosts();
  }, [communityId]);

  const loadPosts = () => {
    if (sessionStorage.getItem("token")) {
      let url = `${process.env.REACT_APP_API_PATH}/posts?${communityId}`;
  
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setIsLoaded(true);
          if (Array.isArray(result) && result.length > 0) {
            const filteredPosts = result[0].filter(
              (post) => post.attributes?.postType === "community"
            );
            setPosts(filteredPosts);
            console.log("Got Community Posts:", filteredPosts);
          } else {
            setPosts([]); 
          }
        })
        .catch((err) => {
          setIsLoaded(true);
          setError(err);
          console.error("ERROR loading com  munity posts:", err);
        });
    }
  };

  const loadComments = (postId) => {
    setSelectedPostId(postId);
    fetch(`${process.env.REACT_APP_API_PATH}/posts?parentId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching comments:", err));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      authorID: sessionStorage.getItem("user"),
      content: title, 
      attributes: {
        postType: "community",
        groupID: communityId,
        mainImage,
        description,
      },
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setErrorMessage("");
        setTitle("");
        setDescription("");
        setMainImage(null);
        loadPosts(); 
        console.log("Post added");
      } else {
        const result = await response.json();
        setErrorMessage("Error: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      setErrorMessage("Error uploading post!");
    }
  };

  const handleDelete = async (postID) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a post.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this Post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts/${postID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Post deleted successfully!");
        loadPosts();
      } else {
        const result = await response.json();
        alert("Error deleting Post: " + (result.error || "Something went wrong"));
      }
    } catch (error) {
      alert("Failed to delete the Post.");
    }
  };

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
  
    if (!file) {
      setErrorMessage("Please select a valid image file.");
      return;
    }
  
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Only JPEG and PNG files are allowed.");
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
  
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
  
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // Forces JPEG format
  
        setMainImage(compressedBase64);
        setErrorMessage("");
      };
  
      img.onerror = () => {
        setErrorMessage("Error loading image. Please try again.");
      };
    };
  };

  const getUsername = (author) => {
    if (author.attributes) {
      return author.attributes.username;
    }
    return "";
  };

  return (
    <div className="community-container">
      {/* Display error message if any */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Post Form */}
      <div className="community-headers">
        <div className="community-information">
          <h4 style={{marginBottom:"10px", fontSize:"36px"}}>Welcome to {communityName}!</h4>
          <p> Description Placeholder</p>
        </div>

        <div className="community-post-display">
          <div className="make-community-post">
            <h4 style={{marginBottom:"10px"}}>Share with Others</h4>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter post title..." value={title} onChange={(e) => setTitle(e.target.value)}/>
              <input type="text" placeholder="Enter post desc..." value={description} onChange={(e) => setDescription(e.target.value)}/>
              <input type="file" accept="image/*" onChange={handleMainImageUpload} />
              <button type="submit" >Make Post</button>
            </form>
          </div>
          <p id="picture-preview"> 
            <img
                  src={mainImage  }
                  alt="Picture Preview"
                  className="tip-image-preview"
                />
          </p>
        </div>
      </div>

      {/* Community Posts */}
      <h4> See what others are talking about:</h4>
      <div className="community-posts">
        {posts.length > 0 ? (
          posts.map((post) => {
            const postImage = post.attributes?.mainImage;
            const postGroupID = post.attributes?.groupID;
            return (
            ( postGroupID === communityId && <>
              <div key={post.id} className="community-post">
                <div className="cpost-info">
                  <div className="post-headers">
                    <div className="headers-user">
                      <p id="post-user">Posted by {getUsername(post.author)}</p>
                      <span style={{ fontWeight: "normal", marginBottom:"10px" }}> ({post.created})</span>
                    </div>
                    {post.authorID === parseInt(sessionStorage.getItem("user")) &&
                      <button onClick={() => handleDelete(post.id)}>🗑 Delete</button>
                    }
                  </div>

                  <p id="post-title">{post.content}</p>
                  <p id="post-description">{post.attributes?.description}</p>
                </div>
                {/* <button onClick={() => loadComments(post.id)}>View Comments</button> */}
                {postImage && <img src={postImage} alt ="post"/> }
              </div>
              </>
              
            )
          )})
        ) : (
          <p>No posts in this community yet. Be the first to post!</p>
        )}
      </div>

      {/* {selectedPostId && (
        <div className="tip-comments-container">
          <h3 className="comments-title">Comments</h3>
          <CommentForm 
            parent={selectedPostId} 
            loadPosts={() => loadComments(selectedPostId)}
            loadComments={() => loadComments(selectedPostId)}
          />
        </div>
      )} */}
    </div>
  );
};

export default CommunityDetails;
