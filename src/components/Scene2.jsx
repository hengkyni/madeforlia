import React, { useState } from 'react';
import DialogBox from './DialogBox';

export default function Scene2() {
  const [step, setStep] = useState(0);

  // Dialog dan gambar urut untuk Scene 2
  const scenario = [
    { image: '/2.PNG', name: 'Cowo', text: 'Arghhhh...,pegel juga.' },
    { image: '/3.PNG', name: 'Cowo', text: 'Scroll ig bentar kali ye...' },
    { image: '/4.PNG', name: 'Cowo', text: 'Anjir siapa ini cantik amat.' },
    { image: '/5.PNG', name: 'Cowo', text: 'Coba aja aku punya putri secantik itu,hehehehe...' },
  ];

  const handleClick = () => {
    if (step < scenario.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 960,
        height: '72vh',
        margin: '4vh auto 0', // Diturunkan sedikit
        overflow: 'hidden',
        background: '#000'
      }}>
      {/* Background Video */}
      <video
        src="/dunia2.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '112%', // Dibuat lebih tinggi agar bagian bawah (tulisan veo) terpotong/overflow
          objectFit: 'cover',
          zIndex: 0
        }}
      />

      {/* Gambar Karakter Scene 2 */}
      <img
        src={scenario[step].image}
        alt={`Scene 2 Character Frame ${step}`}
        style={{
          position: 'absolute',
          top: step === 3 ? '60%' : '50%',       // gambar 5 lebih ke bawah
          left: step >= 2 ? '55%' : '35%',      // gambar 4 & 5 lebih ke kanan
          transform: 'translate(-50%, -50%)',
          height: step === 3 ? '52%' : step === 2 ? '42%' : '70%', // gambar 5 lebih besar dari 4
          zIndex: 1,
          objectFit: 'contain'
        }}
      />

      {/* Tampilan HP (ig.png) untuk Gambar 4 */}
      {step === 2 && (
        <img
          src="/ig.png"
          alt="Instagram UI"
          style={{
            position: 'absolute',
            top: '50%',
            left: '75%', // Di sebelah kanan karakter (sedikit lebih ke kanan)
            transform: 'translate(-50%, -50%)',
            height: '60%', // Sesuaikan tinggi dengan frame
            zIndex: 2,
            objectFit: 'contain'
          }}
        />
      )}

      {/* Kotak Dialog Overlay (Diposisikan di Bawah) */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        zIndex: 10,
      }}>
        <DialogBox
          name={scenario[step].name}
          text={scenario[step].text}
        />
      </div>
    </div>
  );
}
