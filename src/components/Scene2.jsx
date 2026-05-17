import React, { useState, useEffect } from 'react';
import DialogBox from './DialogBox';

const particles = Array.from({ length: 150 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${Math.random() * 4 + 1}px`,
  delay: `${Math.random() * 3}s`,
  duration: `${Math.random() * 3 + 2}s`
}));

export default function Scene2({ isMuted }) {
  const [step, setStep] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStage, setPopupStage] = useState(1);
  const [noBtnPos, setNoBtnPos] = useState({});
  const photos = ['/c.jpeg', '/c2.jpeg', '/c3.jpeg'];

  useEffect(() => {
    let interval;
    if (step === 12) {
      interval = setInterval(() => {
        setPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const scenario = [
    { image: '/2.PNG', name: 'Cowo', text: 'Arghhhh...,pegel juga.' },
    { image: '/3.PNG', name: 'Cowo', text: 'Scroll ig bentar kali ye...' },
    { image: '/4.PNG', name: 'Cowo', text: 'Anjir siapa ini cantik amat.' },
    { image: '/5.PNG', name: 'Cowo', text: 'Coba aja aku punya putri secantik itu,hehehehe...' },
    { image: '/5.PNG', name: 'Cowo', text: 'Eh bentar... lah kan emang ada ya' },
    { image: '/senyum.png', name: 'Cowo', text: 'Hehehehe, Halo Cantik' },
    { image: '/sedih.png', name: 'Cowo', text: 'maap ya ceritanya kaga jelas,hehe.....' },
    { image: '/garpal.png', name: 'Cowo', text: 'Niatnya tadi pengen bikin cerita yang keren, tapi gagal wkwkwkwk' },
    { image: '/senyum.png', name: 'Cowo', text: 'Tapi intinya,terimakasih ya cantik udah lahir di dunia,dan udah biarin aku untuk ketemu kamu' },
    { image: '/senyum.png', name: 'Cowo', text: 'Terimakasih juga ya sudah hidup sampe detik ini cantik....' },
    { image: '/bingung.png', name: 'Cowo', text: 'Hemm... ' },
    { image: '/senyum.png', name: 'Cowo', text: 'mari kita lihat dulu wanita kesayangan saya ini ' },
    { image: '/wah.png', name: 'Cowo', text: 'Ini dia orangnya...' },
    { image: '/yey.png', name: 'Cowo', text: 'Cantik betul kannn!!!' },
    { image: '/senyum1.png', name: 'Cowo', text: 'intinya...' },
    { image: '/senyum1.png', name: 'Cowo', text: 'Selamat ulang tahun ya cantik...' },
    { image: '/senyum1.png', name: 'Cowo', text: 'Semoga panjang umur,sehat selalu,makin cantik,dan selalu diliputi bahagia ya cantik' },
    { image: '/senyum1.png', name: 'Cowo', text: 'Terimakasih ya udh biarin aku jadi bagian dari hidup kamu' },
    { image: '/senyum1.png', name: 'Cowo', text: 'Happy Birthday lia' },
  ];

  const finalCardsOriginal = [
    { top: '25%', left: '15%', rot: '-12deg' },
    { top: '20%', left: '80%', rot: '15deg' },
    { top: '55%', left: '10%', rot: '-8deg' },
    { top: '50%', left: '85%', rot: '18deg' },
    { top: '85%', left: '18%', rot: '-15deg' },
    { top: '80%', left: '82%', rot: '12deg' },
    { top: '22%', left: '35%', rot: '-5deg' },
    { top: '25%', left: '65%', rot: '8deg' },
    { top: '85%', left: '65%', rot: '-10deg' },
  ];

  const photosArray = ['/c.jpeg', '/c2.jpeg', '/c3.jpeg', '/c4.jpeg', '/c5.jpeg', '/c6.jpeg', '/c7.jpeg', '/c8.jpeg', '/c9.jpeg'];
  const allCards = Array.from({ length: 18 }).map((_, i) => {
    const src = photosArray[i % photosArray.length];

    // Original 9 cards use their initial layout, the rest start from the center
    const scatterTop = i < 9 ? finalCardsOriginal[i].top : '50%';
    const scatterLeft = i < 9 ? finalCardsOriginal[i].left : '50%';
    const scatterRot = i < 9 ? finalCardsOriginal[i].rot : '0deg';

    // Parametric heart formula
    const t = (i / 18) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    // Scale to screen percentages
    const heartLeft = 50 + (x / 16) * 35;
    const heartTop = 50 + ((y - 5) / 12) * 28;

    return {
      src,
      scatterTop,
      scatterLeft,
      scatterRot,
      heartTop: `${heartTop}%`,
      heartLeft: `${heartLeft}%`,
      heartRot: '0deg',
    };
  });

  const handleClick = () => {
    if (showPopup) return; // Block klik layar utama kalau popup aktif

    if (step === 4) {
      setShowPopup(true);
      setPopupStage(1);
      setNoBtnPos({});
      return;
    }

    if (step < scenario.length - 1) {
      setStep(step + 1);
    }
  };

  const handleYesClick = (e) => {
    e.stopPropagation();
    if (popupStage < 4) {
      setPopupStage(popupStage + 1);
      setNoBtnPos({}); // Reset posisi No tiap ganti stage
    } else {
      setShowPopup(false);
      setStep(5); // Lanjut ceritanya
    }
  };

  const handleNoHover = (e) => {
    e.stopPropagation();
    // Tombol kabur kemana-mana di seluruh layar
    const randomTop = Math.floor(Math.random() * 80) + 10;
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setNoBtnPos({
      position: 'fixed',
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
      zIndex: 100000,
    });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: step >= 15 ? '100vw' : 960,
        height: '100%',
        margin: '0 auto',
        overflow: step < 5 ? 'hidden' : 'visible',
        background: (step >= 5 && step < 15) ? '#fff' : '#000'
      }}>
      {/* Audio Backsound 2 (Mulai dari dialog Hehehehe, Halo cantik) */}
      {step >= 5 && (
        <audio autoPlay loop muted={isMuted} src="/segalanya.m4a" id="bgMusic2" />
      )}

      {/* Background Video */}
      {step < 5 && (
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
      )}

      {/* Efek Flash Transition */}
      {step === 5 && (
        <div className="flash-effect" style={{ zIndex: 5 }} />
      )}

      {/* Pop Up Usil */}
      {showPopup && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)'
          }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '5%',
            border: '4px solid #fff',
            borderRadius: '0px',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            minWidth: 'min(350px, 80vw)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: '"VT323", monospace'
          }}>
            <h3 style={{
              color: '#fff',
              marginBottom: '8%',
              fontSize: 'clamp(24px, 5vw, 32px)',
              letterSpacing: '2px',
              textShadow: '2px 2px 0px #000'
            }}>
              {popupStage === 1 && "YAKIN INGIN MELANJUTKAN?"}
              {popupStage === 2 && "YAKIN INGIN LANJUT?"}
              {popupStage === 3 && "BENER NIH?"}
              {popupStage === 4 && "SERIUS NIH??"}
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8%', minHeight: '40px' }}>
              <button
                onClick={handleYesClick}
                style={{
                  padding: '8px 24px',
                  background: '#000',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '0px',
                  fontSize: 'clamp(20px, 4vw, 24px)',
                  fontFamily: '"VT323", monospace',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'background 0.1s, color 0.1s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#000';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                Yes
              </button>

              <button
                onMouseEnter={handleNoHover}
                onClick={handleNoHover} // buat jaga-jaga kalau dia bisa klik cepat
                style={{
                  padding: '8px 24px',
                  background: '#000',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '0px',
                  fontSize: 'clamp(20px, 4vw, 24px)',
                  fontFamily: '"VT323", monospace',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'background 0.1s, color 0.1s, top 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  ...noBtnPos
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gambar Karakter Scene 2 */}
      <img
        src={scenario[step].image}
        alt={`Scene 2 Character Frame ${step}`}
        style={{
          position: 'absolute',
          top: step >= 5 ? '50%' : step >= 3 ? '60%' : '50%',
          left: step === 12 ? '25%' : step >= 5 ? '50%' : step >= 2 ? '55%' : '35%',
          transform: 'translate(-50%, -50%)',
          height: step >= 5 ? '70%' : step >= 3 ? '52%' : step === 2 ? '42%' : '70%',
          zIndex: 1,
          objectFit: 'contain',
          transition: 'all 0.5s ease-in-out',
          opacity: step === 18 ? 0 : 1
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

      {/* Tampilan foto wanita kesayangan */}
      {step === 12 && (
        <img
          src={photos[photoIndex]}
          alt="Wanita Kesayangan"
          style={{
            position: 'absolute',
            top: '45%',
            left: '72%',
            transform: 'translate(-50%, -50%)',
            height: '75%',
            zIndex: 2,
            objectFit: 'contain',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      )}

      {/* Efek Bintang/Partikel Cahaya */}
      {step >= 15 && particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: '#fff',
            borderRadius: '50%',
            opacity: 0,
            zIndex: 0,
            boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.6)',
            animation: `twinkle ${p.duration} ease-in-out infinite alternate ${p.delay}`
          }}
        />
      ))}

      {/* Wrapper untuk membatasi penyebaran dan ukuran kartu di layar lebar */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 960, height: '100%', pointerEvents: 'none' }}>

        {/* Efek Cards Akhir */}
        {step >= 15 && allCards.map((card, idx) => {
          const isHeart = step === 18;
          const isOriginal = idx < 9;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: isHeart ? card.heartTop : card.scatterTop,
                left: isHeart ? card.heartLeft : card.scatterLeft,
                width: isHeart ? '10%' : (isOriginal ? '14%' : '10%'),
                transform: `translate(-50%, -50%) rotate(${isHeart ? card.heartRot : card.scatterRot})`,
                zIndex: isHeart ? 5 : 0,
                perspective: '1000px',
                transition: 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
                opacity: (!isOriginal && !isHeart) ? 0 : 1,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  transformStyle: 'preserve-3d',
                  opacity: isOriginal ? 0 : 1,
                  animation: isOriginal ? `realFlip 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${idx * 0.4}s` : 'none'
                }}
              >
                {/* Bagian Depan Kartu (Foto Asli) */}
                <img
                  src={card.src}
                  alt={`Memory ${idx}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: isHeart ? '0 0 15px rgba(255, 182, 193, 0.9)' : '0 8px 20px rgba(0,0,0,0.3)',
                    objectFit: 'cover',
                    border: isHeart ? '3px solid #ffb6c1' : '4px solid white',
                    transition: 'box-shadow 1.5s ease, border 1.5s ease',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
                {/* Bagian Belakang Kartu (Desain) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #2a2a2a 0%, #111 100%)',
                    borderRadius: '12px',
                    border: '4px solid #666',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{
                    width: '80%',
                    height: '80%',
                    border: '2px dashed #555',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#555',
                    fontSize: '2vw'
                  }}>
                    ✨
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kotak Dialog Overlay (Diposisikan di Bawah) */}
      <div style={{
        position: 'absolute',
        bottom: '3%',
        left: 0,
        right: 0,
        margin: '0 auto',
        width: '90%',
        maxWidth: 864,
        zIndex: 10,
        opacity: step === 15 ? 0 : step === 18 ? 0 : 1,
        animation: step === 15 ? 'fadeInDialog 0.5s ease-in forwards 4.6s' : 'none',
        pointerEvents: step === 18 ? 'none' : 'auto',
        transition: 'opacity 1s ease'
      }}>
        {scenario[step].text && (
          <DialogBox
            name={scenario[step].name}
            text={scenario[step].text}
          />
        )}
      </div>
    </div>
  );
}
