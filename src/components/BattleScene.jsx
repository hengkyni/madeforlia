import React, { useState, useEffect, useRef } from 'react';
import DialogBox from './DialogBox';

/**
 * Extract satu row dari spritesheet ke data URL bersih.
 *
 * @param {string}  src        - path/URL gambar spritesheet
 * @param {number}  cols       - jumlah kolom (frame) dalam 1 baris
 * @param {number}  rowIndex   - index baris yang mau diambil (0-based)
 * @param {boolean} removeBlack - hapus piksel hitam (jadi transparan)
 * @param {number}  totalRows  - total baris di spritesheet (default 4)
 */
async function extractRow(src, cols, rowIndex, removeBlack = false, totalRows = 4, offsetY = 0, extraH = 0) {
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error(`Gagal load: ${src}`));
    i.src = src;
  });

  const fw = img.naturalWidth / cols;
  const fh = img.naturalHeight / totalRows;

  const canvasW = Math.round(fw * cols);
  const canvasH = Math.round(fh) + extraH;

  const oc = document.createElement('canvas');
  oc.width = canvasW;
  oc.height = canvasH;
  const ctx = oc.getContext('2d');

  ctx.drawImage(
    img,
    0,
    Math.round(rowIndex * fh) - offsetY,
    Math.round(fw * cols),
    Math.round(fh) + extraH,
    0, 0,
    canvasW,
    canvasH,
  );

  if (removeBlack) {
    const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
    const data = imageData.data;

    // Gunakan Chroma Key Global + Feathering (Bukan Flood Fill)
    // Ini menyelesaikan masalah: 
    // 1. Background putih yang terjebak di antara kaki ksatria (karena bukan edge).
    // 2. Rok putri yang hilang karena flood-fill bocor.

    for (let p = 0; p < data.length; p += 4) {
      const r = data[p], g = data[p + 1], b = data[p + 2];

      // Jarak warna ke putih sempurna (255, 255, 255)
      const diffWhite = Math.max(255 - r, 255 - g, 255 - b);

      if (diffWhite < 15) {
        // Putih atau hampir putih sempurna -> Hilang total
        data[p + 3] = 0;
      } else if (diffWhite < 45) {
        // Abu-abu sangat terang (anti-aliasing) -> Semi transparan agar pinggiran halus
        const alpha = Math.floor(((diffWhite - 15) / 30) * 255);
        data[p + 3] = Math.min(data[p + 3], alpha);
      }

      // Jarak warna ke hitam pekat (0, 0, 0)
      const diffBlack = Math.max(r, g, b);
      if (diffBlack < 15) {
        // Hitam pekat -> Hilang total
        data[p + 3] = 0;
      } else if (diffBlack < 40) {
        // Abu-abu sangat gelap -> Semi transparan
        const alpha = Math.floor(((diffBlack - 15) / 25) * 255);
        data[p + 3] = Math.min(data[p + 3], alpha);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return {
    url: oc.toDataURL(),
    fw: Math.round(fw),
    fh: Math.round(fh),
    realH: canvasH,
  };
}

/**
 * Komponen sprite sheet animator.
 *
 * Cara kerja: satu div dengan backgroundImage dari canvas hasil extractRow.
 * Animasi dijalankan lewat CSS @keyframes yang geser background-position-x
 * sejumlah (cols * fw) piksel menggunakan steps(cols).
 *
 * Props:
 *  id        - string unik (untuk nama @keyframes, hindari konflik)
 *  dataUrl   - hasil extractRow.url
 *  cols      - jumlah frame
 *  fw        - lebar 1 frame (px, hasil extractRow.fw)
 *  fh        - tinggi 1 frame (px, hasil extractRow.fh)
 *  renderH   - tinggi render yang diinginkan (px); lebar menyesuaikan aspect ratio
 *  flip      - scaleX(-1) untuk mirror horizontal
 *  duration  - durasi 1 siklus animasi (default '0.77s')
 *  paused    - hentikan animasi di frame 0
 */
function Sprite({ id, dataUrl, cols, fw, fh, realH, renderH, flip = false, duration = '0.77s', paused = false }) {
  const scale = renderH / fh;
  const renderW = fw * scale;       // lebar 1 frame setelah scale
  const bgW = fw * cols * scale; // lebar penuh spritesheet setelah scale
  const renderedRealH = (realH || fh) * scale; // tinggi aktual setelah scale

  const animName = `sprite_anim_${id}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          from { background-position-x: 0px; }
          to   { background-position-x: -${bgW}px; }
        }
      `}</style>
      <div
        style={{
          width: renderW,
          height: renderedRealH,
          backgroundImage: `url(${dataUrl})`,
          backgroundSize: `${bgW}px ${renderedRealH}px`,
          backgroundPositionX: '0px',
          backgroundPositionY: '0px',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          transform: flip ? 'scaleX(-1)' : undefined,
          animation: paused
            ? 'none'
            : `${animName} ${duration} steps(${cols}) infinite`,
        }}
      />
    </>
  );
}

/**
 * Scene pertarungan utama.
 * Klik / tap di mana saja untuk maju ke dialog berikutnya.
 */
export default function BattleScene({ onComplete }) {
  const [step, setStep] = useState(0);
  const [sprites, setSprites] = useState(null);
  const [error, setError] = useState(null);
  const stepRef = useRef(0);

  // Narasi per langkah
  const scenario = [
    { name: 'Cowo', text: 'Hei Monster, lepaskan Lia sekarang juga!' },
    { name: 'Monster', text: 'Grrr, kamu harus melangkahiku dulu!' },
    { name: '', text: '★ Cowo berlari menyerang dengan kekuatan penuh! ★' },
    { name: 'Cowo', text: 'Kamu nggak apa-apa kan sayang?' },
    { name: 'Lia', text: 'Makasih ya udah nolongin aku...' },
  ];

  // Posisi horizontal cowo bergerak maju seiring dialog
  const cowoLeft = ['4%', '4%', '36%', '54%', '56%'];

  // Ground level (jarak kaki dari bawah scene)
  const GROUND = '8%';

  // Load dan extract semua spritesheet sekali saja saat mount
  useEffect(() => {
    (async () => {
      try {
        const [cowoWalk, cowoAttack, cewe, monIdle, monDie] = await Promise.all([
          // Parameter: (path, jumlahKolom, barisKe, hapusBackground, totalBaris, offsetY, extraH)
          extractRow('/cowo.png', 4, 2, true, 8),    // walk kanan
          // Ambil sedikit saja (10px) ke atas agar pedang tidak kepotong, tapi tidak mengambil bayangan karakter di atasnya
          extractRow('/cowo.png', 4, 6, true, 8, 10, 10),
          extractRow('/putri.png', 3, 1, true, 4),   // putri
          // Geser kotak potong ke bawah (offsetY negatif) supaya kaki tertangkap, tanpa menambah tinggi canvas agar tidak terbang
          extractRow('/monster.png', 2, 0, true, 6, -30, 0), // monster idle
          extractRow('/monster.png', 2, 4, true, 6, -30, 0), // monster mati
        ]);
        setSprites({ cowoWalk, cowoAttack, cewe, monIdle, monDie });
      } catch (err) {
        console.error('Sprite load error:', err);
        setError(err.message);
      }
    })();
  }, []);

  const handleClick = () => {
    const next = stepRef.current + 1;
    if (next < scenario.length) {
      stepRef.current = next;
      setStep(next);
    } else {
      onComplete?.();
    }
  };

  /* ───────────── RENDER ───────────── */

  if (error) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100vw', height: '100vh', background: '#0a0a0a',
      }}>
        <p style={{ color: '#ff4444', fontFamily: "'VT323', monospace", fontSize: '1.5rem' }}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Loading */}
      {!sprites && (
        <p style={{ color: '#FFD700', fontFamily: "'VT323', monospace", fontSize: '2rem' }}>
          Loading...
        </p>
      )}

      {sprites && (
        <>
          {/* ── Scene utama ── */}
          <div style={{
            position: 'relative',
            width: '100%', maxWidth: 960,
            height: '72vh',
            backgroundImage: "url('/dunia1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            overflow: 'hidden',
          }}>

            {/* MONSTER */}
            <div style={{ position: 'absolute', bottom: GROUND, left: '42%' }}>
              {step < 4 ? (
                <Sprite
                  id="mon_idle"
                  dataUrl={sprites.monIdle.url}
                  cols={2}
                  fw={sprites.monIdle.fw}
                  fh={sprites.monIdle.fh}
                  realH={sprites.monIdle.realH}
                  renderH={150}
                  flip
                  duration="0.9s"
                />
              ) : (
                <div style={{ transform: 'translateY(90px)' }}>
                  <Sprite
                    id="mon_die"
                    dataUrl={sprites.monDie.url}
                    cols={2}
                    fw={sprites.monDie.fw}
                    fh={sprites.monDie.fh}
                    realH={sprites.monDie.realH}
                    renderH={150}
                    flip
                    duration="1.2s"
                    paused={step > 4} // beku di frame terakhir setelah mati
                  />
                </div>
              )}
            </div>

            {/* CEWE (Lia) — flip agar hadap kiri */}
            <div style={{ position: 'absolute', bottom: '4%', left: '74%' }}>
              <Sprite
                id="cewe"
                dataUrl={sprites.cewe.url}
                cols={3}
                fw={sprites.cewe.fw}
                fh={sprites.cewe.fh}
                realH={sprites.cewe.realH}
                renderH={90}
                flip
                duration="0.85s"
              />
            </div>

            {/* COWO — bergerak smooth lewat CSS transition pada left */}
            <div style={{
              position: 'absolute',
              bottom: '0%',
              left: cowoLeft[step],
              transition: 'left 1.5s ease',
            }}>
              {step === 2 ? (
                <Sprite
                  id="cowo_attack"
                  dataUrl={sprites.cowoAttack.url}
                  cols={4}
                  fw={sprites.cowoAttack.fw}
                  fh={sprites.cowoAttack.fh}
                  realH={sprites.cowoAttack.realH}
                  renderH={120}
                  duration="0.6s"
                />
              ) : (
                <Sprite
                  id="cowo_walk"
                  dataUrl={sprites.cowoWalk.url}
                  cols={4}
                  fw={sprites.cowoWalk.fw}
                  fh={sprites.cowoWalk.fh}
                  realH={sprites.cowoWalk.realH}
                  renderH={120}
                  paused={step !== 3} // jalan hanya saat bergerak (step 3)
                  duration="0.77s"
                />
              )}
            </div>
          </div>

          {/* ── Dialog ── */}
          <div style={{ width: '90%', maxWidth: 800, marginTop: 10 }}>
            <DialogBox
              name={scenario[step].name}
              text={scenario[step].text}
              onNext={() => { }}
            />
          </div>
        </>
      )}
    </div>
  );
}