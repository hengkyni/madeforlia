import React, { useState, useRef } from 'react';
import BattleScene from './components/BattleScene';
import TransitionScene from './components/TransitionScene';
import Scene2 from './components/Scene2';
import TheEnd from './components/TheEnd';
import Preloader from './components/Preloader';

function App() {
  const [currentScene, setCurrentScene] = useState('preloader');
  const [isMuted, setIsMuted] = useState(false);
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
          muted={isMuted}
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
        <Scene2 isMuted={isMuted} />
      )}

      {/* Tombol Mute / Unmute (Tidak tampil di layar preloader) */}
      {currentScene !== 'preloader' && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Mencegah global click aktif saat pencet mute
            setIsMuted(!isMuted);
          }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '2px solid rgba(255, 182, 193, 0.4)',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffb6c1',
            cursor: 'pointer',
            zIndex: 100000,
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 182, 193, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 182, 193, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
        >
          {isMuted ? (
            // Icon Muted (Volume X)
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            // Icon Unmuted (Volume Up)
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default App;
