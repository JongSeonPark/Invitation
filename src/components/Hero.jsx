import { useEffect, useState } from 'react';
import '../index.css';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="hero-section" style={styles.hero}>
            <div className={`fade-in ${isVisible ? 'visible' : ''}`} style={styles.content}>
                <p style={styles.subtitle}>WE ARE GETTING MARRIED</p>
                <h1 style={styles.title}>
                    JongSeon
                    <span style={styles.ampersand}>&</span>
                    Jisu
                </h1>
                <p style={styles.date}>2026. 04. 25. SAT</p>
            </div>
            <div style={styles.scrollIndicator}>
                <span>Scroll Down</span>
            </div>
            <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.5s ease-out, transform 1.5s ease-out;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>
        </section>
    );
};

const styles = {
    hero: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#fff', // Unified White Theme
        background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        position: 'relative',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    content: {
        padding: '2rem',
    },
    subtitle: {
        fontSize: '1rem',
        letterSpacing: '0.2em',
        marginBottom: '1rem',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: '3.5rem',
        lineHeight: '1.2',
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-serif)',
    },
    ampersand: {
        display: 'block',
        fontSize: '2rem',
        fontStyle: 'italic',
        margin: '0.5rem 0',
        color: '#E8D5C8',
    },
    date: {
        fontSize: '1.2rem',
        letterSpacing: '0.1em',
        borderTop: '1px solid rgba(255,255,255,0.5)',
        borderBottom: '1px solid rgba(255,255,255,0.5)',
        padding: '0.5rem 2rem',
        display: 'inline-block',
    },
    scrollIndicator: {
        position: 'absolute',
        bottom: '30px',
        fontSize: '0.8rem',
        opacity: 0.8,
        animation: 'bounce 2s infinite',
    }
};

export default Hero;
