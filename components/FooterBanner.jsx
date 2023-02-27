import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const FooterBanner = ({ footerBanner: { newPrice, buttonDesc, oldPrice, smallText, image, slug} }) => {
 
  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <h1>{oldPrice}</h1>
          <h3>{newPrice}</h3>
          <p>{smallText}</p>
        </div>
        <div className="right">
          <h3>{buttonDesc}</h3>
          <Link href={`/product/${slug.current}`}>
            <button type="button">Compre já</button>
          </Link>
        </div>

        <img 
          src={urlFor(image)} className="footer-banner-image"
        />
      </div>
    </div>
  )
}

export default FooterBanner