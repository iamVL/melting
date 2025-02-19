import React from "react";
import "./AboutTeam.css";
import Yessica from "../Team pictures/Yessica.jpg";

const AboutUs = () => {
    return (
        <div className="about-page">

            <header className="header-section">
                <h1>About Yessica</h1>
            </header>
            <img
                src={Yessica} class="profilepic" alt="Justin" height={300} width={300}>
            </img>
            <div class="Justin">
                My name is Yessica Quinonez! I am 22 years old (with asthma :( ) and a Junior graduating next semester. I have two pitbulls I adore. They are sweethearts!
                I have no idea about what I want to do with my life yet but it'll either be in cybersecurity or front end dev!
                I love snowboarding even tho I'm super mid at it. I also love the gym and matcha (equally? maybe idk!)
            </div>
            <h2>Contact Us</h2>
            <p>
                We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
            </p>
        </div>
    );
};

export default AboutUs;
