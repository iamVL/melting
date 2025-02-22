// AboutUs.js

import React from "react";
import "./AboutTeam.css";
import Joshua from "../Team pictures/Joshua.jpg";

const AboutUs = () => {
  return (
    <div className="about-page">

      <header className="header-section">
        <h1>About Joshua</h1>
      </header>
        <img 
            src={Joshua} class="profilepic" alt="Justin" height={300} width={300}>
        </img>
          <div class="Justin">
          Hello, my name is Joshua Castillo! I am 20 years old and a Junior. Currently majoring in Computer Science and intending to graduate in 2026 from the University at Buffalo.
          I'm from Albany, New York. Some hobbies of mine include playing guitar, going out to travel and hanging out with friends.
          </div>
        <h2>Contact Us</h2>
        <p>
          We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
        </p>
    </div>
  );
};

export default AboutUs;