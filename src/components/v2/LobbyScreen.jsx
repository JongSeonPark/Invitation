import { useState, useEffect } from 'react';
import groomImg from '../../assets/card_images/groom_nobg.png';
import brideImg from '../../assets/card_images/bride_nobg.png';

// Pixel Theme Lobby

// Content Components
import Location from '../Location';
import Gallery from '../Gallery';
import CoupleCards from '../CoupleCards';
import DinoGame from '../DinoGame';
import Recruit from './Recruit';
import StoryMode from './StoryMode';
import GameModal from './GameModal';
import { audioManager } from '../../utils/audioManager';
import { checkAchievement } from '../../utils/achievementManager';
import RankingBoard from '../RankingBoard';
import AchievementBoard from '../AchievementBoard';
import BouquetGame from './BouquetGame';

const LobbyScreen = ({ onSwitchToV1 }) => {
    const [character, setCharacter] = useState('bride');
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [dDay, setDDay] = useState('');
    const [isCheeky, setIsCheeky] = useState(false);

    useEffect(() => {
        const targetDate = new Date('2026-04-25T16:50:00');
        const calculateDDay = () => {
            const today = new Date();
            const diff = targetDate - today;
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            setDDay(days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : `D+${Math.abs(days)}`);
        };
        calculateDDay();
        const interval = setInterval(calculateDDay, 1000 * 60);
        return () => clearInterval(interval);
    }, []);

    const toggleCharacter = () => {
        audioManager.playClick();
        setCharacter(prev => prev === 'bride' ? 'groom' : 'bride');
    };

    const handleCharacterTouch = () => {
        audioManager.playClick();
        setIsCheeky(true);
        setTimeout(() => setIsCheeky(false), 200);

        const quotes = character === 'bride' ? [
            "Let's Go!",
            "Ready to Run?",
            "Jump! Jump!",
            "Pixel Love!",
            "Wedding Quest!"
        ] : [
            "Power Up!",
            "Level Up!",
            "Game Start!",
            "Insert Coin!",
            "Full Speed!"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setBubbleText(randomQuote);
        setShowBubble(true);
        checkAchievement('TOUCH_CHARACTER', { [character]: 1 }); // Simple trigger
        setTimeout(() => setShowBubble(false), 3000);
    };

    const toggleModal = (modalName) => {
        audioManager.playClick();
        setActiveModal(modalName);
    };

    const closeModal = () => {
        audioManager.playClick();
        setActiveModal(null);
    };

    const handleSwitchToV1 = () => {
        audioManager.playClick();
        onSwitchToV1();
    };

    const getModalTitle = (modal) => {
        switch (modal) {
            case 'map': return 'WORLD MAP';
            case 'gallery': return 'GALLERY';
            case 'recruit': return 'GUEST BOOK';
            case 'story': return 'PROLOGUE';
            case 'ranking': return 'RANKING';
            case 'achievement': return 'TROPHIES';
            case 'info': return 'PLAYER INFO';
            case 'game': return 'MINI GAME';
            case 'bouquet': return 'BOUQUET TOSS';
            default: return '';
        }
    }

    // Background Image
    const bgImage = new URL('../../assets/pixel_castle_bg.png', import.meta.url).href;

    return (
        <div className="relative w-full h-full overflow-hidden bg-black font-['Silkscreen'] select-none text-white">

            {/* Background Layer */}
            <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})`, imageRendering: 'pixelated' }}>
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Top HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2">
                    <div className="bg-black/60 border-2 border-white px-3 py-1 flex items-center gap-2 shadow-md">
                        <span className="text-yellow-400">📅</span>
                        <span className="text-lg">{dDay}</span>
                    </div>
                </div>

                <div className="pointer-events-auto">
                    <button
                        onClick={toggleCharacter}
                        className="bg-blue-600 border-b-4 border-r-4 border-blue-800 text-white px-3 py-1 text-xs hover:bg-blue-500 active:border-b-0 active:border-r-0 active:translate-y-1 transition-all"
                    >
                        SWITCH CHAR
                    </button>
                </div>
            </div>

            {/* Character Area */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-0 pointer-events-none">
                <div className="relative group">
                    <img
                        src={character === 'bride' ? brideImg : groomImg}
                        alt="Character"
                        className={`
                            h-[70vh] w-auto object-contain cursor-pointer pointer-events-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
                            ${isCheeky ? 'scale-105 brightness-125' : 'scale-100 hover:scale-[1.02]'}
                            transition-all duration-200
                        `}
                        onClick={handleCharacterTouch}
                        style={{ imageRendering: 'pixelated' }} // Try to force pixel look even on HD img? Or just contrast.
                    />
                    {/* Pixel Speech Bubble */}
                    {showBubble && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white text-black border-4 border-black px-4 py-2 z-30 min-w-[150px] text-center shadow-lg animate-bounce">
                            <p className="text-sm">{bubbleText}</p>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b-4 border-r-4 border-black border-t-0 border-l-0"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Menu - Retro Buttons */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-40">
                <MenuButton icon="🗺️" label="MAP" onClick={() => toggleModal('map')} />
                <MenuButton icon="📷" label="ALBUM" onClick={() => toggleModal('gallery')} />
                <MenuButton icon="📖" label="STORY" onClick={() => toggleModal('story')} />
                <MenuButton icon="🏆" label="RANK" onClick={() => toggleModal('ranking')} />
                <MenuButton icon="💐" label="BOUQUET" onClick={() => toggleModal('bouquet')} />
                <MenuButton icon="💌" label="GUEST" onClick={() => toggleModal('recruit')} />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-6 right-6 z-50 flex justify-between items-end pointer-events-auto">
                <button
                    onClick={handleSwitchToV1}
                    className="text-white/60 text-[10px] hover:text-white hover:underline bg-black/40 px-2 py-1"
                >
                    [ SYSTEM: CLASSIC MODE ]
                </button>

                <button
                    onClick={() => {
                        toggleModal('game');
                        checkAchievement('GAME_START');
                    }}
                    className="relative group bg-red-600 border-4 border-white text-white px-6 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none transition-all"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl animate-pulse">🎮</span>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] text-yellow-300">INSERT COIN</span>
                            <span className="text-xl">START GAME</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Modal Container */}
            {activeModal && (
                <GameModal title={getModalTitle(activeModal)} onClose={closeModal}>
                    {activeModal === 'map' && <Location />}
                    {activeModal === 'gallery' && <Gallery />}
                    {activeModal === 'info' && <CoupleCards />}
                    {activeModal === 'game' && (
                        <div className="flex flex-col items-center justify-center py-4 w-full">
                            <DinoGame selectedCharacter={character} />
                        </div>
                    )}
                    {activeModal === 'story' && <StoryMode onClose={closeModal} />}
                    {activeModal === 'recruit' && <Recruit />}
                    {activeModal === 'ranking' && <RankingBoard />}
                    {activeModal === 'achievement' && <AchievementBoard />}
                    {activeModal === 'bouquet' && <BouquetGame />}
                </GameModal>
            )}
        </div>
    );
};

const MenuButton = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="group relative bg-black/60 border-2 border-white px-3 py-2 flex items-center gap-3 hover:bg-white/20 hover:border-yellow-400 transition-all w-32 shadow-md"
    >
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-xs text-white group-hover:text-yellow-400">{label}</span>
    </button>
);

export default LobbyScreen;

