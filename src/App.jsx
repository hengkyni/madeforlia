import React, { useState, useRef } from 'react';
import BattleScene from './components/BattleScene';
import TransitionScene from './components/TransitionScene';
import Scene2 from './components/Scene2';
import TheEnd from './components/TheEnd';
import Preloader from './components/Preloader';

function App() {
  const [currentScene, setCurrentScene] = useState('preloader');
  const audioRef = useRef(null);

  const handleGlobalClick = () => {
    // Dipanggil bebas saat user tap layar
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log('Audio blocked by browser:', e));
    }
  };

  const handleStartGame = () => {
    setCurrentScene('battle');
    // Mulai lagu persis saat tombol start ditekan untuk mem-bypass blokir autoplay browser
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio blocked by browser:', e));
    }
  };

  return (
    <div className="app-container" onClick={handleGlobalClick}>
      {/* Elemen Audio untuk Backsound Online */}
      {(currentScene === 'battle' || currentScene === 'theend') && (
        <audio
          ref={audioRef}
          autoPlay
          loop
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          id="bgMusic"
        />
      )}
      {/* Portrait Overlay */}
      <div className="portrait-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <h2>Miringin Dulu HP-nya!</h2>
        <p>Tampilan ini cuma bisa dilihat dalam mode lanskap (tidur) biar lebih maksimal dan cantik 😊</p>
      </div>

      {/* Preloader Screen */}
      {currentScene === 'preloader' && (
        <Preloader onComplete={handleStartGame} />
      )}

      {currentScene === 'battle' && (
        <BattleScene onComplete={() => setCurrentScene('theend')} />
      )}

      {currentScene === 'theend' && (
        <TheEnd onComplete={() => setCurrentScene('transition')} />
      )}

      {currentScene === 'transition' && (
        <TransitionScene onComplete={() => setCurrentScene('greeting')} />
      )}

      {currentScene === 'greeting' && (
        <Scene2 />
      )}
    </div>
  );
}

export default App;
