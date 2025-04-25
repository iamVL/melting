import React, { useState, useEffect } from "react";
import "../App.css";
import "../Profile.css";
import Favorites from "../Account_Buttons/Favorites.png";
import Stars from "../Account_Buttons/Stars.png";
import My_recipes from "../Account_Buttons/My_recipes.png";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../translator/Languagecontext";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [dietRegimes, setDietRegimes] = useState([]);
  const navigate = useNavigate();

  const allergyOptions = ["Peanuts", "Gluten", "Dairy",
    "TreeNuts", "Shellfish", "Eggs", "None"];
  const dietOptions = ["Kosher", "Halal", "Vegetarian", "Vegan", "Pescitarian" ,"None"];

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) return;

    fetch(`${process.env.REACT_APP_API_PATH}/users/${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.attributes) {
            setUsername(result.attributes.username || "");
            setFullName(result.attributes.fullName || "");
            setPhone(result.attributes.phone || "");
            setEmail(result.attributes.email || "");
            setPicture(result.attributes.picture || "");
            setCountry(result.attributes.country || "");
            setAllergies(result.attributes.allergies || []);
            setDietRegimes(result.attributes.dietRegimes || []);
          }
        })
        .catch(() => alert("Error fetching profile data!"));
  }, []);

  const handleToggleAllergy = (item) => {
    if (item === "None") {
      setAllergies(["None"]);
    } else {
      const updated = allergies.includes(item)
          ? allergies.filter((a) => a !== item)
          : [...allergies.filter((a) => a !== "None"), item];
      setAllergies(updated);
    }
  };

  const handleToggleDiet = (item) => {
    if (item === "None") {
      setDietRegimes(["None"]);
    } else {
      const updated = dietRegimes.includes(item)
          ? dietRegimes.filter((d) => d !== item)
          : [...dietRegimes.filter((d) => d !== "None"), item];
      setDietRegimes(updated);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_PATH}/users/${sessionStorage.getItem("user")}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        attributes: {
          username,
          fullName,
          phone,
          email,
          picture,
          country,
          allergies,
          dietRegimes,
        },
      }),
    })
        .then((res) => res.json())
        .then((result) => {
          setResponseMessage(result.Status);
          setTimeout(() => navigate("/settings"), 500);
        })
        .catch(() => alert("Error updating profile!"));
  };

  const uploadPicture = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploaderID", sessionStorage.getItem("user"));
    formData.append("attributes", JSON.stringify({}));
    formData.append("file", file);

    fetch(`${process.env.REACT_APP_API_PATH}/file-uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    })
        .then((res) => res.json())
        .then((result) => {
          let pictureURL = "https://webdev.cse.buffalo.edu" + result.path;
          setPicture(pictureURL);
        });
  };

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  return (
      <>
        <form onSubmit={submitHandler} className="profileform">
          <div className="userContainer">
            <div className="containerInfo">
              <img className="userPic" src={picture} alt="profile" />
              <div className="userInfo">
                <span>{fullName}</span><br />
                <span>User: {username}</span>
              </div>
            </div>
            <div className="editUser">
              <button onClick={logout} className="logout">Log out</button><br />
            </div>
          </div>
          <div className="bottonProfileSection">
            <div className="accountSettings">
              <div className="accountHeaders">
                <h2>Account Settings</h2>
                <a>Update your personal information</a>
              </div>
              <div className="allinputscp">
                <div className="inputs">
                  <a>Profile Picture</a>
                  <input type="file" accept="image/*" onChange={uploadPicture} aria-label="Upload Profile Picture" />
                </div>
                <div className="inputs">
                  <a>Email</a>
                  <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} maxLength="60" />
                </div>
                <div className="inputs">
                  <a>Username</a>
                  <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} maxLength="50" />
                </div>
                <div className="inputs">
                  <a>Full Name</a>
                  <input type="text" onChange={(e) => setFullName(e.target.value)} value={fullName} maxLength="50" />
                </div>
                <div className="inputs">
                  <a>Phone Number</a>
                  <input type="text" pattern="[0-9]*" onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} value={phone} maxLength="11" />
                </div>
                <div className="countrybuttons">
                  <a>Country</a>
                  <country>
                    {["USA", "Canada", "UK"].map((c) => (
                        <button key={c} type="button" onClick={() => setCountry(c)} className={country === c ? "selected_country" : "countrybutton"}>{c}</button>
                    ))}
                  </country>
                </div>



                <input className="submitbutton" type="submit" value="Save Changes" />
                {responseMessage && <div style={{ color: "green" }}>{responseMessage}</div>}
              </div>
            </div>

            <div className="accountActions">
              <div className="recipeButtons">
                {[{path: "/favorites", img: Favorites, text: "Favorite Recipes"},
                  {path: "/friends", img: Stars, text: "Follow List"},
                  {path: "/cookbooks", img: My_recipes, text: "Cookbooks"}].map(({path, img, text}) => (
                    <Link key={path} to={path} className="recipeButtons">
                      <recipebutton>
                        <img className="recipeimage" src={img} alt={text}/>
                        <span>{text}</span>
                      </recipebutton>
                    </Link>
                ))}
              </div>
              <h2>Dietary Restrictions</h2>
              <div className="text4">
              <p> Update your dietary restrictions</p>
              </div>
              <div className="inputs">
                <a>Allergies</a>
                <div className="dietary-group">
                  {allergyOptions.map((item) => (
                      <button
                          type="button"
                          key={item}
                          className={`dietary-button ${allergies.includes(item) ? "selected" : ""}`}
                          onClick={() => handleToggleAllergy(item)}
                      >
                        {item}
                      </button>
                  ))}
                </div>
              </div>
              <div className="inputs">
                <a>Diet Regimes</a>
                <div className="dietary-group">
                  {dietOptions.map((item) => (
                      <button
                          type="button"
                          key={item}
                          className={`dietary-button ${dietRegimes.includes(item) ? "selected" : ""}`}
                          onClick={() => handleToggleDiet(item)}
                      >
                        {item}
                      </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
  );
};

export default Profile;
