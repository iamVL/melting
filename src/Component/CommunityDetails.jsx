import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "./PostForm";
import CommentForm from "./CommentForm";

import "../CommunityDetails.css";
import { useLanguage } from "../translator/Languagecontext";


const CommunityDetails = () => {
  const { t } = useLanguage();

  const { communityId, communityName } = useParams();
  const [posts, setPosts] = useState([]); 
  const [selectedPostId, setSelectedPostId] = useState(null); 
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState(null);

  const [editPostTitle, setEditPostTitle] = useState(""); 
  const [editPostDesc, setEditPostDesc] = useState(""); 
  const [editPost, setEditPost] = useState(0); 
  const [editMode, setEditMode] = useState(false); 
  const [ownerMode, setOwnerMode] = useState(false);
  const navigate = useNavigate();
  const [groupName,  setGroupName] = useState("");
  const [groupDesc,  setGroupDesc] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [removePostPic, setRemovePostPic] = useState(false);

  const [title, setTitle] = useState(""); 
  const [mainImage, setMainImage] = useState(null); 
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let url = `${process.env.REACT_APP_API_PATH}/groups/${communityId}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }) .then((res) => res.json())
    .then((result) => { 
      loadPosts();
      setGroupDesc(result.attributes.description ?? "");
      setGroup(result);
      setGroupName(result.name);
      if (result.attributes.ownerID === sessionStorage.getItem("user")) {
        setOwnerMode(true);
      }
      console.log("Result:", result);
      })
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

  const cancelCommunity = () => {
    setEditMode(false);
    setGroupDesc(group.attributes.description || "None"|| "Nada");
    setGroupName(group.name)
  }

  const updateCommunity = (event) => { 
    event.preventDefault(); 
    let url = `${process.env.REACT_APP_API_PATH}/groups/${communityId}`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: groupName,
        attributes: {
          description: groupDesc,
          ownerID: sessionStorage.getItem("user")
        }
      }),
    }) .then((res) => res.json())
    .then((result) => { 
      setEditMode(false);
      window.location.reload();
      console.log("Updated result:", result);
    });
  }

  const updatePost = async (post, event) => {
    event.preventDefault(); 
    console.log("Test", post);

    let uploadedImageUrl = null;
    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        alert("Image upload failed.");
        return;
      }
    } else {
      uploadedImageUrl = post.attributes.mainImage;
    }

    if (removePostPic) {
      uploadedImageUrl = null;
    }

    let url = `${process.env.REACT_APP_API_PATH}/posts/${post.id}`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        content: editPostTitle,
        created: post.created,
        author: post.author,
        authorID: post.authorID,
        attributes: {
          postType: "community",
          description: editPostDesc,
          mainImage: uploadedImageUrl,
          groupID: communityId,
        }
      }),
    }) .then((res) => res.json())
    .then((result) => { 
      setEditMode(false);
      window.location.reload();
      console.log("Updated post:", result);
    });




  }


  return (
    (editMode ? ( <> <div className="community-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="community-headers">
        <form onSubmit={updateCommunity}>
          <div className="community-information">
            <h4 style={{marginBottom: "10px", fontSize: "36px"}}>{t("welcome_to")} {groupName}!</h4>
            <input type="text" placeholder={t("enter_group_name")} value={groupName}
                   onChange={(e) => setGroupName(e.target.value)}/>

            {group === null ? (<p>{t('none')} </p>) : (

                <input type="text" placeholder={t("enter_group_desc")} value={groupDesc} onChange={(e) =>
                    setGroupDesc(e.target.value)}/>
            )}
            <div style={{display: "flex", gap: "10px", alignItems: "center", justifyContent: "center"}}>
              <button type="button" onClick={cancelCommunity} id="edit-my-recipe">{t("cancel")}</button>
              <button type="submit" id="save-my-recipe"> {t("save_changes")}</button>
            </div>
          </div>
        </form>

        <div className="community-post-display">
          <div className="make-community-post">
          <h4 style={{marginBottom:"10px"}}>{t("share_with_others")}</h4>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder={t("enter_group_name")} value={groupName}
                     onChange={(e) => setGroupName(e.target.value)}/>
              <input type="text" placeholder={t("enter_group_desc")} value={groupDesc}
                     onChange={(e) => setGroupDesc(e.target.value)}/>
              <input type="file" accept="image/*" onChange={handleMainImageUpload}/>


              <button type="submit">{t("make_post")}t</button>
            </form>
          </div>
          <p id={t("picture_preview")}>
            <p><strong>{t("picture_preview")}</strong></p>

            <img src={mainImage} alt="Preview" className="tip-image-preview"/>
          </p>

        </div>
      </div>

          {/* Community Posts */}
          <h4> {t("see_what_others")}</h4>
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
                      <p id="post-user">{t("posted_by")}  {getUsername(post.author)}</p>
                      <span style={{ fontWeight: "normal", marginBottom:"10px" }}> ({post.created})</span>
                    </div>
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

    </>
    ) : ( <>
    <div className="community-container">
      {/* Display error message if any */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Post Form */}
      <div className="community-headers">
        <div className="community-information">
          <h4 style={{marginBottom:"10px", fontSize:"36px"}}>{t("welcome_to")} {groupName}!</h4>
          { group === null ? (<p> None </p>) : (
              <p>{groupDesc || t("none")}</p>

          )}
          {ownerMode && (
              <div style={{display:"flex", gap:"10px", alignItems:"center", justifyContent:"center"}}>
              <button type="button" onClick={() => setEditMode(true)} id="edit-my-recipe"> Edit </button>
            </div>
          )}
        </div>

        <div className="community-post-display">
          <div className="make-community-post">
            <h4 style={{marginBottom:"10px"}}>{t("share_with_others")}</h4>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder={t("enter_post_title")} value={title}
                     onChange={(e) => setTitle(e.target.value)}/>
              <input type="text" placeholder={t("enter_post_desc")} value={description}
                     onChange={(e) => setDescription(e.target.value)}/>
                <input type="file" accept="image/*" onChange={handleMainImageUpload}/>




              <button type="submit">{t("make_post")}</button>

            </form>
          </div>
          <p id="picture-preview">
            <img
                src={mainImage}
                alt={t("choose_file")}
                className="tip-image-preview"
            />
          </p>
        </div>
      </div>

      {/* Community Posts */}
      <h4>{t("share_with_others")}</h4>
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
                      <p id="post-user">{t("posted_by")} {getUsername(post.author)}</p>
                      <span style={{ fontWeight: "normal", marginBottom:"10px" }}> ({post.created})</span>
                    </div>
                    {post.authorID === parseInt(sessionStorage.getItem("user")) && 
                      (post.id !== editPost ? ( 
                        <div className="community-post-buttons">
                          <button onClick={() => handleDelete(post.id)}>🗑{t("delete")}</button>
                          <button style={{backgroundColor:"#ffc492"}} onClick={() => {setEditPost(post.id);
                            setEditPostTitle(post.content); setEditPostDesc(post.attributes.description); setSelectedImage(post.attributes.mainImage);}}> {t("edit")} </button>
                        </div>
                      ) : (
                        <form onSubmit={(e) => updatePost(post, e)}>
                          <div className="community-post-buttons">
                            <button type="button" style={{backgroundColor:"rgb(172 176 173)"}} onClick={() => setEditPost(0)}>{t("cancel")}</button>
                            <button style={{backgroundColor:"rgb(146 255 160)"}} > {t("save")} </button>
                          </div>
                        </form>
                      ))
                    }
                  </div>
                  {post.id !== editPost ? ( <>
                    <p id="post-title">{post.content}</p>
                    <p id="post-description">{post.attributes?.description}</p></>
                  ) : ( <>
                    <input type="text" placeholder={t("enter_post_title")}value={editPostTitle} onChange={(e) => setEditPostTitle(e.target.value)}/>
                    <input type="text" placeholder={t("enter_post_desc")} value={editPostDesc} onChange={(e) => setEditPostDesc(e.target.value)}/>
                  </>
                  )}
                </div>
                {/* <button onClick={() => loadComments(post.id)}>View Comments</button> */}
                {post.id === editPost ? ( <>
                  <div className="upload-recipe-image">
                    <label htmlFor="file-upload" className="custom-file-upload">
                      {t("choose_file")}
                    </label>
                    <input id="file-upload" type="file" onChange={handleMainImageUpload} style={{display: "none"}}/>


                    <button type="button" style={{backgroundColor: "rgb(255, 146, 146)"}} onClick={() => {
                      setRemovePostPic(true);
                      setSelectedImage(null);
                    }}> {t("remove")} </button>
                  </div>
                </>) : (<>
                      {postImage && <img src={postImage} alt="post"/>}
                    </>
                )}
              </div>
                </>

            )
          )})
        ) : (
            <p>{t("no_posts_yet")}</p>

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
    </>
    ))
  );
};

export default CommunityDetails;
