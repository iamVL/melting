import React, { useState } from "react";
import { Link, useLocation} from "react-router-dom";
import "../Navbar.css";
import profileIcon from "../assets/profile icon.png";
import meltingLogo from "../assets/melting-pot-logo.jpeg";

const Navbar = () => {
  // Track if mobile drawer is open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Track each dropdown’s open state separately
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Quick “isMobile” check (<= 768px).
  const isMobile = window.innerWidth <= 768;

  // Toggle the mobile drawer
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // === Dropdown: Featured ===
  const handleFeaturedEnter = () => {
    if (!isMobile) setFeaturedOpen(true);  // hover
  };
  const handleFeaturedLeave = () => {
    if (!isMobile) setFeaturedOpen(false); // hover
  };
  const handleFeaturedClick = () => {
    if (isMobile) setFeaturedOpen((prev) => !prev); // tap
  };

  // === Dropdown: Upload ===
  const handleUploadEnter = () => {
    if (!isMobile) setUploadOpen(true);
  };
  const handleUploadLeave = () => {
    if (!isMobile) setUploadOpen(false);
  };
  const handleUploadClick = () => {
    if (isMobile) setUploadOpen((prev) => !prev);
  };

  // === Dropdown: About ===
  const handleAboutEnter = () => {
    if (!isMobile) setAboutOpen(true);
  };
  const handleAboutLeave = () => {
    if (!isMobile) setAboutOpen(false);
  };
  const handleAboutClick = () => {
    if (isMobile) setAboutOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-left">
        <Link to="/">
          <img
            src={meltingLogo}
            alt="Melting Logo"
            className="logo"
            width={120}
          />
        </Link>
      </div>

      {/* Main nav container (slides in from left on mobile) */}
      <div className={`nav-links-container ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          {/* Home */}
          <li>
            <Link to="/" style={{textDecoration: location.pathname === "/" ? "underline" : undefined}}>Home</Link>
          </li>

          {/* Featured dropdown */}
          <li
            className="dropdown"
            onMouseEnter={handleFeaturedEnter}
            onMouseLeave={handleFeaturedLeave}
            onClick={handleFeaturedClick}
          >
            <span className="dropdown-title" style={{textDecoration: location.pathname === "/recipes"|| location.pathname === "/tips" || location.pathname === "/how-to-guides" || location.pathname === "/community" ? "underline" : undefined}}>Featured ▼</span>
            {featuredOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/recipes">Recipes</Link></li>
                <li><Link to="/tips">Cooking Tips</Link></li>
                <li><Link to="/how-to-guides">How To Guides</Link></li>
                <li><Link to="/community">Communities</Link></li>
              </ul>
            )}
          </li>

          {/* Favorites */}
          <li>
            <Link to="/favorites" style={{textDecoration: location.pathname === "/favorites" ? "underline" : undefined}}>Favorites</Link>
          </li>

          {/* Upload dropdown */}
          <li
            className="dropdown"
            onMouseEnter={handleUploadEnter}
            onMouseLeave={handleUploadLeave}
            onClick={handleUploadClick}
          >
            <span className="dropdown-title" style={{textDecoration: location.pathname === "/upload" || location.pathname === "/tip-upload"  ? "underline" : undefined}}>Upload ▼</span>
            {uploadOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/upload">Recipe</Link></li>
                <li><Link to="/tip-upload">Cooking Tip</Link></li>
              </ul>
            )}
          </li>

          {/* Filter */}
          <li>
            <Link to="/filter" style={{textDecoration: location.pathname === "/filter" ? "underline" : undefined}}>Filter</Link>
          </li>

          {/* About dropdown */}
          <li
            className="dropdown"
            onMouseEnter={handleAboutEnter}
            onMouseLeave={handleAboutLeave}
            onClick={handleAboutClick}
          >
            <span className="dropdown-title" style={{textDecoration: location.pathname === "/aboutus" || location.pathname === "/StyleGuide" ? "underline" : undefined}}>About ▼</span>
            {aboutOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/aboutus">Our Team</Link></li>
                <li><Link to="/StyleGuide">Style Guide</Link></li>
              </ul>
            )}
          </li>

          {/* Profile Icon */}
          <li>
            <Link to="/settings">
              <img
                src={profileIcon}
                width={60}
                height={60}
                className="active"
                alt="profile"
                title="profile"
              />
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: Hamburger / X button (visible on mobile) */}
      <button className="hamburger" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? "✕" : "☰"}
      </button>
    </nav>
  );
};

export default Navbar;
