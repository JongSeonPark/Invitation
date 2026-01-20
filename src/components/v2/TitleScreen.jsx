import { useState } from 'react';
import { audioManager } from '../../utils/audioManager';
import { auth, db } from '../../firebase';
import { signInAnonymously, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { checkAchievement } from '../../utils/achievementManager';

const TitleScreen = ({ onStart }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [nickname, setNickname] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleTouch = () => {
        if (showInput || isLoggingIn) return;

        audioManager.init();
        audioManager.playConfirm();
        setShowInput(true);
    };

    const handleLogin = async (e) => {
        if (e) e.stopPropagation(); // Prevent bubbling to container click
        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요!");
            return;
        }

        audioManager.playConfirm();
        setIsLoggingIn(true);
        setLoadingText('서버 접속 중...');

        try {
            // 1. Anonymous Login
            const result = await signInAnonymously(auth);
            const user = result.user;

            // 2. Update Profile Name
            await updateProfile(user, { displayName: nickname });

            // 3. Save to Firestore (Merge to keep existing achievements)
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: nickname,
                lastLoginAt: serverTimestamp(), // Changed to 'lastLoginAt' to track activity
            }, { merge: true });

            // Trigger Achievement
            checkAchievement('LOGIN');

            // 4. Loading Sequence
            setLoadingText('신랑의 긴장도 체크 중... 위험 수치! 💓');
            setTimeout(() => setLoadingText('신부의 미모 데이터 로딩 중... 용량 초과! ✨'), 800);
            setTimeout(() => setLoadingText('축의금 계좌 보안 프로토콜 가동... 💸'), 1600);
            setTimeout(() => setLoadingText('환영합니다. 작전명 [백년가약] 개시.'), 2400);

            setTimeout(() => {
                onStart();
            }, 3000);

        } catch (error) {
            console.error("Login Failed:", error);
            setLoadingText('접속 실패. 다시 시도해주세요.');
            setIsLoggingIn(false);
            alert("접속 중 오류가 발생했습니다: " + error.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
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

                {!showInput && !isLoggingIn && (
                    <p style={styles.touchText}>TAP TO START</p>
                )}

                {showInput && !isLoggingIn && (
                    <div style={styles.loginBox} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyPress={handleKeyPress}
                            style={styles.input}
                            maxLength={8}
                            autoFocus
                        />
                        <button style={styles.startBtn} onClick={handleLogin}>
                            START MISSION
                        </button>
                    </div>
                )}

                {isLoggingIn && (
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
        fontFamily: '"Rajdhani", sans-serif',
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        letterSpacing: '2px',
        marginBottom: '3rem', // Adjusted margin
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
    loginBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        animation: 'fadeIn 0.5s ease-out',
    },
    input: {
        padding: '10px 15px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '2px solid #00eaff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        textAlign: 'center',
        outline: 'none',
        width: '200px',
    },
    startBtn: {
        padding: '10px 20px',
        backgroundColor: '#00eaff',
        color: '#000',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(0, 234, 255, 0.5)',
        transition: 'transform 0.1s',
    },
    loadingBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        height: '60px',
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
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default TitleScreen;
