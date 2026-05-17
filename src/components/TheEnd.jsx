import React, { useEffect, useState } from 'react';

export default function TheEnd({ onComplete }) {
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [stars, setStars] = useState([]);

  const handleComplete = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 550); // Menunggu durasi animasi selesai
  };

  useEffect(() => {
    // Fade in setelah mount
    const t = setTimeout(() => setVisible(true), 100);

    // Generate bintang-bintang random
    const generated = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generated);

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={handleComplete}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #0d0320 0%, #000000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.8s ease',
        zIndex: 9999,
        cursor: 'pointer',
        animation: isClosing ? 'crtTurnOff 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
      }}
    >
      {/* Bintang-bintang */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'white',
            opacity: 0,
            animation: `twinkle ${s.duration}s ${s.delay}s infinite ease-in-out`,
          }}
        />
      ))}

      {/* Efek glow merah muda di tengah */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,105,180,0.18) 0%, transparent 70%)',
          animation: 'pulse 4s infinite ease-in-out',
        }}
      />

      {/* Garis dekoratif atas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', opacity: visible ? 1 : 0, transition: 'opacity 2s ease 0.6s' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #f9a8d4)' }} />
        <span style={{ color: '#f9a8d4', fontSize: '18px' }}>✦</span>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, #f9a8d4)' }} />
      </div>

      {/* Teks "The End" */}
      <h1
        style={{
          fontFamily: '"Playfair Display", "Georgia", serif',
          fontSize: 'clamp(52px, 10vw, 96px)',
          fontWeight: '700',
          color: 'transparent',
          backgroundImage: 'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 40%, #e879f9 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          letterSpacing: '0.15em',
          margin: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 2s ease 0.3s, transform 2s ease 0.3s',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 30px rgba(249,168,212,0.5))',
        }}
      >
        The End
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: '"Dancing Script", cursive, serif',
          fontSize: 'clamp(16px, 3vw, 24px)',
          color: '#f3a8d4cc',
          marginTop: '18px',
          letterSpacing: '0.08em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 2.2s ease 0.8s, transform 2.2s ease 0.8s',
        }}
      >
        — untuk kamu yang selalu ada 🌸
      </p>

      {/* Garis dekoratif bawah */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '28px', opacity: visible ? 1 : 0, transition: 'opacity 2s ease 1s' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #f9a8d4)' }} />
        <span style={{ color: '#f9a8d4', fontSize: '14px' }}>♡</span>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, #f9a8d4)' }} />
      </div>

      {/* Hint klik */}
      <p
        style={{
          position: 'absolute',
          bottom: '28px',
          fontSize: '13px',
          color: 'rgba(249,168,212,0.45)',
          letterSpacing: '0.12em',
          fontFamily: 'sans-serif',
          opacity: visible ? 1 : 0,
          transition: 'opacity 2.5s ease 1.5s',
          userSelect: 'none',
        }}
      >
        klik untuk lanjut ▶
      </p>

      {/* CSS keyframes via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Dancing+Script:wght@600&display=swap');

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes crtTurnOff {
          0% {
            transform: scale(1, 1);
            opacity: 1;
            filter: brightness(1);
          }
          40% {
            transform: scale(1, 0.005);
            opacity: 1;
            filter: brightness(5);
          }
          100% {
            transform: scale(0, 0.005);
            opacity: 0;
            filter: brightness(10);
          }
        }
      `}</style>
    </div>
  );
}
