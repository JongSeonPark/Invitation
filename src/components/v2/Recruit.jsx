import { useState } from 'react';
import { createPortal } from 'react-dom';
import { audioManager } from '../../utils/audioManager';
import { spendDiamonds } from '../../utils/currencyManager';

// Import image loader
import { loadWeddingImages as loadImages } from '../../utils/imageLoader';

const images = loadImages();

// Probability Settings
const GACHA_PROBABILITY = {
    SSR: 0.1, // 10%
    SR: 0.3,  // 30%
    R: 0.6    // 60%
};

const Recruit = () => {
    const [results, setResults] = useState([]); // Array of { image, rarity }
    const [isAnimating, setIsAnimating] = useState(false);

    const handleRecruit = async (count) => {
        if (isAnimating || images.length === 0) return;

        // Check & Spend Diamonds
        audioManager.playClick();
        const success = await spendDiamonds(count);

        if (!success) {
            alert(`다이아가 부족합니다! ${count}개가 필요합니다! 💎`);
            return;
        }

        setIsAnimating(true);
        setResults([]);

        // Animation Sequence (2 seconds)
        setTimeout(() => {
            const newResults = [];

            for (let i = 0; i < count; i++) {
                // 1. Determine Rarity
                const rand = Math.random();
                let targetRarity = 'R';
                if (rand < GACHA_PROBABILITY.SSR) targetRarity = 'SSR';
                else if (rand < GACHA_PROBABILITY.SSR + GACHA_PROBABILITY.SR) targetRarity = 'SR';

                // 2. Filter available images for this rarity
                let pool = images.filter(img => img.rarity === targetRarity);

                // Fallback (if pool is empty, downgrade)
                if (pool.length === 0) {
                    targetRarity = 'SR';
                    pool = images.filter(img => img.rarity === targetRarity);
                }
                if (pool.length === 0) {
                    targetRarity = 'R';
                    pool = images.filter(img => img.rarity === targetRarity);
                }
                // If still empty (no images at all), skip or handle error. 
                // Assuming R has images.

                const randomImage = pool[Math.floor(Math.random() * pool.length)];

                // Save to Collection (by Path)
                const savedCollection = JSON.parse(localStorage.getItem('wedding_collection_v2') || '[]');
                if (!savedCollection.includes(randomImage.path)) {
                    savedCollection.push(randomImage.path);
                    localStorage.setItem('wedding_collection_v2', JSON.stringify(savedCollection));
                }

                // Push result
                newResults.push({
                    image: randomImage.src,
                    rarity: targetRarity === 'SSR' ? 'SSR/최고' : targetRarity === 'SR' ? 'SR/희귀' : 'R/보통',
                    originalRarity: targetRarity
                });
            }

            // Trigger collection update event once if new items found
            window.dispatchEvent(new Event('collectionUpdated'));

            setResults(newResults);
            setIsAnimating(false);
            audioManager.playConfirm();
        }, 2000);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background relative overflow-hidden font-body p-4 select-none">
            {/* Background Pattern */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

            {results.length === 0 && !isAnimating && (
                <div className="z-10 flex flex-col items-center w-full max-w-sm animate-in zoom-in duration-500 font-['Silkscreen']">
                    <div className="mb-4 text-center bg-black/60 backdrop-blur-md border-[6px] border-white px-8 py-6 rounded-2xl shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                        <h2 className="text-3xl text-yellow-400 mb-2 drop-shadow-md tracking-wider font-['Silkscreen']">LUCKY DRAW</h2>
                        <p className="text-white text-sm">다이아몬드를 사용해 추억을 모아보세요!</p>
                    </div>

                    <div className="relative group cursor-pointer mb-8 animate-float">
                        {/* Gacha Orb / Machine Visual */}
                        <div className="w-48 h-48 bg-gradient-to-tr from-purple-600 to-indigo-400 rounded-full border-[8px] border-white shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center justify-center animate-pulse group-hover:scale-105 transition-transform">
                            <span className="text-8xl drop-shadow-lg">🔮</span>
                            <div className="absolute top-4 right-8 w-8 h-8 bg-white/40 rounded-full blur-sm"></div>
                        </div>
                    </div>

                    {/* Button Group */}
                    <div className="flex gap-4 w-full justify-center px-4">
                        {/* 1x Button */}
                        <button
                            onClick={() => handleRecruit(1)}
                            className="flex-1 bg-blue-600 border-4 border-white text-white py-4 rounded-xl shadow-[4px_4px_0_black] hover:translate-y-1 hover:shadow-[2px_2px_0_black] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center gap-1"
                        >
                            <span className="text-xl font-bold">1회 뽑기</span>
                            <div className="bg-black/30 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                💎 1
                            </div>
                        </button>

                        {/* 10x Button */}
                        <button
                            onClick={() => handleRecruit(10)}
                            className="flex-1 bg-yellow-500 border-4 border-white text-white py-4 rounded-xl shadow-[4px_4px_0_black] hover:translate-y-1 hover:shadow-[2px_2px_0_black] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center gap-1"
                        >
                            <span className="text-xl font-bold text-black drop-shadow-md">10회 뽑기</span>
                            <div className="bg-black/30 px-3 py-1 rounded-full text-xs flex items-center gap-1 text-white">
                                💎 10
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {isAnimating && (
                <div className="z-10 flex flex-col items-center justify-center font-['Silkscreen']">
                    {/* Shaking Animation */}
                    <div className="text-9xl mb-8 animate-[spin_0.5s_linear_infinite] grayscale brightness-150">
                        🔮
                    </div>
                    <p className="text-3xl text-white animate-pulse drop-shadow-[4px_4px_0_black]">
                        소환 중...
                    </p>
                </div>
            )}

            {/* Result Overlay */}
            {results.length > 0 && !isAnimating && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-['Silkscreen'] bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setResults([])}>

                    {/* Ray of Light Effect (CSS) */}
                    <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 to-transparent pointer-events-none animate-pulse"></div>

                    <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <h2 className="text-4xl text-yellow-400 mb-8 drop-shadow-[0_4px_0_black] animate-bounce text-center">
                            {results.length > 1 ? '🎉 10회 소환 결과 🎉' : '✨ 새로운 추억 발견 ✨'}
                        </h2>

                        {/* Grid for 10x, Single for 1x */}
                        <div className={`
                            ${results.length > 1
                                ? 'grid grid-cols-2 md:grid-cols-5 gap-4 p-4'
                                : 'flex justify-center p-4'}
                        `}>
                            {results.map((item, idx) => (
                                <div key={idx} className={`
                                    relative bg-white p-2 rounded-lg shadow-lg border-[4px]
                                    ${item.rarity === 'SSR' ? 'border-yellow-400 ring-4 ring-yellow-400/50' : item.rarity === 'SR' ? 'border-purple-400' : 'border-gray-400'}
                                    flex flex-col items-center transform transition-transform hover:scale-105 duration-200
                                    ${results.length === 1 ? 'scale-125 p-4 border-[8px]' : ''}
                                `}>
                                    {/* Badge */}
                                    <div className="absolute -top-3 -right-3 z-10">
                                        {item.rarity === 'SSR' && <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-md">SSR</span>}
                                        {item.rarity === 'SR' && <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-md">SR</span>}
                                        {item.rarity === 'R' && <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-md">R</span>}
                                    </div>

                                    <img
                                        src={item.image}
                                        alt="Result"
                                        className={`object-cover bg-gray-900 border-2 border-black
                                            ${results.length > 1 ? 'w-24 h-32 md:w-32 md:h-40' : 'w-64 h-80'}
                                        `}
                                    />

                                    {results.length === 1 && (
                                        <div className="mt-4 text-xl text-black font-bold tracking-widest uppercase text-center">
                                            {item.rarity === 'SSR' ? '잊지 못할 순간' : '사랑스러운 날'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 w-full justify-center pb-8">
                            <button
                                onClick={() => setResults([])}
                                className="px-8 py-3 bg-gray-600 text-white border-4 border-white hover:bg-gray-500 active:scale-95 transition-all shadow-[4px_4px_0_black]"
                            >
                                닫기
                            </button>
                            <button
                                onClick={() => handleRecruit(results.length)}
                                className="px-8 py-3 bg-blue-600 text-white border-4 border-white hover:bg-blue-500 active:scale-95 transition-all shadow-[4px_4px_0_black] flex items-center gap-2"
                            >
                                <span>💎</span> 다시하기 ({results.length}회)
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
