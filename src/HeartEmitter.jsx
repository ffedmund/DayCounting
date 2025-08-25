import React, { useEffect } from 'react';
import './style.css'; // Import the CSS file
import heartIcon from './assets/heart-svgrepo-com-2.svg';

// Helper function to get a random number
const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const HeartEmitter = () => {
  useEffect(() => {
    const heartContainer = document.querySelector('.heart-container');
    if (!heartContainer) return;

    // Function to create a heart
    const createHeart = () => {
      const heart = document.createElement('img');
      heart.classList.add('heart');
      heart.src = heartIcon;

      // Set random horizontal position
      const randomLeft = getRandomNumber(0, window.innerWidth);
      heart.style.left = `${randomLeft}px`;
      heart.style.width = '30px';
      heart.style.height = '30px';
      const randomHue = getRandomNumber(0, 360);
      
      // Apply the filter with the random hue rotation
      heart.style.filter = `invert(36%) sepia(85%) saturate(1633%) hue-rotate(${randomHue}deg) brightness(101%) contrast(100%)`;


      // Set a random animation duration for variation
      const randomDuration = getRandomNumber(2.5, 5);
      heart.style.animationDuration = `${randomDuration}s`;
      
      heartContainer.appendChild(heart);

      // Clean up the heart element after its animation is done
      heart.addEventListener('animationend', () => {
        heart.remove();
      });
    };

    // Start the interval for creating hearts
    const intervalId = setInterval(createHeart, 1200);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="heart-container">
      {/* Hearts will be appended here dynamically */}
    </div>
  );
};

export default HeartEmitter;