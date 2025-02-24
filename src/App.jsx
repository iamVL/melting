import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "./Component/Settings";
import Edit from "./Component/Edit";

import AboutUs from "./AboutUs";
import AboutJustin from "./Team Pages/AboutJustin";
import Login from "./Login";

import AboutYessica from "./Team Pages/AboutYessica";
import AboutRudy from "./Team Pages/AboutRudy";

import AboutVaishnavi from "./Team Pages/AboutVaishnavi";
import AboutJoshua from "./Team Pages/AboutJoshua";

import HomePage from "./Component/HomePage";
import HowToGuides from "./Component/HowToGuides"; // Import the new page
import Navbar from "./Component/Navbar";
import Friends from "./Component/Friends";
import Groups from "./Component/Groups";
import Modal from "./Component/Modal";
import PromiseComponent from "./Component/PromiseComponent";
// import LoginForm from "./Component/LoginForm";
import RegisterForm from "./Component/RegisterForm";
import ResetPassword from "./Component/ResetPassword";
import Messaging from "./Component/Messaging";
import { io } from "socket.io-client";

// Initialize the socket with the respective path and tenantID
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
    console.log("CALLING DOREFRESHPOSTS IN APP.JSX");
    setRefreshPosts(true);
  };

  const toggleModal = (e) => {
    e.preventDefault();
    setOpenModal((prev) => !prev);
    console.log(openModal);
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
          <Navbar toggleModal={(e) => toggleModal(e)} logout={(e) => logout(e)} />
          <div className="maincontent" id="mainContent">
            <Routes>
              <Route path="/settings" element={<Settings />} />
              <Route path="/edit-profile" element={<Edit />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/about_justin" element={<AboutJustin />} />
              <Route path="/about_yessica" element={<AboutYessica />} />
              <Route path="/about_rudy" element={<AboutRudy />} />
              <Route path="/about_vi" element={<AboutVaishnavi />} />
              <Route path="/about_joshua" element={<AboutJoshua />} />

              {/* Updated Home Route */}
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

              {/* Added How-To Guides Route */}
              <Route path="/how-to-guides" element={<HowToGuides />} />

              <Route path="/register" element={<RegisterForm setLoggedIn={setLoggedIn} />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/promise" element={<PromiseComponent />} />

              {/* Dynamic Room ID for Messaging */}
              <Route path="/messages/:roomID" element={<Messaging />} />
            </Routes>
          </div>
        </header>

        <Modal show={openModal} onClose={(e) => toggleModal(e)}>
          This is a modal dialog!
        </Modal>
      </div>
    </Router>
  );
}

export default App;
