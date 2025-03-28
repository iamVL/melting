import React, { useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "../assets/profile icon.png";
import meltingLogo from "../assets/melting-pot-logo.jpeg";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
  return (
    <nav className="navbar">
      <ul className="nav-links">
      <Link to="/"> <img src={meltingLogo} alt="Melting" className="logo" width={120} /></Link>
        <li><Link to="/">Home</Link></li>
        <li className="dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          <span className="dropdown-title">Featured ▼</span>
          {dropdownOpen && (
            <ut className="dropdown-menu">
              <li><Link to="/recipes">Recipes</Link></li>
              <li><Link to="/tips">Cooking Tips</Link></li>
              <li><Link to="/how-to-guides">How To Guides</Link></li>
              <li><Link to="/community">Communities</Link></li>
            </ut>
          )}
        </li>
        <li><Link to="/favorites">Favorites</Link></li>

        {/* Upload Dropdown */}
        <li className="dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          <span className="dropdown-title">Upload ▼</span>
          {dropdownOpen && (
            <ut className="dropdown-menu">
              <li><Link to="/upload">Recipe</Link></li>
              <li><Link to="/tip-upload">Cooking Tip</Link></li>
            </ut>
          )}
        </li>

        <li><Link to="/filter">Filter</Link></li>
        <li className="dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          <span className="dropdown-title">About ▼</span>
          {dropdownOpen && (
            <ut className="dropdown-menu">
              <li><Link to="/aboutus">Our Team</Link></li>
              <li><Link to="/StyleGuide">Style Guide</Link></li>
            </ut>
          )}
        </li>
        <li><Link to="/settings"><img src={profileIcon} width={60} height={60} className="active" alt="profile" title="profile" /></Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
