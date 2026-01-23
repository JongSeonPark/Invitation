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
        <div className="w-full h-full flex flex-col items-center justify-center bg-background relative overflow-hidden font-body p-4 select-none">
            {/* Background Pattern */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

            {!result && !isAnimating && (
                <div className="z-10 flex flex-col items-center w-full max-w-sm animate-in zoom-in duration-500">
                    <div className="mb-8 text-center bg-white/50 backdrop-blur-md border border-white/60 px-8 py-6 rounded-[2.5rem] shadow-soft-lg">
                        <h2 className="text-3xl font-heading text-primary mb-2">Collect Memories</h2>
                        <p className="text-text/60 font-body text-lg">Discover a special moment</p>
                    </div>

                    <button
                        onClick={handleRecruit}
                        className="group relative w-24 h-24 bg-gradient-to-br from-white to-gray-50 text-primary rounded-full shadow-soft-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/60"
                        title="Open Memory"
                    >
                        <span className="text-4xl group-hover:rotate-12 transition-transform duration-300">📷</span>
                        <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    <p className="mt-8 text-sm text-text/40 font-body tracking-widest uppercase">
                        Tap camera to collect
                    </p>
                </div>
            )}

            {isAnimating && (
                <div className="z-10 flex flex-col items-center justify-center animate-pulse">
                    <div className="text-6xl mb-4 animate-[bounce_1s_infinite]">🌸</div>
                    <p className="text-2xl font-heading text-primary">Developing...</p>
                </div>
            )}

            {/* Result Overlay */}
            {result && !isAnimating && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-body">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setResult(null)}></div>

                    {/* Card Container */}
                    <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-500">
                        {/* Polaroid Frame */}
                        <div className="bg-white p-4 pb-16 rounded shadow-2xl transform rotate-1 border border-gray-100 max-w-[90vw] max-h-[70vh] flex flex-col items-center relative transition-transform hover:rotate-0 duration-300">
                            <img src={result} alt="Result" className="w-[300px] h-[300px] object-cover bg-gray-100 shadow-inner" />

                            <div className="absolute bottom-6 font-handwriting text-2xl text-gray-600 rotate-[-2deg]">
                                {rarity === 'SSR' ? 'Unforgettable Moment' : 'Lovely Day'}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setResult(null)}
                                className="px-8 py-3 bg-white/80 backdrop-blur text-text rounded-full font-medium border border-white/60 shadow-soft-md hover:bg-white transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleRecruit}
                                className="px-8 py-3 bg-primary text-white rounded-full font-medium shadow-soft-lg hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <span>📷</span> One More
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
