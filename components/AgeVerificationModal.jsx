import React, { useState, useEffect } from 'react';
import Image from 'next/image'


function AgeVerificationModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleOlderThan18Click = () => {
    setIsModalOpen(false);
  }

  const handleYoungerThan18Click = () => {
    setIsModalOpen(false);
    window.location.href = 'https://www.google.com';
  }

  return (
    <div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          <Image className='modal-image' src="/logo.png" alt="logo" width="64" height="64" />
            <p>Tens mais de 18 anos?</p>
            <div className='modal-btn-wrapper'>
            <button className='modal-btn' onClick={handleOlderThan18Click}>Sim</button>
            <button className='modal-btn' onClick={handleYoungerThan18Click}>Não</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgeVerificationModal;
