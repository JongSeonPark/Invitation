import { useState } from 'react';
import { createPortal } from 'react-dom';
import { audioManager } from '../../utils/audioManager';

// Import images exactly like Gallery.jsx
const imageModules = import.meta.glob('../../assets/images/*.{jpg,jpeg,png,webp}', { eager: true });
const images = Object.values(imageModules).map(module => module.default);

const Recruit = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState(null);
    const [rarity, setRarity] = useState(null);

    const handleRecruit = () => {
        if (isAnimating || images.length === 0) return;

        audioManager.playClick();
        setIsAnimating(true);
        setResult(null);

        // Animation Sequence (2 seconds)
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
            audioManager.playConfirm();
        }, 2000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FCD34D] relative overflow-hidden font-['Jua'] p-4">
            {/* Background Pattern (Sunburst) */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    background: 'repeating-conic-gradient(#F59E0B 0deg 15deg, transparent 15deg 30deg)'
                }}
            ></div>

            {!result && !isAnimating && (
                <div className="z-10 flex flex-col items-center w-full max-w-sm animate-in zoom-in duration-300">
                    <div className="mb-8 text-center bg-white border-4 border-black px-8 py-4 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
                        <h2 className="text-3xl font-black text-black m-0">📷 사진 뽑기</h2>
                        <p className="text-gray-500 font-bold mt-1 text-sm">오늘의 운세는 과연?</p>
                    </div>

                    <button
                        onClick={handleRecruit}
                        className="group relative w-64 h-24 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full border-[6px] border-black shadow-[0px_8px_0px_0px_#1E40AF,0px_15px_10px_rgba(0,0,0,0.4)] active:translate-y-[8px] active:shadow-[0px_0px_0px_0px_#1E40AF] transition-all"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-4xl filter drop-shadow animate-bounce">💎</span>
                            <span className="text-3xl font-black tracking-widest">1회 소환</span>
                        </div>
                        {/* Shine Effect */}
                        <div className="absolute top-2 left-4 w-56 h-8 bg-white opacity-20 rounded-full"></div>
                    </button>

                    <p className="mt-10 text-sm font-bold text-black/60 bg-white/50 px-4 py-1 rounded-full border border-black/10">
                        * 중복 획득 시 마일리지가...는 없습니다.
                    </p>
                </div>
            )}

            {isAnimating && (
                <div className="z-10 flex flex-col items-center justify-center animate-pulse">
                    <div className="text-8xl mb-4 animate-[bounce_0.5s_infinite]">✉️</div>
                    <p className="text-2xl font-black text-black">두근두근...</p>
                </div>
            )}

            {/* Result Overlay */}
            {result && !isAnimating && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ fontFamily: 'Jua' }}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setResult(null)}></div>

                    {/* Card Container */}
                    <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                        {/* Glow Effect behind card */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-${rarity === 'SSR' ? 'yellow' : rarity === 'SR' ? 'pink' : 'blue'}-500 blur-3xl opacity-50 rounded-full animate-pulse`}></div>

                        {/* Polaroid Frame */}
                        <div className="bg-white p-4 pb-12 rounded-lg shadow-2xl transform rotate-1 border-4 border-gray-200 max-w-[90vw] max-h-[70vh] flex flex-col items-center">
                            {/* Rarity & New Badge */}
                            <div className="absolute -top-6 -left-6 z-20">
                                <span className={`
                                    inline-block px-4 py-2 rounded-full border-4 border-black text-white font-black text-xl shadow-lg transform -rotate-12
                                    ${rarity === 'SSR' ? 'bg-[#F59E0B]' : rarity === 'SR' ? 'bg-[#EC4899]' : 'bg-[#3B82F6]'}
                                `}>
                                    {rarity} RANK
                                </span>
                            </div>

                            <img src={result} alt="Result" className="w-[300px] h-[300px] object-cover rounded border border-gray-100 bg-gray-100" />

                            <h3 className="mt-4 text-2xl font-black text-gray-800 text-center w-full">
                                {rarity === 'SSR' ? '✨ 전설적인 순간 ✨' : rarity === 'SR' ? '💖 달콤한 기억' : '📷 찰칵!'}
                            </h3>

                            <div className="absolute bottom-4 right-4 text-gray-400 font-serif text-sm">
                                2026.04.25
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setResult(null)}
                                className="px-8 py-3 bg-gray-600 text-white rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all"
                            >
                                닫기
                            </button>
                            <button
                                onClick={handleRecruit}
                                className="px-8 py-3 bg-[#3B82F6] text-white rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <span>💎</span> 다시 뽑기
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Recruit;
