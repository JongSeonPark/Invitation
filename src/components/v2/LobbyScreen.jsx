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
    const [touchCounts, setTouchCounts] = useState({ groom: 0, bride: 0 });
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

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#FCD34D] font-['Jua'] select-none">
            {/* Pop Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#F97316 3px, transparent 3px)',
                    backgroundSize: '24px 24px'
                }}
            ></div>

            {/* Main Character Area */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-0 pointer-events-none">
                <img
                    src={character === 'bride' ? brideImg : groomImg}
                    alt="Character"
                    className={`
                        h-[85vh] w-auto object-contain transition-transform duration-200 cursor-pointer pointer-events-auto filter drop-shadow-xl
                        ${isCheeky ? 'scale-x-110 scale-y-90' : 'scale-100 hover:scale-[1.02]'}
                    `}
                    onClick={handleCharacterTouch}
                />

                {/* Speech Bubble - Comic Style */}
                {showBubble && (
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 bg-white border-4 border-black px-6 py-4 rounded-[2rem] shadow-lg z-20 animate-bounce whitespace-nowrap">
                        <p className="text-xl font-bold text-black">{bubbleText}</p>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-black border-r-[10px] border-r-transparent"></div>
                        <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[11px] border-t-white border-r-[6px] border-r-transparent"></div>
                    </div>
                )}
            </div>

            {/* UI Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none p-4 flex flex-col justify-between">
                {/* Top Bar */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-1 shadow-md">
                            <span className="text-xl">💖</span>
                            <span className="text-lg font-bold text-gray-800">호감도 MAX</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-1 shadow-md">
                            <span className="text-xl">📅</span>
                            <span className="text-lg font-bold text-gray-800">{dDay}</span>
                        </div>
                    </div>

                    {/* Switch Character Button - Pill Shape */}
                    <button
                        onClick={toggleCharacter}
                        className="group relative flex items-center gap-2 bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-white pl-4 pr-6 py-2 rounded-full border-[3px] border-white shadow-[0px_4px_6px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all"
                    >
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none"></div>

                        <div className="bg-white text-[#06B6D4] rounded-full p-1.5 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m16 3 4 4-4 4" />
                                <path d="M20 7H4" />
                                <path d="m8 21-4-4 4-4" />
                                <path d="M4 17h16" />
                            </svg>
                        </div>
                        <span className="font-black text-lg drop-shadow-md">신랑 ↔ 신부</span>
                    </button>
                </div>

                {/* Right Menu - Glossy App Icons */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-5 pointer-events-auto z-50">
                    <MenuButton type="map" label="지도" color="from-rose-400 to-rose-500" onClick={() => toggleModal('map')} />
                    <MenuButton type="gallery" label="갤러리" color="from-orange-400 to-orange-500" onClick={() => toggleModal('gallery')} />
                    <MenuButton type="recruit" label="뽑기" color="from-emerald-400 to-emerald-500" onClick={() => toggleModal('recruit')} />
                    <MenuButton type="story" label="스토리" color="from-blue-400 to-blue-500" onClick={() => toggleModal('story')} />
                    <MenuButton type="ranking" label="랭킹" color="from-violet-400 to-violet-500" onClick={() => toggleModal('ranking')} />
                    {/* Achievement Button Added Here */}
                    <MenuButton type="achievement" label="업적" color="from-yellow-400 to-yellow-500" onClick={() => toggleModal('achievement')} />
                    <MenuButton type="info" label="정보" color="from-pink-400 to-pink-500" onClick={() => toggleModal('info')} />
                </div>

                {/* Bottom Area */}
                <div className="flex justify-between items-end w-full pointer-events-auto pb-4">
                    {/* Game Button - Big & Attention Grabbing */}
                    <button
                        onClick={() => {
                            toggleModal('game');
                            checkAchievement('GAME_START');
                        }}
                        className="group relative bg-[#F97316] text-white px-6 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-4xl group-hover:rotate-12 transition-transform">🎮</span>
                            <div className="text-left">
                                <p className="text-xs font-bold opacity-90">미니게임</p>
                                <p className="text-2xl font-black">전투 훈련</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleSwitchToV1}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm opacity-80 hover:opacity-100"
                    >
                        ↩ 클래식 모드
                    </button>
                </div>
            </div>

            {/* Modals Container */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Dynamic Modal Content Wrapper - Game Window Style */}
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border-[6px] border-black rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] flex flex-col [&_*]:font-['Jua']">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center bg-[#FFCE00] border-b-[6px] border-black p-4 px-6 relative rounded-t-[1.5rem]">
                            {/* Decorative Dots */}
                            <div className="flex gap-2 absolute left-4">
                                <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                                <div className="w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                            </div>

                            <h2 className="text-3xl font-black text-black w-full text-center tracking-wider">
                                {activeModal === 'map' && '작전 구역 (LOCATION)'}
                                {activeModal === 'gallery' && '기록 보관소 (GALLERY)'}
                                {activeModal === 'game' && '전투 시뮬레이션 (GAME)'}
                                {activeModal === 'story' && '작전 브리핑 (STORY)'}
                                {activeModal === 'recruit' && '동료 영입 (GACHA)'}
                                {activeModal === 'ranking' && '명예의 전당 (RANKING)'}
                                {activeModal === 'info' && '타겟 프로필 (PROFILE)'}
                                {activeModal === 'achievement' && '작전 성과 (MISSION)'}
                            </h2>

                            {/* Close Button - Hanging off the corner */}
                            <button
                                onClick={closeModal}
                                className="absolute -right-6 -top-6 w-16 h-16 bg-[#EF4444] text-white rounded-full border-[4px] border-black font-black text-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#DC2626] hover:scale-110 active:scale-95 transition-transform z-50"
                            >
                                X
                            </button>
                        </div>

                        {/* Modal Content - Scrollable & Forced Font */}
                        <div className="flex-1 overflow-y-auto p-0 bg-white rounded-b-[1.5rem] [&_.font-serif]:font-['Jua'] [&_.font-body]:font-['Jua']">
                            {activeModal === 'map' && <Location />}
                            {activeModal === 'gallery' && <Gallery />}
                            {activeModal === 'info' && <CoupleCards />}
                            {activeModal === 'game' && (
                                <div className="flex justify-center bg-gray-100 py-8 min-h-[400px]">
                                    <DinoGame selectedCharacter={character} />
                                </div>
                            )}
                            {activeModal === 'story' && <StoryMode onClose={closeModal} />}
                            {activeModal === 'recruit' && <Recruit />}
                            {activeModal === 'ranking' && <RankingBoard />}
                            {activeModal === 'achievement' && <AchievementBoard />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Modern Glossy App Icon Component
const MenuButton = ({ type, label, color, onClick }) => (
    <div className="group relative flex items-center justify-end cursor-pointer" onClick={onClick}>
        {/* Label Tooltip - Pops out on left */}
        <div className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
            <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                {label}
            </span>
        </div>

        {/* Button Body */}
        <div className={`
            w-16 h-16 rounded-2xl bg-gradient-to-br ${color}
            border-[3px] border-white shadow-[0px_4px_6px_rgba(0,0,0,0.3),inset_0px_2px_4px_rgba(255,255,255,0.5)]
            flex items-center justify-center relative overflow-hidden
            group-hover:scale-110 group-hover:-rotate-3 group-active:scale-95 transition-all duration-200
            z-10
        `}>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

            {/* Icon */}
            <div className="relative z-10 text-white drop-shadow-md">
                {MenuIcons[type]}
            </div>
        </div>
    </div>
);

const MenuIcons = {
    map: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    gallery: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    ),
    recruit: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9Z" />
            <path d="M11 3 8 9l4 13 4-13-3-6" />
            <path d="M2 9h20" />
        </svg>
    ),
    story: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
            <path d="M19 4c0-1.1-.9-2-2-2A2 2 0 0 0 15 4a2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
        </svg>
    ),
    ranking: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    ),
    achievement: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
    ),
    info: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
};

export default LobbyScreen;
