import React, { useState, useEffect } from 'react';

export default function DialogBox({ name, text, onNext }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 40); // Kecepatan ngetik

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="dialog-container" onClick={onNext}>
      <div className="dialog-box">
        {name && <div className="dialog-name">{name}</div>}
        <div className="dialog-text">
          {displayedText}
          <span className="blinking-cursor">▼</span>
        </div>
      </div>
    </div>
  );
}
