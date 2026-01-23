
import { useState, useEffect } from 'react';
import groomImg from '../../assets/card_images/groom_nobg.png';
import brideImg from '../../assets/card_images/bride_nobg.png';

// Content Components
import Location from '../Location';
import Gallery from '../Gallery';
import CoupleCards from '../CoupleCards';
import DinoGame from '../DinoGame';
import Recruit from './Recruit';
import StoryMode from './StoryMode';
import GameModal from './GameModal'; // Now using the shared component
import { audioManager } from '../../utils/audioManager';
import { checkAchievement } from '../../utils/achievementManager';
import RankingBoard from '../RankingBoard';
import AchievementBoard from '../AchievementBoard';

const LobbyScreen = ({ onSwitchToV1 }) => {
    const [character, setCharacter] = useState('bride'); // 'groom' or 'bride'
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [dDay, setDDay] = useState('');
    const [/* touchCounts */, setTouchCounts] = useState({ groom: 0, bride: 0 });
    const [isCheeky, setIsCheeky] = useState(false); // For cheek animation

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
        setTimeout(() => setIsCheeky(false), 200); // Quick bounce reset

        const quotes = character === 'bride' ? [
            "오늘 세상에서 제일 행복해요!",
            "식장에서 예쁘게 만나요~",
            "축하해주셔서 감사합니다!",
            "우리 행복하게 잘 살게요!",
            "두근두근 설레는 날이에요!"
        ] : [
            "와주셔서 정말 감사합니다!",
            "멋진 신랑이 되겠습니다!",
            "행복한 가정을 꾸리겠습니다.",
            "신혼여행이 기대되네요!",
            "오늘 날씨도 정말 좋네요!"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setBubbleText(randomQuote);
        setShowBubble(true);

        setTouchCounts(prev => {
            const newCounts = { ...prev };
            newCounts[character] += 1;
            checkAchievement('TOUCH_CHARACTER', newCounts);
            return newCounts;
        });

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
            case 'map': return 'Wedding Location';
            case 'gallery': return 'Our Gallery';
            case 'recruit': return 'Guest Book'; // Renamed slightly for elegance
            case 'story': return 'Our Story';
            case 'ranking': return 'Mini Game Ranking';
            case 'achievement': return 'Achievements';
            case 'info': return 'Profile';
            case 'game': return 'Mini Game';
            default: return '';
        }
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-background font-body select-none">
            {/* Ambient Lighting Background (Consistent with Version2) */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

            {/* Main Character Area */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-0 pointer-events-none">
                <img
                    src={character === 'bride' ? brideImg : groomImg}
                    alt="Character"
                    className={`
                        h-[80vh] w-auto object-contain transition-all duration-500 ease-out cursor-pointer pointer-events-auto drop-shadow-2xl
                        ${isCheeky ? 'scale-105' : 'scale-100 hover:scale-[1.02] hover:brightness-105'}
                    `}
                    onClick={handleCharacterTouch}
                />

                {/* Speech Bubble - Elegant Style */}
                {showBubble && (
                    <div className="absolute top-[25%] bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-soft-lg z-20 animate-fade-in-up border border-white/60">
                        <p className="text-lg font-medium text-text font-body italic">"{bubbleText}"</p>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 rotate-45 border-b border-r border-white/60"></div>
                    </div>
                )}
            </div>

            {/* UI Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
                {/* Top Bar */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="flex flex-col gap-3">
                        {/* D-Day Badge */}
                        <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-5 py-2 shadow-soft-sm hover:bg-white/40 transition-colors">
                            <span className="text-xl">📅</span>
                            <span className="text-lg font-heading font-bold text-primary">{dDay}</span>
                        </div>
                    </div>

                    {/* Switch Character Button */}
                    <button
                        onClick={toggleCharacter}
                        className="flex items-center gap-3 bg-white/30 backdrop-blur-md border border-white/40 px-5 py-2 rounded-full shadow-soft-sm hover:bg-white/50 hover:shadow-soft-md transition-all group"
                    >
                        <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                            {character === 'bride' ? 'View Groom' : 'View Bride'}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary border border-white/50">
                            ↻
                        </div>
                    </button>
                </div>

                {/* Right Menu - Elegant Vertical List */}
                <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto z-40">
                    <MenuButton icon="🗺️" label="Location" onClick={() => toggleModal('map')} />
                    <MenuButton icon="📷" label="Gallery" onClick={() => toggleModal('gallery')} />
                    <MenuButton icon="📖" label="Story" onClick={() => toggleModal('story')} delay="100ms" />
                    <MenuButton icon="🏆" label="Ranking" onClick={() => toggleModal('ranking')} delay="200ms" />
                    <MenuButton icon="✨" label="Mission" onClick={() => toggleModal('achievement')} delay="300ms" />
                    <MenuButton icon="💌" label="Guest Book" onClick={() => toggleModal('recruit')} delay="400ms" />
                </div>

                {/* Bottom Area */}
                <div className="flex justify-between items-end w-full pointer-events-auto pb-2 relative z-50">
                    {/* Switch to Classic */}
                    <button
                        onClick={handleSwitchToV1}
                        className="text-text/50 hover:text-text text-sm underline decoration-transparent hover:decoration-text/30 transition-all font-medium mb-4"
                    >
                        Back to Classic
                    </button>

                    {/* Game Button - Elegant CTA */}
                    <button
                        onClick={() => {
                            toggleModal('game');
                            checkAchievement('GAME_START');
                        }}
                        className="group relative overflow-hidden bg-cta text-white px-8 py-4 rounded-2xl shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <div className="relative flex items-center gap-4">
                            <span className="text-3xl animate-bounce">🎮</span>
                            <div className="text-left">
                                <p className="text-xs font-semibold text-white/90 tracking-wider uppercase">Mini Game</p>
                                <p className="text-2xl font-heading text-white">Start Battle</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Unified Game Modal */}
            {activeModal && (
                <GameModal title={getModalTitle(activeModal)} onClose={closeModal}>
                    {activeModal === 'map' && <Location />}
                    {activeModal === 'gallery' && <Gallery />}
                    {activeModal === 'info' && <CoupleCards />}
                    {activeModal === 'game' && (
                        <div className="flex flex-col items-center justify-center py-8 min-h-[400px] w-full">
                            <DinoGame selectedCharacter={character} />
                        </div>
                    )}
                    {activeModal === 'story' && <StoryMode onClose={closeModal} />}
                    {activeModal === 'recruit' && <Recruit />}
                    {activeModal === 'ranking' && <RankingBoard />}
                    {activeModal === 'achievement' && <AchievementBoard />}
                </GameModal>
            )}
        </div>
    );
};

// Elegant Menu Button
const MenuButton = ({ icon, label, onClick, delay = '0ms' }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110"
        style={{ animationDelay: delay }}
    >
        <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-soft-md flex items-center justify-center text-xl group-hover:bg-white/60 group-hover:border-primary/30 group-hover:shadow-soft-lg transition-all">
            {icon}
        </div>
        <span className="text-[10px] font-bold text-text/70 uppercase tracking-widest bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-sm group-hover:text-primary transition-colors">
            {label}
        </span>
    </button>
);

export default LobbyScreen;

