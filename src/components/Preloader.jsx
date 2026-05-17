import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Kumpulan semua URL aset yang digunakan di aplikasi
    // Menggunakan Set di awal konseptual, tapi kita tulis array mentah dulu lalu filter
    const rawAssets = [
      // Latar dan UI
      '/dunia1.png', 
      '/ig.png',
      // Spritesheets Game
      '/cowo.png', '/putri.png', '/monster.png',
      // Cerita & Karakter
      '/1.PNG', '/2.PNG', '/3.PNG', '/4.PNG', '/5.PNG', '/6.PNG', '/7.PNG',
      '/senyum.png', '/sedih.png', '/garpal.png', '/bingung.png', '/wah.png', '/yey.png', '/senyum1.png',
      // Koleksi Foto
      '/c.jpeg', '/c2.jpeg', '/c3.jpeg', '/c4.jpeg', '/c5.jpeg', '/c6.jpeg', '/c7.jpeg', '/c8.jpeg', '/c9.jpeg'
    ];

    // Mencegah duplikasi: Hanya ambil URL yang unik
    const uniqueAssets = [...new Set(rawAssets)];
    let loadedCount = 0;

    // Fungsi untuk memperbarui progres
    const updateProgress = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / uniqueAssets.length) * 100);
      setProgress(percent);
      if (loadedCount === uniqueAssets.length) {
        // Beri jeda sedikit agar user bisa melihat 100%
        setTimeout(() => setIsReady(true), 500);
      }
    };

    // Mulai meload semua gambar ke cache
    uniqueAssets.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = updateProgress;
      img.onerror = updateProgress; // Tetap hitung error agar tidak stuck loading selamanya
    });

  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      color: '#fff',
      fontFamily: '"VT323", monospace'
    }}>
      <div style={{
        textAlign: 'center',
        width: '80%',
        maxWidth: '400px'
      }}>
        {!isReady ? (
          <>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', letterSpacing: '2px' }}>
              Memuat Kenangan... {progress}%
            </h2>
            {/* Progress Bar Container */}
            <div style={{
              width: '100%',
              height: '10px',
              background: '#333',
              borderRadius: '5px',
              overflow: 'hidden',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
            }}>
              {/* Progress Bar Fill */}
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ffb6c1, #ff69b4)',
                transition: 'width 0.2s ease-out'
              }} />
            </div>
          </>
        ) : (
          <button
            onClick={onComplete}
            style={{
              padding: '15px 40px',
              fontSize: '28px',
              fontFamily: '"VT323", monospace',
              background: 'transparent',
              color: '#ffb6c1',
              border: '2px solid #ffb6c1',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 0 15px rgba(255, 182, 193, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ffb6c1';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 182, 193, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ffb6c1';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 182, 193, 0.4)';
            }}
          >
            Mulai Petualangan
          </button>
        )}
      </div>
    </div>
  );
}
