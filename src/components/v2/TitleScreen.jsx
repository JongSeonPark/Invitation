import { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audioManager';

const TitleScreen = ({ onStart }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loadingText, setLoadingText] = useState('청첩장 서버 접속 중...');

    const handleTouch = () => {
        if (isLoggingIn) return;

        // Initialize Audio Context on first interaction
        audioManager.init();
        audioManager.playConfirm();

        setIsLoggingIn(true);

        // Simulation of "Login" sequence
        setTimeout(() => setLoadingText('신랑의 긴장도 체크 중... 위험 수치! 💓'), 800);
        setTimeout(() => setLoadingText('신부의 미모 데이터 로딩 중... 용량 초과! ✨'), 1800);
        setTimeout(() => setLoadingText('축의금 계좌 보안 프로토콜 가동... 💸'), 2800);
        setTimeout(() => setLoadingText('환영합니다. 작전명 [백년가약] 개시.'), 3800);
        setTimeout(() => {
            onStart();
        }, 4500);
    };

    return (
        <div style={styles.container} onClick={handleTouch}>
            {/* Background Effect */}
            <div style={styles.bgOverlay}></div>

            <div style={styles.content}>
                <h1 style={styles.title}>
                    <span style={styles.titleSmall}>WEDDING OPERATION</span><br />
                    CODE: LOVE
                </h1>

                {!isLoggingIn ? (
                    <p style={styles.touchText}>TAP TO START</p>
                ) : (
                    <div style={styles.loadingBox}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>{loadingText}</p>
                    </div>
                )}

                <p style={styles.version}>VER. 2026.4.25</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        fontFamily: '"Rajdhani", sans-serif', // Sci-fi font if available
    },
    bgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, #2b1055, #7597de)',
        opacity: 0.3,
        zIndex: 0,
    },
    content: {
        zIndex: 1,
        textAlign: 'center',
        width: '100%',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        letterSpacing: '2px',
        marginBottom: '4rem',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.7)',
        lineHeight: '0.9',
    },
    titleSmall: {
        fontSize: '1rem',
        color: '#00eaff',
        letterSpacing: '5px',
    },
    touchText: {
        fontSize: '1.2rem',
        animation: 'blink 1.5s infinite',
        color: '#ccc',
        letterSpacing: '2px',
    },
    loadingBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        height: '50px', // Prevent layout jump
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid #00eaff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        fontSize: '0.9rem',
        color: '#00eaff',
        fontFamily: 'monospace',
    },
    version: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        fontSize: '0.7rem',
        color: '#555',
    }
};

// Add global styles for animations locally
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default TitleScreen;
