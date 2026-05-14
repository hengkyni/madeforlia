import React, { useState } from 'react';
import DialogBox from './DialogBox';

export default function TransitionScene({ onComplete }) {
  const [step, setStep] = useState(0);

  const scenario = [
    { image: '/1.PNG', name: 'Cewe', text: 'Selesai juga ni game...' },
    { image: '/6.PNG', name: 'Cowo', text: 'Lumayan juga ya,coba aja gw punya putri secantik itu,hehehehe...' },
    { image: '/7.PNG', name: '', text: 'Dah dah ngayal mulu,istirahat dulu lah...' },
  ];

  const handleClick = () => {
    if (step < scenario.length - 1) {
      setStep(step + 1);
    } else {
      onComplete?.();
    }
  };

  const currentFrame = scenario[step];

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 960,
        height: '72vh',
        margin: '4vh auto 0',
        overflow: 'hidden',
        background: '#000',
        cursor: 'pointer'
      }}
    >
      {/* Efek Background: Game yang di-blur & digelapkan */}
      <div style={{
        position: 'absolute',
        top: '-5%', left: '-5%', width: '110%', height: '110%', // Melebihi layar sedikit biar blur-nya gak bocor di pinggir
        backgroundImage: "url('/dunia1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        filter: 'blur(10px) brightness(0.3)',
        zIndex: 0
      }} />

      {/* Gambar Cerita (diperkecil & di-tengah tanpa frame) */}
      <div style={{
        position: 'absolute',
        top: '45%', // Agak ke atas dikit untuk ngasih ruang ke dialog box
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '70%', // Diperkecil
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <img
          src={currentFrame.image}
          alt={`Story frame ${step}`}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Kotak Teks Cerita (Diposisikan di Bawah) */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        zIndex: 10,
      }}>
        <DialogBox
          name={currentFrame.name}
          text={currentFrame.text}
        />
      </div>
    </div>
  );
}
