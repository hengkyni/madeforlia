import React, { useState, useEffect, useRef } from 'react';

export default function DialogBox({ name, text, onNext }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        setIsTyping(false);
        clearInterval(intervalRef.current);
      }
    }, 40); // Kecepatan ngetik

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const handleSkipTyping = (e) => {
    e.stopPropagation(); // Cegah layar utama mendeteksi klik ini
    if (intervalRef.current) clearInterval(intervalRef.current); // Matikan ngetiknya!
    setDisplayedText(text);
    setIsTyping(false);
  };

  return (
    <>
      {/* Layar penangkap klik (invisible) aktif saat sedang ngetik */}
      {isTyping && (
        <div 
          onClick={handleSkipTyping}
          style={{ position: 'fixed', inset: 0, zIndex: 99999 }} 
        />
      )}
      <div className="dialog-container" onClick={onNext}>
        <div className="dialog-box">
          {name && <div className="dialog-name">{name}</div>}
          <div className="dialog-text">
            {displayedText}
            {!isTyping && <span className="blinking-cursor">▼</span>}
          </div>
        </div>
      </div>
    </>
  );
}
