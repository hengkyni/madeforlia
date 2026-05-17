import React, { useState } from 'react';
import BattleScene from './components/BattleScene';
import TransitionScene from './components/TransitionScene';
import Scene2 from './components/Scene2';
import TheEnd from './components/TheEnd';

function App() {
  const [currentScene, setCurrentScene] = useState('battle');

  return (
    <div className="app-container">
      {/* Portrait Overlay */}
      <div className="portrait-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <h2>Miringin Dulu HP-nya!</h2>
        <p>Tampilan ini cuma bisa dilihat dalam mode lanskap (tidur) biar lebih maksimal dan cantik 😊</p>
      </div>

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
