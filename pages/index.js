import React from 'react';
import { useState, useEffect } from 'react';
 

import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner,AgeVerificationModal} from '../components';
import { useStateContext } from '../context/StateContext';

const Home = ({ products, bannerData, products2, promoData, couponsData, seasonalPromoData}) => {
  
  const { coupons } = useStateContext();
  const [seasonalPromo, setseasonalPromo] = useState(false);

  

  useEffect(()=>{
		setseasonalPromo(seasonalPromoData[0].isValid);
	}, [])

  const [index, setIndex] = useState(0);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => {
        if (index === seasonalPromoData[0].promoText.textArray.length - 1) {
          return 0;
        } else {
          return index + 1;
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  


  couponsData.length && couponsData.map((coupon) => {
    if (!coupons.find((c) => c.couponName === coupon.couponName)) {
      coupons.push(coupon);
    }
  });


  
  return(
  <div>
    <AgeVerificationModal/>
    <HeroBanner heroBanner={bannerData.length && bannerData[0]}  />
    <div className="seasonalPromo-container">
    {
      seasonalPromo && (<div className='seasonalPromo' style={{ backgroundColor: seasonalPromoData[0]?.promoText?.colorArray[index] }}> <h1> {seasonalPromoData[0]?.promoText?.textArray[index]} </h1> </div>)
    }
    </div>
    <div className="products-heading">
      <h2>{products[0].productName}</h2>
      <p>{products[0].description}</p>
    </div>
    <div className="products-container">
      {products?.map((product) => <Product key={product._id} product={product} />)}
    </div>
    <div className="products-heading">
    <h2>{products2[0].productName}</h2>
    <p>{products2[0].description}</p>
    </div>
    <div className="products-container">
      {products2?.map((product) => <Product key={product._id} product={product} />)}
    </div>
    <FooterBanner footerBanner={promoData.length && promoData[0]} />
  </div>
)};


export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  const product2Query = '*[_type == "product2"]'; 
  const products2 = await client.fetch(product2Query);

  const promoQuery = '*[_type == "promo"]';
  const promoData = await client.fetch(promoQuery);

  const couponQuery = '*[_type == "coupon"]';
  const couponsData = await client.fetch(couponQuery);

  const seasonalPromoQuery = '*[_type == "seasonalPromo"]';
  const seasonalPromoData = await client.fetch(seasonalPromoQuery);

  return {
    props: { products, bannerData, products2, promoData, couponsData, seasonalPromoData }
  }
}

export default Home;