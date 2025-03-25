import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "./Component/Settings";
import Edit from "./Component/Edit";
import ViewTip from "./Component/CookingTipPage";
import TipForm from "./Component/Tip";
import TipDetails from "./Component/TipDetails";
import RecipeListContainer from "./Component/RecipeCollection";
import AboutUs from "./AboutUs";
import AboutJustin from "./Team Pages/AboutJustin";
import Login from "./Login";
import StyleGuide from "./StyleGuide";
import RecipeListing from "./Component/RecipeListing";
import AboutYessica from "./Team Pages/AboutYessica";
import AboutRudy from "./Team Pages/AboutRudy";
import AboutVaishnavi from "./Team Pages/AboutVaishnavi";
import AboutJoshua from "./Team Pages/AboutJoshua";
import UploadRecipe from "./Component/UploadRecipe";
import HomePage from "./Component/HomePage";
import CommunityPage from './Component/Community';
import HowToGuides from "./Component/HowToGuides"; 
import BakingBasics from "./Component/BakingBasics"; 
import GrillingTechniques from "./Component/GrillingTechniques";
import KnifeSkills from "./Component/KnifeSkills"; // New
import PastaGuide from "./Component/PastaCooking"; // New
import PancakeSecrets from "./Component/PancakeRecipe"; // New
import Navbar from "./Component/Navbar";
import Friends from "./Component/Friends";
import Groups from "./Component/Groups";
import Modal from "./Component/Modal";
import PromiseComponent from "./Component/PromiseComponent";
import RegisterForm from "./Component/RegisterForm";
import ResetPassword from "./Component/ResetPassword";
import Messaging from "./Component/Messaging";
import RecipeDetails from "./Component/RecipeDetails";
import Posts from "./Component/Posts";
import RecipeList from "./Component/RecipeList";
import CommunityDetails from "./Component/CommunityDetails";
import FavoritedRecipes from "./Component/FavoritedRecipes";


import { io } from "socket.io-client";
import CookbookManager from "./Component/CookbookManager";
import CookbookDetail from "./Component/CookbookDetail";


// Initialize socket connection
const socket = io(process.env.REACT_APP_API_PATH_SOCKET, {
  path: "/hci/api/realtime-socket/socket.io",
  query: {
    tenantID: "example",
  },
});
export { socket };

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setLoggedIn(false);
    window.location.reload();
  };

  const doRefreshPosts = () => {
    setRefreshPosts(true);
  };

  const toggleModal = (e) => {
    e.preventDefault();
    setOpenModal((prev) => !prev);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to HCI socket server");
    });
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className="App-header">
          <Navbar toggleModal={toggleModal} logout={logout} />
          <div className="maincontent" id="mainContent">
            <Routes>
              <Route path="/tip-upload" element={<TipForm />} />
              <Route path="/tips" element={<ViewTip />} />
              <Route path="/recipes" element={<RecipeListContainer />} />
              <Route path="/tip/:id" element={<TipDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/edit-profile" element={<Edit  />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/StyleGuide" element={<StyleGuide />} />
              <Route path="/about_justin" element={<AboutJustin />} />
              <Route path="/about_yessica" element={<AboutYessica />} />
              <Route path="/about_rudy" element={<AboutRudy />} />
              <Route path="/about_vi" element={<AboutVaishnavi />} />
              <Route path="/about_joshua" element={<AboutJoshua />} />
              <Route path="/upload" element={<UploadRecipe />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/community-details/:communityId" element={<CommunityDetails />} />
              <Route path="/favorites" element={<FavoritedRecipes />} />

              {/* Home Page */}
              <Route
                path="/"
                element={
                  <HomePage
                    setLoggedIn={setLoggedIn}
                    doRefreshPosts={doRefreshPosts}
                    appRefresh={refreshPosts}
                  />
                }
              />

              {/* How-To Guides */}
              <Route path="/how-to-guides" element={<HowToGuides />} />
              <Route path="/community" element={<CommunityPage />} />

              {/* How-To Guide Pages */}
              <Route path="/baking-basics" element={<BakingBasics />} />
              <Route path="/grilling-techniques" element={<GrillingTechniques />} /> 
              <Route path="/knife-skills" element={<KnifeSkills />} /> 
              <Route path="/perfect-pasta" element={<PastaGuide />} /> 
              <Route path="/fluffy-pancakes" element={<PancakeSecrets />} /> 

              {/* Other Pages */}
              <Route path="/register" element={<RegisterForm setLoggedIn={setLoggedIn} />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/promise" element={<PromiseComponent />} />

              <Route path= "/posts" element={<Posts />} />
              <Route path= "/recipe" element={<RecipeList />} />
              <Route path="/cookbooks" element={<CookbookManager/>}/>
              <Route path="/cookbooks/:cookbookName" element={<CookbookDetail />} />

     {/* Dynamic Room ID for Messaging */}

   

              <Route path="/messages/:roomID" element={<Messaging />} />
            </Routes>
          </div>
        </header>

        <Modal show={openModal} onClose={toggleModal}>
          This is a modal dialog!
        </Modal>
      </div>
    </Router>
  );
}

export default App;
