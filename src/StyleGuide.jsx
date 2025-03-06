import React, { useState } from "react";
import "./StyleGuide.css"; // Import CSS styles
import meltingLogo from "./assets/melting-pot-logo.jpeg";


const StyleGuide = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container">

      <h1>Style Guide</h1>
      <p>
        The style guide is your instruction set to future developers on how to extend
        your application while maintaining the overall look and feel - the "branding".
      </p>

      {/* Fonts & Font Sizes */}
      <div className="column">
        <h2>1. Website Logo</h2>
        <img src={meltingLogo} alt="Melting" className="logo" width={300} />
      </div>

      <div className="column">
        <h2>2. Fonts & Font Sizes</h2>
        <p><strong>Primary Font:</strong> Roboto, Arial, sans-serif.</p>
        <div className="font-examples">
          <p className="heading-1">Heading 1 - 32px Bold</p>
          <p className="heading-2">Heading 2 - 24px Semi-Bold</p>
          <p className="body-text">Body Text - 16px Normal</p>
          <p className="small-text">Small Text - 14px Normal</p>
        </div>
      </div>

      {/* Color Palette */}
      <div className="color-box">
        <h2>3. Color Palette & Usage</h2>
        <div className="color-sample brand">Terracotta (#E8775B)</div>  
        <div className="color-sample posthome">Pumpkin (#FF8C42)</div>
        <div className="color-sample cuisine">Ivory (#FF8F4A)</div>
        <div className="color-sample text">Dark Gray (#333333)</div>
        <div className="color-sample success">Success Green (#5CB85C)</div>
        <div className="color-sample error">Error Red (#D9534F)</div>
      </div>

      {/* Buttons */}
      <div className="column">
        <h2>4. Buttons</h2>
        <div className="button-container">
          <button className="btn btn-primary">Sign Up</button>
          <button className="btn btn-secondary">Cancel</button>
        </div>
        <country>
          <input type="button" value="YES" class="countrybutton" />
          <input type="button" value="NO" class="selected_country" />
        </country>
        <button className="editprofile">Edit Profile</button>
        <a class="read-more">Read More →</a>
        <button class="btn primary">Join Now</button>
        <button class="btn primary">Post Your Own</button>
        <div class="cuisine-card"><p>Cuisine</p></div>
        <button type="button" class="tip-add-step-btn">Step</button>
      </div>

      {/* Popups / Modals */}
      <div className="column">
        <h2>5. Popups / Modals</h2>
        <p>This modal centers itself and dims the background.</p>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Show Modal
        </button>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
              <p>This is a modal example!</p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Messages */}
      <div className="column">
        <h2>6. Feedback Messages</h2>
        <div className="alert success">Success Message: Action completed!</div>
        <div className="alert error">Error Message: Something went wrong!</div>
      </div>

      {/* Inline Help */}
      <div className="column">
        <h2>7. Inline Help</h2>
        <p>
          Need more info?
          <span className="help-icon" title="This is an inline help tooltip">?</span>
        </p>
      </div>
    </div>
  );
};

export default StyleGuide;
