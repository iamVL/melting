import React from "react";
import { Link } from "react-router-dom";
import "../HowtoCookEggs.css";  // Import CSS
import eggPoster from "../assets/eggs-recipe.png";  // Image file

const CookEggs = () => {
    return (
      <div className="egg-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">Cooking Eggs in Different Ways</h1>

        <div className="poster-container">
          <img src={eggPoster} alt="Cooking Eggs Poster" className="poster" />
        </div>

        <div className="info-section">
          <h2>Mastering Egg Cooking Techniques</h2>
          <p>Eggs are a staple in every kitchen, offering endless possibilities for delicious meals. Whether you prefer them scrambled, poached, or fried, learning to cook eggs in various ways will make breakfast a breeze! 🥚</p>
          <p>Follow these techniques to master cooking eggs in different ways.</p>

          <h2>Ways to Cook Eggs</h2>
          <ul>
            <li>🍳 <strong>Scrambled Eggs</strong> – Whisk eggs with a little milk, salt, and pepper. Cook on medium-low heat, gently stirring until fluffy and just set.</li>
            <li>☀️ <strong>Sunny Side Up</strong> – Heat a pan with a little oil or butter. Crack an egg and cook until whites are set but yolk remains runny.</li>
            <li>🔁 <strong>Over Easy</strong> – Flip a sunny-side-up egg and cook briefly on the other side for a slightly set yolk.</li>
            <li>🔁 <strong>Over Medium</strong> – Flip the egg and cook for a little longer than over easy, until the yolk is partially set but still soft in the center.</li>
            <li>🔁 <strong>Over Hard</strong> – Cook until both the whites and yolk are fully set, resulting in a firm egg.</li>
            <li>🌊 <strong>Poached Eggs</strong> – Bring water with a splash of vinegar to a simmer. Crack an egg into a cup, then gently slide it into the water. Cook for 3-4 minutes until whites are set.</li>
            <li>🥚 <strong>Soft-Boiled Eggs</strong> – Boil for 4-6 minutes, then plunge into ice water to keep yolks soft and runny.</li>
            <li>🥚 <strong>Hard-Boiled Eggs</strong> – Boil for 9-12 minutes, then place in ice water for easy peeling and firm yolks.</li>
            <li>🔥 <strong>Fried Eggs</strong> – Crack eggs directly into a hot, oiled pan. Cook until the whites are crispy and the yolk is cooked to your preference.</li>
            <li>🍳 <strong>Omelet</strong> – Whisk eggs and seasonings, then pour into a hot, buttered pan. Add fillings like cheese, veggies, or meats, and fold over when the edges are set.</li>
          </ul>

          <h2>Tips for Perfect Eggs</h2>
          <ul>
            <li>🧈 Use butter or oil to prevent sticking and add flavor.</li>
            <li>🔥 Medium-low heat is ideal for scrambled and fried eggs to avoid overcooking.</li>
            <li>💧 Add a splash of vinegar when poaching to help whites set.</li>
            <li>⏱️ Cool boiled eggs in ice water to stop cooking and make peeling easier.</li>
          </ul>

          <p>Experiment with these techniques to find your favorite egg style and impress at your next brunch! 🍳</p>
        </div>
      </div>
    );
};

export default CookEggs;
