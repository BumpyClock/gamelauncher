// src/pages/Home.js

import React from 'react';
import Spotlight from '../components/Spotlight/Spotlight';
import './Page.css';

const items = [
  {
    title: 'Starfield',
    description: 'Winter has so much to offer - creative activities',
    image: 'https://store-images.s-microsoft.com/image/apps.52870.13567343664224659.1eb6fdf9-8a0b-4344-a135-ab17dfa3c609.20ed1644-2c01-4d5a-b636-3d54ac941a1f?h=862&format=jpg',
  },
  {
    title: 'Call of Duty Black Ops',
    description: 'Gets better every day - stay tuned',
    image: 'https://store-images.s-microsoft.com/image/apps.5449.14573054545255034.cd2592c8-303a-4286-a199-887860c0cad0.ff3b9f19-d9b5-4e14-8184-f0db8f707c46?q=90&w=480&h=270',
  },
  {
    title: 'Forza Horizon 5',
    description: 'Help people all over the world',
    image: 'https://store-images.s-microsoft.com/image/apps.33953.13718773309227929.bebdcc0e-1ed5-4778-8732-f4ef65a2f445.9428b75f-2c08-4e70-9f95-281741b15341?q=90&w=480&h=270',
  },
  {
    title: 'Indiana Jones',
    description: 'Space engineering becomes more and more advanced',
    image: 'https://store-images.s-microsoft.com/image/apps.22318.13602448054825321.db894b4e-0737-4cd8-9f36-3c330fc5f747.aab2eb71-b807-48bd-b42d-df028f5865bf?q=90&w=480&h=270',
  }, {
    title: 'Indiana Jones',
    description: 'Space engineering becomes more and more advanced',
    image: 'https://store-images.s-microsoft.com/image/apps.22318.13602448054825321.db894b4e-0737-4cd8-9f36-3c330fc5f747.aab2eb71-b807-48bd-b42d-df028f5865bf?q=90&w=480&h=270',
  }, {
    title: 'Indiana Jones',
    description: 'Space engineering becomes more and more advanced',
    image: 'https://store-images.s-microsoft.com/image/apps.22318.13602448054825321.db894b4e-0737-4cd8-9f36-3c330fc5f747.aab2eb71-b807-48bd-b42d-df028f5865bf?q=90&w=480&h=270',
  },
];

const Home = () => {
  return (
    <div className="page">
       
      <Spotlight items={items} />
      
    </div>
  );
};

export default Home;
