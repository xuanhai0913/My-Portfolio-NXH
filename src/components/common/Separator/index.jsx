import React from 'react';
import Squares from '../Squares';
import './styles/Separator.css';

const Separator = () => {
  return (
    <div className="separator">
      <Squares 
        speed={0.4} 
        squareSize={35}
        direction='diagonal'
        borderColor='rgba(255, 255, 255, 0.08)'
        hoverFillColor='rgba(74, 144, 226, 0.2)'
      />
      <div className="separator-content">
        <div className="separator-line"></div>
        <div className="separator-icon">
          <i className="fas fa-code"></i>
        </div>
        <div className="separator-line"></div>
      </div>
    </div>
  );
};

export default Separator;