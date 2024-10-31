// src/components/Spotlight.js

import React, { useState, useEffect } from 'react';
import Gamepad from 'react-gamepad';
import './Spotlight.css';
import { getProductData } from '../../hooks/StoreData';

const Spotlight = ({ items }) => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = await Promise.all(items.map(async (item) => {
        const data = await getProductData(item); // Pass the string directly
        return { title: item, ...data }; // Include the title in the returned object
      }));
      setProductDetails(details);
    };

    fetchProductDetails();
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setSelectedCard((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (event.key === 'ArrowRight') {
        setSelectedCard((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items]);

  const handleButtonChange = (buttonName, down) => {
    if (down) {
      switch (buttonName) {
        case 'DPadLeft':
        case 'Left':
          setSelectedCard((prev) => (prev > 0 ? prev - 1 : items.length - 1));
          break;
        case 'DPadRight':
        case 'Right':
          setSelectedCard((prev) => (prev < items.length - 1 ? prev + 1 : 0));
          break;
        case 'A':
          console.log(`Selected: ${items[selectedCard]}`);
          // Perform any action you want when 'A' is pressed
          break;
        default:
          break;
      }
    }
  };

  // Calculate the translateX value to shift the selected card to the left edge
  const cardWidth = 200; // Width of non-selected card
  const expandedCardWidth = 500; // Width of selected card
  const spacing = 10; // Space between cards

  // Calculate the total width of all items
  const totalWidth = (items.length - 1) * (cardWidth + spacing) + expandedCardWidth;

  // Calculate the amount to translate based on selected card
  let translateX = 0;
  for (let i = 0; i < selectedCard; i++) {
    translateX += cardWidth + spacing - 50;
  }

  // Ensure translateX does not exceed the maximum allowable value
  const maxTranslateX = totalWidth - window.innerWidth + 40;
  translateX = Math.min(translateX, maxTranslateX);

  return (
    <Gamepad
      onButtonChange={handleButtonChange}
      onConnect={(gamepadIndex) =>
        console.log(`Gamepad ${gamepadIndex} connected`)
      }
      onDisconnect={(gamepadIndex) =>
        console.log(`Gamepad ${gamepadIndex} disconnected`)
      }
    >
      <div className="spotlight-wrapper">
        <div
          className="spotlight-container"
          style={{ transform: `translateX(-${translateX}px)` }}
        >
          {productDetails.map((item, index) => (
            <div
              key={index}
              className={`spotlight-card ${
                selectedCard === index ? 'selected' : ''
              }`}
              onClick={() => setSelectedCard(index)}
            >
              <div
                className="spotlight-image"
                style={{ backgroundImage: `url(${item.SuperHeroArt.Url})` }}
              />
              <div
                className="spotlight-card-shadow"
                style={{ backgroundImage: `url(${item.SuperHeroArt.Url})` }}
              />
              <div className="spotlight-content">
                <h4>{item.title}</h4>
                <p>{item.publisherName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Gamepad>
  );
};

export default Spotlight;