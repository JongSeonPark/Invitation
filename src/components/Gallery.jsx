import { useState, useEffect, useRef } from 'react';

// Vite의 기능을 이용해 images 폴더의 모든 jpg/png 파일을 자동으로 가져옵니다.
const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', { eager: true });
const images = Object.values(imageModules).map(module => module.default);

const Gallery = ({ forceUnlock = false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const scrollRef = useRef(null);

    // 이미지가 없을 경우를 대비한 방어 코드
    if (images.length === 0) {
        return null;
    }

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            };
            el.addEventListener('wheel', onWheel);
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, []);

    // Load collection status
    const [unlockedIndices, setUnlockedIndices] = useState([]);

    useEffect(() => {
        if (forceUnlock) return; // Don't need to load if forced

        const loadCollection = () => {
            const saved = JSON.parse(localStorage.getItem('wedding_collection') || '[]');
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
        const saved = JSON.parse(localStorage.getItem('wedding_collection') || '[]');
        setUnlockedIndices(saved);
    }, [images, forceUnlock]); // trigger on mount

    return (
        <section id="gallery" className="py-20 bg-white text-center overflow-hidden">
            <h2 className="text-sm text-primary tracking-[0.2em] font-bold mb-8 uppercase">
                GALLERY {forceUnlock ? '' : `(${unlockedIndices.length}/${images.length})`}
            </h2>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-8 pb-8 scrollbar-hide"
            >
                {images.map((src, index) => {
                    const isUnlocked = forceUnlock || unlockedIndices.includes(index);
                    return (
                        <div
                            key={index}
                            className="relative flex-none w-[85vw] md:w-[600px] snap-center rounded-xl overflow-hidden shadow-soft-md transition-transform hover:scale-[1.02] duration-300"
                            onClick={() => isUnlocked && setSelectedImage(src)}
                        >
                            <div className="w-full aspect-[3/4] md:aspect-[16/9]">
                                <img
                                    src={src}
                                    alt={`Gallery ${index + 1}`}
                                    className={`w-full h-full object-cover transition-all duration-500 ${isUnlocked ? 'cursor-pointer hover:brightness-110' : 'blur-xl grayscale cursor-not-allowed'}`}
                                />
                            </div>

                            {!isUnlocked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white z-10 backdrop-blur-sm">
                                    <span className="text-4xl mb-2">🔒</span>
                                    <span className="text-sm font-medium tracking-wider">LOCKED</span>
                                </div>
                            )}
                        </div>
                    );
                })}
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
