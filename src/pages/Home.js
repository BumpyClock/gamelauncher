// src/pages/Home.js

import React from 'react';
import Spotlight from '../components/Spotlight/Spotlight';
import './Page.css';

const spotlightItems = ["Age of mythology retold standard","Starfield","Call of Duty black ops","donut county","Age of Empires IV", "Age of mythology retold standard edition", "Diablo Iv", "PalWorld","Need for speed","Star Wars Jedi fallen order ea ", "Fallout 4" ];

const Home = () => {
  return (
    <div className="page">
       
      <Spotlight items={spotlightItems} />
      
    </div>
  );
};

export default Home;
