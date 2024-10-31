// src/components/Spotlight/Spotlight.tsx

import React, { useState, useEffect } from 'react';
import Gamepad from 'react-gamepad';
import './Spotlight.css';
import { getProductData } from '../../hooks/StoreData.tsx';

interface SpotlightProps {
  items: string[];
}

interface ProductDetails {
  title: string;
  SuperHeroArt: {
    Url: string;
  };
  publisherName: string;
}

const Spotlight: React.FC<SpotlightProps> = ({ items }) => {
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = await Promise.all(items.map(async (item) => {
        const data = await getProductData(item);
        return { 
          ...data, 
          title: item, 
          SuperHeroArt: data.SuperHeroArt || { Url: '' } 
        };
      }));
      setProductDetails(details);
    };

    fetchProductDetails();
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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

  const handleButtonChange = (buttonName: string, down: boolean) => {
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
          break;
        default:
          break;
      }
    }
  };

  const cardWidth = 200;
  const expandedCardWidth = 500;
  const spacing = 10;
  const totalWidth = (items.length - 1) * (cardWidth + spacing) + expandedCardWidth;

  let translateX = 0;
  for (let i = 0; i < selectedCard; i++) {
    translateX += cardWidth + spacing - 50;
  }

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