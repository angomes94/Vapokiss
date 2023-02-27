import React from 'react';
import {AiOutlineInstagram,AiOutlineMail} from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="footer-container">
      <p className="icons">
      <button type='button' onClick={() => window.location.href = 'https://www.instagram.com/vapokiss.pt/'}>
        <AiOutlineInstagram style={{ fontSize: '30px', color:"#f1af09" }}/>
      </button>
      <button type='button' onClick={() => window.location.href = 'mailto:vapokiss.pt@gmail.com'}>
        <AiOutlineMail style={{ fontSize: '30px', color:"#f1af09" }}/>
        </button>
      </p>
    </div>
  )
}

export default Footer