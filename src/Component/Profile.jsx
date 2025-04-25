import React, { useState, useEffect } from "react";
import "../App.css";
import "../Profile.css";
import "./RegisterForm";
import Favorites from "../Account_Buttons/Favorites.png"
import Stars from "../Account_Buttons/Stars.png"
import My_recipes from "../Account_Buttons/My_recipes.png"
import GearIcon from "../assets/gear-icon.png"
import { Link } from "react-router-dom";

import Modal from "../Component/Modal"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import {useLanguage} from "../translator/Languagecontext";




// The Profile component shows data from the user table.  This is set up fairly generically to allow for you to customize
// user data by adding it to the attributes for each user, which is just a set of name value pairs that you can add things to
// in order to support your group specific functionality.  In this example, we store basic profile information for the user
const Profile = (props) => {
  // states which contain basic user information/attributes
  // Initially set them all as empty strings to post them to the backend
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [picture, setPicture] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState(false);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
  const token = sessionStorage.getItem("token");
  const [allergies, setAllergies] = useState("");
  const [dietRegimes, setDietRegimes] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const { t } = useLanguage();
  useEffect(() => {
    if (!token) return;

    const apiUrl = `${process.env.REACT_APP_API_PATH}/posts?postType=favorite`;



    fetch(apiUrl, {
      method: "GET",  // ✅ Corrected method (was "POST" before)
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFavoritedRecipes(data.map((fav) => fav.id));  // ✅ Properly mapping the IDs
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [token]);



  // Replace componentDidMount for fetching data
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
        "user"
      )}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result && result.attributes) {
          // if the attributes already exists and they are stored, set the states to those attributes
          // so that nothing gets overwritten
          setUsername(result.attributes.username || "");
          setFullName(result.attributes.fullName || "");
          setPhone(result.attributes.phone || "");
          setEmail(result.attributes.email || "");
          setPassword(result.attributes.password || "");
          setPicture(result.attributes.picture || "");
          setCountry(result.attributes.country || "");
          setAllergies(result.attributes.allergies || []);
          setDietRegimes(result.attributes.dietRegimes || []);


        }
      })
      .catch((error) => {
        alert("error!");
      });
  }, []);

  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.
  const submitHandler = (event) => {
    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault();

    //make the api call to the user controller, and update the user fields (username, firstname, lastname)
    fetch(
      `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem(
        "user"
      )}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attributes: {
            username: username,
            fullName: fullName,
            phone: phone,
            email: email,
            password: password,
            picture: picture,
            country: country,
            allergies: allergyOptions,
            dietRegimes: dietOptions,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setResponseMessage(result.Status);
      })
      .catch((error) => {
        alert("error!");
      });
  };
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(
          `${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem("user")}?relatedObjectsAction=delete`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
      );

      if (res.status === 204) {
        sessionStorage.clear();
        navigate("/"); // Or your login page
      } else {
        alert("Something went wrong deleting your account.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account.");
    }
  };
  const uploadPicture = (event) => {
    event.preventDefault();

    // event.target.files[0] holds the file object that the user is uploading
    const file = event.target.files[0];

    // FormData objects are used to capture HTML form and submit it using fetch or another network method.
    // provides a way to construct a set of key/value pairs representing form fields and their values
    // we can use this formData to send the attributes for the file-uploads endpoint
    const formData = new FormData();

    formData.append("uploaderID", sessionStorage.getItem("user")); // the id of the user who is uploading the file
    formData.append("attributes", JSON.stringify({})); // attributes holds an empty object, can put whatever you want here
    formData.append("file", file); // the file itself

    // make api call to file-uploads endpoint to post the profile picture
    fetch(process.env.REACT_APP_API_PATH + "/file-uploads", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData, // send the formdata to the backend
    })
      .then((res) => res.json())
      .then((result) => {
        // pictureURL holds the url of where the picture is stored to show on the page
        let pictureURL = "https://webdev.cse.buffalo.edu" + result.path;
        setPicture(pictureURL);
      });
  };

  const [loggedIn, setLoggedIn] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setLoggedIn(false);
    // reloads the window, so we get back to the login form
    window.location.reload();
  };

  const allergyOptions = ["Peanut", "Gluten", "Tree nuts","Dairy", "Shellfish", "None"];
  const dietOptions = ["Kosher", "Halal", "Vegetarian", "Vegan","Pescitarian", "None"];


  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.
  return (
    <>
      {/* profile info */}
    <form onSubmit={submitHandler} className="profileform">
      <div class="userContainer">
        <div class="containerInfo">
          <img class ="userPic" src={picture} alt="profile"></img>

          {/* user info */}
          <div class="userInfo">
            <a>{fullName}</a><br />
            <a>User: {username}</a>
          </div>
        </div>

        {/* profile buttons */}

        <div className="editUser">
          <button onClick={logout} className="account-button logout-button">{t('logout')}</button>

          <Link to="/edit-profile">
            <button className="account-button editprofile-button">{t('editProfile')}</button>
          </Link>

          <button
              className="account-button delete-button"
              onClick={() => setShowDeleteModal(true)}
          >
            🗑️ {t('deleteAccount')}
          </button>

        </div>


      </div>
      <div class="bottonProfileSection">
        <div class="accountSettings">
          <div class="accountHeaders">
            <profile-header>{t('accountSettings_title')}</profile-header>
            <a>{t('accountSettings_description')}</a>
          </div>
          <div class="allinputs">
            <div class ="inputs">
              <a> {t('email')}</a>
              <div class="display">
                  {email}
              </div>
            </div>
            <div class ="inputs">
              <a> {t('username')}</a>
              <div class="display">
                  {username}
              </div>
            </div>
            <div class ="inputs">
              <a> {t('fullName')}</a>
              <div class="display">
                  {fullName}
              </div>
            </div>
            <div class ="inputs">
              <a> {t('phoneNumber')}</a>
              <div class="display">
                  {phone}
              </div>
            </div>
            {/* <div class ="inputs">
              <a> Favorite Color</a>
              <input
                  type="text"
                  onChange={(e) => setFavoriteColor(e.target.value)}
                  value={favoriteColor}
                  maxlength="15"
                />
            </div> */}
            <div class="countrybuttons">
              <a> {t('country')}</a>
              <form>
                <country>
                  <input
                      type="button"
                      value="USA"
                      class={country === "USA" ? "selected_country" : "countrybutton"}
                  />
                  <input
                      type="button"
                      value="Canada"
                      class={country === "Canada" ? "selected_country" : "countrybutton"}
                  />
                  <input
                      type="button"
                      value="UK"
                      class={country === "UK" ? "selected_country" : "countrybutton"}
                  />
                </country>
              </form>

              {/* <input
                  type="text"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  maxlength="15"
                /> */}
            </div>
            {responseMessage}
          </div>
        </div>

        <div class="accountActions">
          <div class="recipeButtons">
            <Link to="/favorites" class="recipeButtons">
              <recipebutton>
                <img class="recipeimage" src={Favorites} alt="favorites"></img>
                <a>{t('favorites_title')}</a>
              </recipebutton>
            </Link>

            <Link to="/friends" class="recipeButtons">
              <recipebutton>
                <img class="recipeimage" src={Stars} alt="Stars"></img>
                <a> {t('followList')}</a>
              </recipebutton>
            </Link>

            <Link to="/cookbooks" class="recipeButtons">
              <recipebutton>
                <img class="recipeimage" src={My_recipes} alt="My_recipes"></img>
                <a>{t('cookbooks')}</a>
              </recipebutton>
            </Link>
            {/* <Link to="/ab-profile" class="recipeButtons">
              <recipebutton>
                <img class="recipeimage" src={GearIcon} alt="ABSettings"></img>
                <a>A/B Settings</a>
              </recipebutton>
            </Link> */}
          </div>

          <h2 style={{marginBottom:"0px"}}> {t('dietaryRestrictions')}</h2>
          <label style={{fontSize:"14px", color:"#d46a4c", marginTop:"0px", padding:"0px"}}>{t('auto')}</label>

          <div className="inputs">
            <a>{t('allergiesHeader')}</a>
            <div className="dietary-group">
              {["Peanuts", "Gluten", "Dairy", "Shellfish","TreeNuts", "Eggs", "None"].map((item) => (
                  <button
                      type="button"
                      key={item}
                      className={`dietary-button ${allergies.includes(item) ? "selected" : ""}`}

                  >
                    {item}
                  </button>
              ))}
            </div>
          </div>

          <div className="inputs">
            <a>{t('dietRegimes')}</a>
            <div className="dietary-group">
              {["Kosher", "Halal", "Vegetarian", "Vegan","Pescitarian", "None"].map((item) => (
                  <button
                      type="button"
                      key={item}
                      className={`dietary-button ${dietRegimes.includes(item) ? "selected" : ""}`}

                  >
                    {item}
                  </button>
              ))}
            </div>
          </div>

        </div>
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <h3>Delete Account</h3>
          <p>Are you sure you want to permanently delete your account and all your data?</p>
          <div className="modal-buttons">
            <button
                className="confirm-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteAccount(); // ← external function is called here
                }}
            >
              Yes, Delete
            </button>
            <button
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>


      </div>
    </form>
</>
)
  ;
};

export default Profile;
