import { useState, useEffect } from 'react';

import { loadWeddingImages } from '../utils/imageLoader';

const images = loadWeddingImages();

const Gallery = ({ forceUnlock = false, rarityFilter = null, showRarity = false }) => {
    // Navigation State
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [direction, setDirection] = useState(0); // -1: Left, 1: Right
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);

    // Unlock Logic (Game Mode)
    const [unlockedIndices, setUnlockedIndices] = useState([]);

    useEffect(() => {
        const updateUnlockStatus = () => {
            if (forceUnlock) return; // No need to check storage if force unlocked
            try {
                const saved = JSON.parse(localStorage.getItem('wedding_collection_v2') || '[]');
                setUnlockedIndices(saved);
            } catch (e) {
                console.error("Error loading collection:", e);
                setUnlockedIndices([]);
            }
        };

        updateUnlockStatus();

        // Listen for updates (e.g. from Gacha)
        window.addEventListener('collectionUpdated', updateUnlockStatus);
        return () => window.removeEventListener('collectionUpdated', updateUnlockStatus);
    }, [forceUnlock]);

    // Filtered images list for navigation
    const filteredImages = images
        .filter(img => !rarityFilter || img.rarity === rarityFilter)
        .sort((a, b) => {
            const rarityOrder = { 'SSR': 3, 'SR': 2, 'R': 1 };
            const rarityA = a.rarity.includes('SSR') ? 'SSR' : a.rarity.includes('SR') ? 'SR' : 'R';
            const rarityB = b.rarity.includes('SSR') ? 'SSR' : b.rarity.includes('SR') ? 'SR' : 'R';
            const rarityDiff = rarityOrder[rarityA] - rarityOrder[rarityB];
            if (rarityDiff !== 0) return rarityDiff;
            return a.path.localeCompare(b.path);
        });

    const handleNext = (e) => {
        e?.stopPropagation();
        setDirection(1);
        setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
    };

    const handlePrev = (e) => {
        e?.stopPropagation();
        setDirection(-1);
        setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    // Touch Events
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    // Mouse Drag Events
    const onMouseDown = (e) => {
        setIsDragging(true);
        setDragStart(e.clientX);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent image dragging
    };

    const onMouseUp = (e) => {
        if (!isDragging || dragStart === null) return;
        const distance = dragStart - e.clientX;
        if (distance > 50) handleNext();
        else if (distance < -50) handlePrev();
        setIsDragging(false);
        setDragStart(null);
    };

    const onMouseLeave = () => {
        if (isDragging) setIsDragging(false);
    };

    // Find filtered index when clicking a grid item
    const handleImageClick = (imgSrc) => {
        const index = filteredImages.findIndex(img => img.src === imgSrc);
        if (index !== -1) {
            setDirection(0); // No animation for initial open
            setSelectedIndex(index);
        }
    };

    return (
        <section id="gallery" className="py-20 bg-background relative overflow-hidden">
            {/* Background elements - unchanged */}
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

                <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                    {filteredImages.map((img, index) => {
                        const isUnlocked = forceUnlock || unlockedIndices.includes(img.path);
                        const currentRarity = img.rarity.includes('SSR') ? 'SSR' : img.rarity.includes('SR') ? 'SR' : 'R';

                        // Styles definitions...
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
                        const badgeIcon = { SSR: "👑", SR: "💎", R: "🏷️" };

                        return (
                            <div
                                key={img.path}
                                className={`
                                    group relative rounded-2xl overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-1 bg-white
                                    ${showRarity && isUnlocked ? `border-[3px] ${rarityBorder[currentRarity]}` : ''}
                                `}
                                onClick={() => isUnlocked && handleImageClick(img.src)}
                            >
                                {/* Rarity Badge */}
                                {showRarity && (
                                    <div className={`
                                        absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full border shadow-sm text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm
                                        ${badgeColor[currentRarity]}
                                        ${!isUnlocked && 'opacity-80 grayscale-[30%]'} 
                                    `}>
                                        <span>{badgeIcon[currentRarity]}</span>
                                        <span>{currentRarity}</span>
                                    </div>
                                )}

                                <div className="relative overflow-hidden aspect-square">
                                    <img
                                        src={img.src}
                                        alt={`Gallery ${index + 1}`}
                                        className={`w-full h-full object-cover transition-all duration-700 
                                            ${isUnlocked
                                                ? 'cursor-pointer hover:scale-110 filter brightness-100'
                                                : 'blur-xl grayscale contrast-125 cursor-not-allowed opacity-50'
                                            }
                                        `}
                                        loading="lazy"
                                    />
                                    {isUnlocked && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />}
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

            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/95 backdrop-blur-md p-0 animate-in fade-in duration-200"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div
                        className="relative w-full h-full flex items-center justify-center group"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking image area
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                    >
                        {/* Prev Button */}
                        <button
                            className="absolute left-4 z-[1002] p-4 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95 hidden md:block"
                            onClick={handlePrev}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <img
                            key={selectedIndex} // Triggers animation on change
                            src={filteredImages[selectedIndex].src}
                            alt="Full view"
                            className={`
                                max-w-full max-h-[100vh] object-contain select-none pointer-events-none md:pointer-events-auto
                                ${direction === 1 ? 'animate-slide-in-right' : direction === -1 ? 'animate-slide-in-left' : ''}
                            `}
                            draggable="false"
                        />

                        {/* Next Button */}
                        <button
                            className="absolute right-4 z-[1002] p-4 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-95 hidden md:block"
                            onClick={handleNext}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <button
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-[1002] p-2"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Index Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-mono text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm z-[1002]">
                        {selectedIndex + 1} / {filteredImages.length}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
