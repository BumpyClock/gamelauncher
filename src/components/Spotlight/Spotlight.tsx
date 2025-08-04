// src/components/Spotlight/Spotlight.tsx

import React, { useState, useEffect, useContext, useCallback } from "react";
import "./Spotlight.css";
import { getBatchProductData } from "../../hooks/StoreData.tsx";
import { GamepadContext } from "../../contexts/GamepadContext";
import type { SpotlightProps, ProductDetails } from "../../types";

const Spotlight: React.FC<SpotlightProps> = ({
  items,
  isFocused,
  onLoseFocus,
}) => {
  const { onButtonDown } = useContext(GamepadContext);
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);

  // Fetch product details using batch processing
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const batchResults = await getBatchProductData(items);
        const details = batchResults.map((data) => ({
          title: data.title,
          SuperHeroArt: data.SuperHeroArt,
          publisherName: data.publisherName,
          heroImageUrl: data.heroImageUrl,
          averageRating: data.averageRating,
          displayPrice: data.displayPrice,
        }));
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Set empty details on error
        setProductDetails(
          items.map(() => ({
            title: "Loading...",
            SuperHeroArt: null,
            publisherName: "",
          })),
        );
      }
    };

    fetchProductDetails();
  }, [items]);

  // Memoize handleButtonDown using useCallback
  const handleButtonDown = useCallback(
    (buttonIndex: number, gamepadIndex: number) => {
      console.log(
        `Spotlight: Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`,
      );
      if (!isFocused) return false;

      switch (buttonIndex) {
        case 14: // D-Pad Left
          console.log("Spotlight: D-Pad Left");
          setSelectedCard((prev) => (prev > 0 ? prev - 1 : items.length - 1));
          return true;
        case 15: // D-Pad Right
          console.log("Spotlight: D-Pad Right");
          setSelectedCard((prev) => (prev < items.length - 1 ? prev + 1 : 0));
          return true;
        case 0: // 'A' button
          console.log(`Spotlight: Selected ${items[selectedCard]}`);
          return true;
        case 13: // D-Pad Down to lose focus
          console.log("Spotlight: D-Pad Down, losing focus");
          onLoseFocus();
          return true;
        default:
          console.log(`Spotlight: Unhandled button ${buttonIndex}`);
          return false;
      }
    },
    [isFocused, items, selectedCard, onLoseFocus],
  );

  useEffect(() => {
    const priority = isFocused ? 2 : 0; // Higher priority when focused
    const unsubscribe = onButtonDown(handleButtonDown, priority);
    return () => {
      unsubscribe();
    };
  }, [onButtonDown, handleButtonDown, isFocused]);

  // Calculate positions and translations
  const cardWidth = 200;
  const expandedCardWidth = 500;
  const spacing = 10;
  const totalWidth =
    (items.length - 1) * (cardWidth + spacing) + expandedCardWidth;

  let translateX = 0;
  for (let i = 0; i < selectedCard; i++) {
    translateX += cardWidth + spacing - 50;
  }

  const maxTranslateX = totalWidth - window.innerWidth + 40;
  translateX = Math.min(translateX, maxTranslateX);

  return (
    <div className="spotlight-wrapper">
      <div
        className="spotlight-container"
        style={{ transform: `translateX(-${translateX}px)` }}
      >
        {productDetails.map((item, index) => {
          // Get image URL with fallback support
          const imageUrl =
            item.heroImageUrl ||
            item.SuperHeroArt?.url ||
            item.SuperHeroArt?.Url ||
            "";

          return (
            <div
              key={index}
              className={`spotlight-card ${selectedCard === index ? "selected" : ""}`}
              onClick={() => setSelectedCard(index)}
            >
              <div
                className="spotlight-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div
                className="spotlight-card-shadow"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="spotlight-content">
                <h4>{item.title}</h4>
                <p>{item.publisherName}</p>
                {item.averageRating && (
                  <div style={{ fontSize: "14px", opacity: 0.7 }}>
                    ⭐ {item.averageRating.toFixed(1)}
                  </div>
                )}
                {item.displayPrice && (
                  <div style={{ fontSize: "14px", opacity: 0.7 }}>
                    {item.displayPrice}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Spotlight;
