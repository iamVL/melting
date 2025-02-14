import React from "react";
import "./AboutJustin.css";
import Rudy from "../Team pictures/Rudy.jpg";

const AboutUs = () => {
    return (
        <div className="about-page">
            <nav className="navbar">
                <div className="logo">Melting Pot</div>
                <ul className="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/featured">Featured</a></li>
                    <li><a href="/favorites">Favorites</a></li>
                    <li><a href="/upload">Upload Recipe</a></li>
                    <li><a href="/aboutus" className="active">About Us</a></li>
                </ul>
                <div className="search-container">
                    <input type="text" placeholder="Search..." />
                    <button>🔍</button>
                </div>
            </nav>

            <header className="header-section">
                <h1>About Rudy</h1>
            </header>
            <img
                src={Rudy} class="profilepic" alt="Justin" height={300} width={300}>
            </img>
            <div class="Justin">
                My name is Rudy Karthick! I am autistic and a fan of superhero movies. I love food tourism and American Geography too.
                My dream place to live is Raleigh, NC. I also want to eat chimichangas in Tuscon, AZ.
            </div>
            <h2>Contact Us</h2>
            <p>
                We'd love to hear from you! Share your feedback, questions, or suggestions at <a href="mailto:support@meltingpot.com">support@meltingpot.com</a>.
            </p>
        </div>
    );
};

export default AboutUs;