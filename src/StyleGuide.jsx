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
        <div className = "snip-box">
          <h2>1. Website Logo</h2>
          <img src={meltingLogo} alt="Melting" className="logo" width={300} />
        </div>
      </div>

      <div className="column">
        <div className = "snip-box">
          <h2>2. Fonts & Font Sizes</h2>
          <p><strong>Primary Font:</strong> Roboto, Arial, sans-serif.</p>
          <div className="font-examples">
            <p className="heading-1">Heading 1 - 32px Bold</p>
            <p className="heading-2">Heading 2 - 24px Semi-Bold</p>
            <p className="body-text">Body Text - 16px Normal</p>
            <p className="small-text">Small Text - 14px Normal</p>
          </div>
        </div>
        <pre>
          <code>
            {`body {
  font-family: "Roboto", Arial, sans-serif;
  background-color: var(--color-accent);
  margin: 0;
  padding: 0;
}

.heading-1 {
  color: #333333;
  font-size: 32px;
  font-weight: 700;
}

.heading-2 {
  color: #333333;
  font-size: 24px;
  font-weight: 600;
}

.body-text {
  color: #333333;
  font-size: 16px;
  font-weight: 400;
}

.small-text {
  color: #333333;
  font-size: 14px;
  font-weight: 400;
}`}
          </code>
        </pre>
      </div>

      {/* Color Palette */}
      <div className="column">
        <div className = "color-box">
        <h2>3. Color Palette & Usage</h2>
        <div className="color-sample brand">Terracotta (#E8775B)</div>  
        <div className="color-sample posthome">Pumpkin (#FF8C42)</div>
        <div className="color-sample cuisine">Ivory (#FF8F4A)</div>
        <div className="color-sample text">Dark Gray (#333333)</div>
        <div className="color-sample success">Success Green (#5CB85C)</div>
        <div className="color-sample error">Error Red (#D9534F)</div>
        </div>
        <pre>
          <code>
            {`.brand {
    background-color: #E8775B;
    color: white;
}

.posthome {
    background-color: #ff8c42;
    color: white;
}

.cuisine {
    background-color: #ff8f4a39;
    color: white;
}

.text {
    background-color: #333333;
    color: white;
}

.success {
    background-color: #5CB85C;
    color: white;
}

.error {
    background-color: #D9534F;
    color: white;
}`}
          </code>
        </pre>
      </div>

      {/* Buttons */}
      <div className="column">
        <div className="color-box">
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
          <pre>
          <code>
            {`.signup {
    background-color: var(--color-brand);
    color: var(--color-white);
    transition: .3s;
}

.cancel {
    background-color: var(--color-white);
    color: var(--color-brand);
    border: 2px solid var(--color-brand);
    font-weight: bold;
    transition: .3s;
}

.yes {
    background-color: #000000;
    border-radius: 8px;
    border-style: solid;
    height: 40px;
    font-size: 15px;
    width: 80px;
    transition: .3s;
    color: white;
}

.no {
    background-color: #d46a4c;
    border-radius: 8px;
    border-style: solid;
    height: 40px;
    font-size: 15px;
    width: 80px;
    transition: .3s;
    color: white;
    border-color: #d46a4c;
}

.editprofile {
    border: 1px solid white;
    width: 188px;
    height: 40px;
    border-radius: 5px;
    padding: 5px;
    font-size: 19px;
    background-color: #000000;
    color: white;
    transition: .3s;
}

.read-more {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #ff8c42;
    color: white;
    text-decoration: none;
    border-radius: 20px;
    width: 40%;
    transition: background 0.3s;
    transition: .3s;
    font-size: 17px;
}

.join_and_postown {
    background-color: #ff8c42;
    color: white;
    font-weight: bold;
    border: none;
    transform: scale(1.03);
    transition: .3s;
    border-radius: 15px;
}

.cuisine-card {
    background: #ff8f4a39;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 180px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .3s;
    line-height: .2;
}

.step {
    background: #e4684a;
    color: white;
    border: none;
    padding: 14px;
    cursor: pointer;
    margin-top: 15px;
    border-radius: 8px;
    font-size: 18px;
    width: 300px;
    transition: .3s;
}`}
          </code>
        </pre>
      </div>

      {/* Popups / Modals */}
      <div className="column">
        <div className = "snip-box">
        <h2>5. Popups / Modals</h2>
        <p>This modal centers itself and dims the background.</p>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Show Modal
        </button>
        </div>

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

<pre>
          <code>
            {`{isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
        <button className="close-btn" 
          onClick={() =>
           setIsModalOpen(false)}>
          &times;
        </button>
       <p>This is a modal example!</p>
    </div>
  </div>
        )}`}
          </code>
        </pre>
      </div>

      {/* Feedback Messages */}
      <div className="column">
        <div className = "snip-box">
          <h2>6. Feedback Messages</h2>
          <div className="alert success">Success Message: Action completed!</div>
          <div className="alert error">Error Message: Something went wrong!</div>
        </div>
        <pre>
          <code>
            {`.alert {
    padding: 1rem;
    border-radius: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    border: 1px solid black;
}`}
          </code>
        </pre>
      </div>

      {/* Inline Help */}
      <div className="column">
        <div className = 'snip-box'>
        <h2>7. Inline Help</h2>
        <p> Buttons change appearance when hovered, ex. different colors or sizes</p>
        </div>
        <pre>
          <code>
            {`.column img:hover {
    transform: scale(1.03);
  }
  
  `}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default StyleGuide;
