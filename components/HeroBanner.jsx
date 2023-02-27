import React from 'react';

import { urlFor } from '../lib/client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <div>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText}</h1>
        <img src={urlFor(heroBanner.image)} alt="headphones" className="hero-banner-image" />
        </div>
      </div>
  )
}

export default HeroBanner