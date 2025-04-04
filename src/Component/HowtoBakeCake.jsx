
import React from "react";
import { Link } from "react-router-dom";
import "../HowtoBakeCake.css";  // Import CSS
import cakePoster from "../assets/bake-cake-recipe.png";  // Image file

const BakingCake = () => {
    return (
      <div className="cake-container">
        <div className="back-link">
          <Link to="/how-to-guides">← Back to How-To Guides</Link>
        </div>
        <h1 className="title">Baking a Perfect Cake</h1>
  
        <div className="poster-container">
          <img src={cakePoster} alt="Baking Cake Poster" className="poster" />
        </div>
  
        <div className="info-section">
          <h2>Why Bake a Cake?</h2>
          <p>Nothing beats the aroma of a freshly baked cake wafting through your kitchen. 🍰</p>
          <p>Follow these steps to create a light, fluffy, and delicious cake that’s sure to impress!</p>
          <p>Once you successfully made the cake, you may decorate it, fill it with whatever you want!</p>
  
          <h2>Ingredients</h2>
          <ul>
            <li>2 cups all-purpose flour</li>
            <li>1 1/2 cups granulated sugar</li>
            <li>1/2 cup unsalted butter, softened</li>
            <li>1 cup milk</li>
            <li>3 large eggs</li>
            <li>2 tsp baking powder</li>
            <li>1 tsp vanilla extract</li>
            <li>1/4 tsp salt</li>
            <li>2 cups powdered sugar</li>
            <li>1/2 cup heavy cream</li>
          </ul>

          <h2>Steps to Bake a Cake</h2>
          <ul>
            <li>🍚 <strong>Sift Dry Ingredients</strong> – Sift together flour, baking powder, and salt into a large bowl.</li>
            <li>🥣 <strong>Mix Wet Ingredients</strong> – In another bowl, whisk together softened butter, sugar, eggs, milk, and vanilla extract.</li>
            <li>🥄 <strong>Combine and Mix</strong> – Gradually add the dry ingredients to the wet ingredients, mixing until smooth and lump-free.</li>
            <li>🪣 <strong>Divide and Pour</strong> – Pour the batter evenly between two greased and floured cake pans.</li>
            <li>🔥 <strong>Bake</strong> – Preheat oven to 350°F (175°C) and bake for 30-35 minutes, or until a toothpick inserted comes out clean.</li>
            <li>🍰 <strong>Make the Frosting</strong> – Combine powdered sugar, heavy cream, and a splash of vanilla extract. Whisk until smooth and fluffy.</li>
            <li>🎂 <strong>Assemble and Decorate</strong> – Once the cakes have cooled, layer and frost them. Decorate with sprinkles or fruit as desired.</li>
          </ul>
  
          <h2>Cake Baking Tips</h2>
          <ul>
            <li>🧈 Bring ingredients to room temperature for smoother mixing.</li>
            <li>🥄 Do not overmix the batter to keep the cake fluffy.</li>
            <li>⏰ Let the cake cool completely before frosting to avoid melting.</li>
          </ul>
  
          <p>Enjoy a slice of homemade cake that's fluffy, moist, and delicious! 🎂</p>
        </div>
      </div>
    );
  };
  
  export default BakingCake;
