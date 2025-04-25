import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Navbar.css";
import profileIcon from "../assets/profilelogo.png";
import meltingLogo from "../assets/Transparent TMP.png";
import LanguageSwitcher from '../translator/LanguageSwitcher';
import { useLanguage } from "../translator/Languagecontext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const token = sessionStorage.getItem("token");
  const { t } = useLanguage();

  const isMobile = window.innerWidth <= 768;

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const handleFeaturedEnter = () => { if (!isMobile) setFeaturedOpen(true); };
  const handleFeaturedLeave = () => { if (!isMobile) setFeaturedOpen(false); };
  const handleFeaturedClick = () => { if (isMobile) setFeaturedOpen(prev => !prev); };
  const handleUploadEnter = () => { if (!isMobile) setUploadOpen(true); };
  const handleUploadLeave = () => { if (!isMobile) setUploadOpen(false); };
  const handleUploadClick = () => { if (isMobile) setUploadOpen(prev => !prev); };
  const handleAboutEnter = () => { if (!isMobile) setAboutOpen(true); };
  const handleAboutLeave = () => { if (!isMobile) setAboutOpen(false); };
  const handleAboutClick = () => { if (isMobile) setAboutOpen(prev => !prev); };

  return (
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">
            <img src={meltingLogo} alt="Melting Logo" className="logo" width={120} />
          </Link>
          <LanguageSwitcher />
        </div>

        <div className={`nav-links-container ${mobileMenuOpen ? "open" : ""}`}>
          <ul className={token ? "nav-links" : "landing-links"}>
            {token ? (
                <>
                  <li>
                    <Link to="/" style={{ textDecoration: location.pathname === "/" ? "underline" : undefined }}>
                      {t("nav_home")}
                    </Link>
                  </li>

                  <li className="dropdown" onMouseEnter={handleFeaturedEnter} onMouseLeave={handleFeaturedLeave} onClick={handleFeaturedClick}>
                <span className="dropdown-title" style={{ textDecoration: ["/recipes", "/tips", "/how-to-guides", "/community"].includes(location.pathname) ? "underline" : undefined }}>
                  {t("nav_featured")} ▼
                </span>
                    {featuredOpen && (
                        <ul className="dropdown-menu">
                          <li><Link to="/recipes">{t("nav_recipes")}</Link></li>
                          <li><Link to="/tips">{t("nav_cooking_tips")}</Link></li>
                          <li><Link to="/how-to-guides">{t("nav_how_to_guides")}</Link></li>
                          <li><Link to="/community">{t("nav_communities")}</Link></li>
                        </ul>
                    )}
                  </li>

                  <li>
                    <Link to="/favorites" style={{ textDecoration: location.pathname === "/favorites" ? "underline" : undefined }}>
                      {t("nav_favorites")}
                    </Link>
                  </li>

                  <li className="dropdown" onMouseEnter={handleUploadEnter} onMouseLeave={handleUploadLeave} onClick={handleUploadClick}>
                <span className="dropdown-title" style={{ textDecoration: ["/upload", "/tip-upload"].includes(location.pathname) ? "underline" : undefined }}>
                  {t("nav_upload")} ▼
                </span>
                    {uploadOpen && (
                        <ul className="dropdown-menu">
                          <li><Link to="/upload">{t("nav_recipe")}</Link></li>
                          <li><Link to="/tip-upload">{t("nav_cooking_tip")}</Link></li>
                        </ul>
                    )}
                  </li>

                  <li>
                    <Link to="/filter" style={{ textDecoration: location.pathname === "/filter" ? "underline" : undefined }}>
                      {t("nav_filter")}
                    </Link>
                  </li>

                  <li className="dropdown" onMouseEnter={handleAboutEnter} onMouseLeave={handleAboutLeave} onClick={handleAboutClick}>
                <span className="dropdown-title" style={{ textDecoration: ["/aboutus", "/StyleGuide"].includes(location.pathname) ? "underline" : undefined }}>
                  {t("nav_about")} ▼
                </span>
                    {aboutOpen && (
                        <ul className="dropdown-menu">
                          <li><Link to="/aboutus">{t("nav_our_team")}</Link></li>
                          <li><Link to="/StyleGuide">{t("nav_style_guide")}</Link></li>
                        </ul>
                    )}
                  </li>

                  <li>
                    <Link to="/settings">
                      <img src={profileIcon} width={60} height={60} className="active" alt="profile" title="profile" />
                    </Link>
                  </li>
                </>
            ) : (
                <>
                  <li><Link to="/login">{t("nav_login")}</Link></li>
                  <li><Link to="/register">{t("nav_register")}</Link></li>
                </>
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
      </>) : ( <>
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
        <LanguageSwitcher />
      </div>

      {/* Main nav container (slides in from left on mobile) */}
      <div className={`nav-links-container ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="landing-links">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </div>
        <button className="hamburger" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>
  );
};

export default Navbar;
