import React, { useState } from 'react';
import BattleScene from './components/BattleScene';
import TransitionScene from './components/TransitionScene';
import Scene2 from './components/Scene2';
import TheEnd from './components/TheEnd';

function App() {
  const [currentScene, setCurrentScene] = useState('battle');

  return (
    <div className="app-container">
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
