import React, { useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "../assets/profile icon.png";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li className="dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          <span className="dropdown-title">Featured ▼</span>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/tips">Cooking Tips</Link></li>
              <li><Link to="/how-to-guides">How To Guides</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/favorites">Favorites</Link></li>

        {/* Upload Dropdown */}
        <li className="dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          <span className="dropdown-title">Upload ▼</span>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/tip-upload">Cooking Tip</Link></li>
              <li><Link to="/upload">Recipe</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/filter">Filter</Link></li>
        <img src="/melting-pot-logo.jpeg" alt="Melting" className="logo" width={120} />
        <li><Link to="/aboutus">About Us</Link></li>
        <li><Link to="/settings"><img src={profileIcon} width={60} height={60} className="active" alt="profile" title="profile" /></Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
