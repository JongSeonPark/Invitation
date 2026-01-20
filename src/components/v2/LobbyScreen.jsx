import { useState, useEffect } from 'react';
import groomImg from '../../assets/card_images/groom_nobg.png';
import brideImg from '../../assets/card_images/bride_nobg.png';
import GameModal from './GameModal';

// Content Components
import Location from '../Location';
import Gallery from '../Gallery';
import InvitationText from '../InvitationText';
import CoupleCards from '../CoupleCards';
import DinoGame from '../DinoGame';
import Recruit from './Recruit';
import StoryMode from './StoryMode';
import { audioManager } from '../../utils/audioManager';
import { checkAchievement } from '../../utils/achievementManager';
import RankingBoard from '../RankingBoard';
import AchievementBoard from '../AchievementBoard';

const LobbyScreen = ({ onSwitchToV1 }) => {
    const [character, setCharacter] = useState('bride'); // 'groom' or 'bride'
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState('');
    const [activeModal, setActiveModal] = useState(null); // 'map', 'gallery', 'story', 'msg', 'game', 'ranking'
    const [dDay, setDDay] = useState('');
    const [touchCounts, setTouchCounts] = useState({ groom: 0, bride: 0 });

    useEffect(() => {
        const targetDate = new Date('2026-04-25T16:50:00');
        const calculateDDay = () => {
            const today = new Date();
            const diff = targetDate - today;
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            setDDay(days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : `D+${Math.abs(days)}`);
        };
        calculateDDay();
        const interval = setInterval(calculateDDay, 1000 * 60); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const toggleCharacter = () => {
        audioManager.playClick();
        setCharacter(prev => prev === 'bride' ? 'groom' : 'bride');
    };

    const handleCharacterTouch = () => {
        audioManager.playClick();

        const quotes = character === 'bride' ? [
            "오늘 날씨 정말 좋네요!",
            "결혼식 준비는 잘 되어가나요?",
            "어서 오세요! 환영합니다.",
            "기대해 주세요!",
            "함께해서 너무 행복해요."
        ] : [
            "반갑습니다!",
            "잘 부탁드립니다.",
            "멋진 하루 되세요!",
            "끝까지 함께 즐겨주세요!",
            "와주셔서 감사합니다."
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setBubbleText(randomQuote);
        setShowBubble(true);

        // Achievement Check
        setTouchCounts(prev => {
            const newCounts = { ...prev };
            newCounts[character] += 1; // Increment current character count

            checkAchievement('TOUCH_CHARACTER', newCounts);
            return newCounts;
        });

        // Hide bubble after 3 seconds
        setTimeout(() => setShowBubble(false), 3000);
    };

    const toggleModal = (modalName) => {
        audioManager.playClick();
        setActiveModal(modalName);
    };

    const closeModal = () => {
        audioManager.playClick(); // Optional: Close sound
        setActiveModal(null);
    };

    const handleSwitchToV1 = () => {
        audioManager.playClick();
        onSwitchToV1();
    };

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.background}></div>

            {/* Main Character Area */}
            <div style={styles.characterArea}>
                <img
                    src={character === 'bride' ? brideImg : groomImg}
                    alt="Character"
                    style={styles.characterImage}
                    onClick={handleCharacterTouch}
                />
                {showBubble && (
                    <div style={styles.speechBubble}>
                        {bubbleText}
                    </div>
                )}
            </div>

            {/* UI Layer */}
            <div style={styles.uiLayer}>
                {/* Top Bar: Currency / Info */}
                <div style={styles.topBar}>
                    <div style={styles.currency}>
                        <span style={styles.currencyIcon}>💖</span>
                        <span>호감도: 999,999</span>
                    </div>
                    <div style={styles.currency}>
                        <span style={styles.currencyIcon}>📅</span>
                        <span>{dDay} (26.04.25)</span>
                    </div>
                </div>

                {/* Switch Character Button */}
                <button style={styles.switchBtn} onClick={toggleCharacter}>
                    🔄 교대
                </button>

                {/* Training (Game) Button - Left Side */}
                <button style={styles.gameBtn} onClick={() => toggleModal('game')}>
                    <div style={styles.gameIcon}>🦖</div>
                    <span>전투 훈련</span>
                </button>

                {/* Right Menu (Circular Icons) */}
                <div style={styles.rightMenu}>
                    <MenuButton icon="🗺️" label="지도" onClick={() => toggleModal('map')} />
                    <MenuButton icon="📷" label="갤러리" onClick={() => toggleModal('gallery')} />
                    <MenuButton icon="💎" label="뽑기" onClick={() => toggleModal('recruit')} />
                    <MenuButton icon="📜" label="스토리" onClick={() => toggleModal('story')} />
                    <MenuButton icon="🏆" label="랭킹" onClick={() => toggleModal('ranking')} />
                    <MenuButton icon="🎖️" label="업적" onClick={() => toggleModal('achievement')} />
                    <MenuButton icon="✉️" label="정보" onClick={() => toggleModal('info')} />
                    <MenuButton icon="🔙" label="구버전" onClick={handleSwitchToV1} />
                </div>

                {/* Bottom Banner */}
                <div style={styles.bottomBanner}>
                    <p>✨ 웨딩 작전 개시! (WEDDING CAMPAIGN START) ✨</p>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'map' && (
                <GameModal title="작전 구역 (LOCATION)" onClose={closeModal}>
                    <div style={{ background: '#fff' }}>
                        <Location />
                    </div>
                </GameModal>
            )}
            {activeModal === 'gallery' && (
                <GameModal title="기록 보관소 (GALLERY)" onClose={closeModal}>
                    <div style={{ background: '#fff' }}>
                        <Gallery />
                    </div>
                </GameModal>
            )}
            {activeModal === 'story' && (
                <GameModal title="작전 브리핑 (STORY)" onClose={closeModal}>
                    <div style={{ height: '500px' }}>
                        <StoryMode onClose={closeModal} />
                    </div>
                </GameModal>
            )}
            {activeModal === 'info' && (
                <GameModal title="타겟 프로필 (PROFILE)" onClose={closeModal}>
                    <div style={{ background: '#fff' }}>
                        <CoupleCards />
                    </div>
                </GameModal>
            )}
            {activeModal === 'game' && (
                <GameModal title="전투 시뮬레이션 (GAME)" onClose={closeModal}>
                    <div style={{ background: '#f5f5f5', display: 'flex', justifyContent: 'center' }}>
                        <DinoGame />
                    </div>
                </GameModal>
            )}
            {activeModal === 'recruit' && (
                <GameModal title="사진 뽑기 (GACHA)" onClose={closeModal}>
                    <div style={{ height: '500px' }}>
                        <Recruit />
                    </div>
                </GameModal>
            )}
            {activeModal === 'ranking' && (
                <GameModal title="명예의 전당 (RANKING)" onClose={closeModal}>
                    <div style={{ background: '#fff' }}>
                        <RankingBoard />
                    </div>
                </GameModal>
            )}
            {activeModal === 'achievement' && (
                <GameModal title="나의 업적 (ACHIEVEMENTS)" onClose={closeModal}>
                    <div style={{ background: '#fff' }}>
                        <AchievementBoard />
                    </div>
                </GameModal>
            )}
        </div>
    );
};

const MenuButton = ({ icon, label, onClick }) => (
    <div style={styles.menuItem} onClick={onClick}>
        <div style={styles.menuIconCircle}>
            {icon}
        </div>
        <span style={styles.menuLabel}>{label}</span>
    </div>
);


const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #2b32b2, #1488cc)', // Sci-fi Blue bg
        fontFamily: '"Rajdhani", sans-serif',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
        // Optional: Add a subtle grid or tech pattern here
    },
    characterArea: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
    },
    characterImage: {
        height: '80vh',
        width: 'auto',
        maxWidth: 'none',
        objectFit: 'contain',
        transform: 'scale(1.5)', // Reduced to 1.5 as requested
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
        cursor: 'pointer',
        pointerEvents: 'auto',
    },
    speechBubble: {
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px 20px',
        borderRadius: '20px',
        border: '2px solid #000',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        zIndex: 10,
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.27)',
    },
    uiLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none', // Let touches pass through to character where needed
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        pointerEvents: 'auto',
    },
    currency: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: '5px 15px',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.8rem',
        border: '1px solid #444',
    },
    switchBtn: {
        position: 'absolute',
        top: '60px',
        left: '10px',
        padding: '8px 12px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#fff',
        cursor: 'pointer',
        pointerEvents: 'auto',
    },
    gameBtn: {
        position: 'absolute',
        top: '120px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '8px 12px',
        borderRadius: '5px',
        border: '2px solid #ff4757',
        backgroundColor: 'rgba(255, 71, 87, 0.2)',
        color: '#ff4757',
        cursor: 'pointer',
        pointerEvents: 'auto',
        fontWeight: 'bold',
        boxShadow: '0 0 10px rgba(255, 71, 87, 0.3)',
    },
    gameIcon: {
        fontSize: '1.2rem',
    },
    rightMenu: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        pointerEvents: 'auto',
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        cursor: 'pointer',
    },
    menuIconCircle: {
        width: '50px',
        height: '50px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        border: '2px solid #00eaff',
        boxShadow: '0 0 10px rgba(0, 234, 255, 0.3)',
        transition: 'transform 0.1s',
    },
    menuLabel: {
        fontSize: '0.6rem',
        color: '#fff',
        textShadow: '0 0 3px #000',
        fontWeight: 'bold',
    },
    bottomBanner: {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        backgroundColor: 'rgba(255, 215, 0, 0.8)', // Gold
        padding: '10px',
        textAlign: 'center',
        borderRadius: '8px',
        fontWeight: 'bold',
        color: '#333',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        pointerEvents: 'auto',
    }
};

// Add keyframes
const styleSheet = document.createElement("style");
styleSheet.innerText += `
  @keyframes popIn {
    0% { transform: translateX(-50%) scale(0); }
    100% { transform: translateX(-50%) scale(1); }
  }
`;
document.head.appendChild(styleSheet);

export default LobbyScreen;
