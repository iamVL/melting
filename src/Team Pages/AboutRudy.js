import React from "react";
import "./AboutTeam.css";
import Rudy from "../Team pictures/Rudy.jpg";

const AboutUs = () => {
    return (
        <div className="about-page">

            <header className="header-section">
                <h1>About Rudy</h1>
            </header>
            <img
                src={Rudy} class="profilepic" alt="Justin" height={300} width={300}>
            </img>
            <div class="Justin">
                My name is Rudy Karthick! I am autistic and a fan of superhero movies. I love food tourism and American Geography too.
                My dream place to live is Raleigh, NC. I also want to eat chimichangas in Tuscon, AZ. 
                I am excited for the upcoming James Gunn's Superman movie releasing in July.
            </div>
            <h2>Contact Us</h2>
            <p>
                We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
            </p>
        </div>
    );
};

export default AboutUs;