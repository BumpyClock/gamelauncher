// src/pages/Home.tsx

import React from 'react';
import Spotlight from '../components/Spotlight/Spotlight.tsx';
import './Page.css';

const spotlightItems: string[] = [
  "Age of mythology retold standard",
  "Starfield",
  "Call of Duty black ops",
  "donut county",
  "Age of Empires IV",
  "Age of mythology retold standard edition",
  "Diablo Iv",
  "PalWorld",
  "Need for speed",
  "Star Wars Jedi fallen order ea",
  "Fallout 4"
];

const Home: React.FC = () => {
  return (
    <div className="page">
      <Spotlight items={spotlightItems} />
    </div>
  );
};

export default Home;