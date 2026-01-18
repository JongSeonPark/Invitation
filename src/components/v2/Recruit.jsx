import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { audioManager } from '../../utils/audioManager';

// Import images exactly like Gallery.jsx
const imageModules = import.meta.glob('../../assets/images/*.{jpg,jpeg,png,webp}', { eager: true });
const images = Object.values(imageModules).map(module => module.default);

const Recruit = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState(null);
    const [rarity, setRarity] = useState(null); // 'R', 'SR', 'SSR'

    const handleRecruit = () => {
        if (isAnimating || images.length === 0) return;

        audioManager.playClick(); // Button sound
        setIsAnimating(true);
        setResult(null);

        // Animation Sequence
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * images.length);
            const selectedImage = images[randomIndex];

            // Save to Collection
            const savedCollection = JSON.parse(localStorage.getItem('wedding_collection') || '[]');
            if (!savedCollection.includes(randomIndex)) {
                savedCollection.push(randomIndex);
                localStorage.setItem('wedding_collection', JSON.stringify(savedCollection));
                window.dispatchEvent(new Event('collectionUpdated'));
            }

            // Mock Rarity
            const rand = Math.random();
            const newRarity = rand > 0.8 ? 'SSR' : rand > 0.5 ? 'SR' : 'R';

            setResult(selectedImage);
            setRarity(newRarity);
            setIsAnimating(false);
        }, 2000);
    };

    return (
        <div style={styles.container}>
            {!result && !isAnimating && (
                <div style={styles.startScreen}>
                    <div style={styles.banner}>
                        <h2 style={styles.bannerTitle}>사진 뽑기 (GACHA)</h2>
                        <p style={styles.bannerDesc}>웨딩 포토 컬렉션</p>
                    </div>
                    <button style={styles.recruitBtn} onClick={handleRecruit}>
                        <span style={{ fontSize: '1.2rem' }}>💎</span> 1회 뽑기
                    </button>
                    <p style={styles.notice}>* 획득한 사진은 갤러리에서 다시 볼 수 있습니다.</p>
                </div>
            )}

            {isAnimating && (
                <div style={styles.animationScreen}>
                    <div style={styles.summonCircle}></div>
                    <p style={styles.animText}>소환 중...</p>
                </div>
            )}

            {result && !isAnimating && createPortal(
                <div style={styles.fullScreenResult}>
                    <div style={{ ...styles.glow, borderColor: getRarityColor(rarity) }}></div>
                    <div style={styles.cardFrame}>
                        <span style={{ ...styles.rarityBadge, backgroundColor: getRarityColor(rarity) }}>
                            {rarity}
                        </span>
                        <img src={result} alt="Gacha Result" style={styles.resultImage} />
                        <div style={styles.newBadge}>신규!</div>
                    </div>

                    <h3 style={{ ...styles.resultTitle, color: getRarityColor(rarity) }}>
                        {rarity === 'SSR' ? '✨ 전설적인 기억 ✨' : rarity === 'SR' ? '💖 소중한 순간' : '📷 나이스 샷'}
                    </h3>

                    <div style={styles.floatingButtonGroup}>
                        <button style={styles.closeBtn} onClick={() => {
                            audioManager.playConfirm();
                            setResult(null);
                        }}>
                            확인
                        </button>
                        <button style={{ ...styles.closeBtn, ...styles.againBtn }} onClick={handleRecruit}>
                            다시 뽑기 💎
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'SSR': return '#FFD700';
        case 'SR': return '#C0C0C0';
        case 'R': return '#CD7F32';
        default: return '#fff';
    }
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        background: '#111',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: '"Rajdhani", sans-serif',
    },
    startScreen: { textAlign: 'center', width: '100%' },
    banner: { marginBottom: '40px', animation: 'pulse 2s infinite' },
    bannerTitle: {
        fontSize: '2rem',
        background: 'linear-gradient(to right, #ff9966, #ff5e62)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
    },
    bannerDesc: { color: '#888', margin: '5px 0 0' },
    recruitBtn: {
        background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
        border: 'none',
        padding: '15px 40px',
        borderRadius: '30px',
        color: '#fff',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0, 198, 255, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '0 auto',
    },
    notice: { marginTop: '20px', fontSize: '0.8rem', color: '#555' },
    animationScreen: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    summonCircle: {
        width: '100px', height: '100px', borderRadius: '50%', border: '5px solid #fff',
        borderTopColor: 'transparent', animation: 'spin 0.5s linear infinite', boxShadow: '0 0 30px #fff',
    },
    animText: { marginTop: '20px', letterSpacing: '5px', animation: 'blink 0.5s infinite' },
    fullScreenResult: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.27)',
    },
    cardFrame: {
        position: 'relative',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 0 50px rgba(255,255,255,0.2)',
        transform: 'rotate(-2deg)',
    },
    resultImage: {
        maxWidth: '90vw',
        maxHeight: '65vh', // Increased size for full screen
        display: 'block',
        borderRadius: '5px',
        objectFit: 'contain',
    },
    resultTitle: {
        fontSize: '1.5rem',
        marginTop: '30px',
        textShadow: '0 0 10px rgba(0,0,0,0.5)',
        textAlign: 'center',
    },
    rarityBadge: {
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        padding: '8px 15px',
        fontSize: '1.2rem',
        borderRadius: '5px',
        fontWeight: 'bold',
        color: '#000',
        zIndex: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    },
    newBadge: {
        position: 'absolute',
        bottom: '20px',
        right: '-15px',
        background: '#ff0000',
        color: '#fff',
        padding: '5px 12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        transform: 'rotate(5deg)',
        zIndex: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    },
    closeBtn: {
        padding: '12px 30px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid #fff',
        color: '#fff',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '1rem',
        backdropFilter: 'blur(5px)',
    },
    againBtn: {
        background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
        border: 'none',
        boxShadow: '0 0 20px rgba(0, 198, 255, 0.6)',
    },
    floatingButtonGroup: {
        display: 'flex',
        gap: '20px',
        marginTop: '30px',
    }
};

const styleSheet = document.createElement("style");
styleSheet.innerText += `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 50% { opacity: 0.5; } }
  @keyframes pulse { 50% { transform: scale(1.05); } }
  @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;
document.head.appendChild(styleSheet);

export default Recruit;
