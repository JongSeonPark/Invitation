import { useState } from 'react';

const images = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-4.0.3&w=800&q=80',
    'https://images.unsplash.com/photo-1513278974837-77b3b426638b?ixlib=rb-4.0.3&w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-1645062cd495?ixlib=rb-4.0.3&w=800&q=80',
    'https://images.unsplash.com/photo-1529636721637-2b8745a68d71?ixlib=rb-4.0.3&w=800&q=80'
];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section id="gallery" style={styles.section}>
            <h2 style={styles.title}>GALLERY</h2>
            <div style={styles.scrollContainer}>
                {images.map((src, index) => (
                    <div key={index} style={styles.imageWrapper} onClick={() => setSelectedImage(src)}>
                        <img src={src} alt={`Gallery ${index + 1}`} style={styles.image} />
                    </div>
                ))}
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
    }
};

export default Gallery;
