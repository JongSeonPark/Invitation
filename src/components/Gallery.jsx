import { useState, useEffect, useRef } from 'react';

// Vite의 기능을 이용해 images 폴더의 모든 jpg/png 파일을 자동으로 가져옵니다.
const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', { eager: true });
const images = Object.values(imageModules).map(module => module.default);

const Gallery = () => {
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
    }, []);

    // Also reload whenever the modal is opened (simple check could be done better, but this works)
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('wedding_collection') || '[]');
        setUnlockedIndices(saved);
    }, [images]); // trigger on mount

    return (
        <section id="gallery" style={styles.section}>
            <h2 style={styles.title}>GALLERY ({unlockedIndices.length}/{images.length})</h2>
            <div ref={scrollRef} style={styles.scrollContainer}>
                {images.map((src, index) => {
                    const isUnlocked = unlockedIndices.includes(index);
                    return (
                        <div key={index} style={styles.imageWrapper} onClick={() => isUnlocked && setSelectedImage(src)}>
                            <img
                                src={src}
                                alt={`Gallery ${index + 1}`}
                                style={{
                                    ...styles.image,
                                    filter: isUnlocked ? 'none' : 'blur(10px) grayscale(100%)',
                                    cursor: isUnlocked ? 'pointer' : 'not-allowed'
                                }}
                            />
                            {!isUnlocked && (
                                <div style={styles.lockOverlay}>
                                    <span style={{ fontSize: '2rem' }}>🔒</span>
                                    <span style={{ fontSize: '0.8rem', color: '#fff', marginTop: '5px' }}>잠김</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Scroll indicator dots could go here */}

            {selectedImage && (
                <div style={styles.modal} onClick={() => setSelectedImage(null)}>
                    <div style={styles.modalContent}>
                        <img src={selectedImage} alt="Full view" style={styles.fullImage} />
                    </div>
                </div>
            )}
        </section>
    );
};

const styles = {
    section: {
        padding: '4rem 0',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    title: {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '2rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
    },
    scrollContainer: {
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        padding: '0 2rem 2rem', // Bottom padding for scrollbar
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', // Firefox
    },
    imageWrapper: {
        position: 'relative', // Context for lockOverlay
        flex: '0 0 80%', // Show 80% of image
        scrollSnapAlign: 'center',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    image: {
        width: '100%',
        height: '400px', // Fixed height
        objectFit: 'cover',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        maxWidth: '100%',
        maxHeight: '90vh',
        objectFit: 'contain',
    },
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    }
};

export default Gallery;
