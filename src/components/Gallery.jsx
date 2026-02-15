import { useState, useEffect } from 'react';

import { loadWeddingImages } from '../utils/imageLoader';

const images = loadWeddingImages();

const Gallery = ({ forceUnlock = false, rarityFilter = null, showRarity = false }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // 이미지가 없을 경우를 대비한 방어 코드
    if (images.length === 0) {
        return null;
    }

    // Load collection status
    const [unlockedIndices, setUnlockedIndices] = useState([]);

    useEffect(() => {
        if (forceUnlock) return; // Don't need to load if forced

        const loadCollection = () => {
            const saved = JSON.parse(localStorage.getItem('wedding_collection_v2') || '[]');
            setUnlockedIndices(saved);
        };
        loadCollection();

        // Listen for storage events (in case updated from Recruit)
        window.addEventListener('storage', loadCollection);
        // Custom event for same-window updates
        window.addEventListener('collectionUpdated', loadCollection);

        return () => {
            window.removeEventListener('storage', loadCollection);
            window.removeEventListener('collectionUpdated', loadCollection);
        };
    }, [forceUnlock]);

    // Also reload whenever the modal is opened (simple check could be done better, but this works)
    useEffect(() => {
        if (forceUnlock) return;
        const saved = JSON.parse(localStorage.getItem('wedding_collection_v2') || '[]');
        setUnlockedIndices(saved);
    }, [images, forceUnlock]); // trigger on mount

    return (
        <section id="gallery" className="py-20 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-3xl md:text-4xl text-primary font-classic font-bold mb-4 text-center animate-fade-in-up">
                    우리의 순간
                </h2>
                <p className="text-text/60 text-center font-body mb-12 tracking-widest uppercase text-sm animate-fade-in-up delay-100 font-classic">
                    소중한 추억 {forceUnlock ? '' : `(${unlockedIndices.length}/${images.length})`}
                </p>

                <div className="columns-3 gap-2 md:gap-4 lg:gap-6 space-y-2 md:space-y-4 lg:space-y-6">
                    {images
                        .filter(img => !rarityFilter || img.rarity === rarityFilter)
                        .sort((a, b) => {
                            const rarityOrder = { 'SSR': 3, 'SR': 2, 'R': 1 };
                            const rarityA = a.rarity.includes('SSR') ? 'SSR' : a.rarity.includes('SR') ? 'SR' : 'R';
                            const rarityB = b.rarity.includes('SSR') ? 'SSR' : b.rarity.includes('SR') ? 'SR' : 'R';
                            // Sort R -> SR -> SSR (Ascending order of value) - User request
                            return rarityOrder[rarityA] - rarityOrder[rarityB];
                        })
                        .map((img, index) => {
                            const isUnlocked = forceUnlock || unlockedIndices.includes(img.path);

                            // Define styles based on rarity (only if showRarity is true)
                            const currentRarity = img.rarity.includes('SSR') ? 'SSR' : img.rarity.includes('SR') ? 'SR' : 'R';

                            const rarityBorder = {
                                SSR: "border-yellow-400 ring-2 ring-yellow-400/50 shadow-md",
                                SR: "border-blue-400 ring-1 ring-blue-400/30",
                                R: "border-stone-400"
                            };

                            const badgeColor = {
                                SSR: "bg-yellow-400 text-black border-yellow-200",
                                SR: "bg-blue-500 text-white border-blue-300",
                                R: "bg-stone-500 text-white border-stone-400"
                            };

                            const badgeIcon = {
                                SSR: "👑",
                                SR: "💎",
                                R: "🏷️"
                            };

                            return (
                                <div
                                    key={img.path}
                                    className={`
                                        break-inside-avoid group relative rounded-2xl overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-1 bg-white
                                        ${showRarity && isUnlocked ? `border-[3px] ${rarityBorder[currentRarity]}` : ''}
                                    `}
                                    onClick={() => isUnlocked && setSelectedImage(img.src)}
                                >
                                    {/* Rarity Badge - Show even if locked */}
                                    {showRarity && (
                                        <div className={`
                                            absolute top-2 right-2 z-20 
                                            px-2 py-0.5 rounded-full border shadow-sm
                                            text-[10px] font-bold flex items-center gap-1
                                            backdrop-blur-sm
                                            ${badgeColor[currentRarity]}
                                            ${!isUnlocked && 'opacity-80 grayscale-[30%]'} 
                                        `}>
                                            <span>{badgeIcon[currentRarity]}</span>
                                            <span>{currentRarity}</span>
                                        </div>
                                    )}

                                    <div className="relative overflow-hidden">
                                        <img
                                            src={img.src}
                                            alt={`Gallery ${index + 1}`}
                                            className={`w-full h-auto object-cover transition-all duration-700 
                                                ${isUnlocked
                                                    ? 'cursor-pointer hover:scale-105 filter brightness-100'
                                                    : 'blur-xl grayscale contrast-125 cursor-not-allowed opacity-50'
                                                }
                                            `}
                                            loading="lazy"
                                        />

                                        {/* Overlay for Unlocked Images */}
                                        {isUnlocked && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                                        )}

                                        {/* Lock Overlay */}
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-10 backdrop-blur-[2px]">
                                                <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                    <span className="text-2xl">🔒</span>
                                                </div>
                                                <span className="text-white font-bold tracking-widest mt-2 drop-shadow-md text-xs uppercase bg-black/20 px-3 py-1 rounded-full">Locked</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Full view"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    />
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    );
};

export default Gallery;
