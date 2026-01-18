import { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audioManager';
import { storyData } from '../../data/storyData';
import groomImg from '../../assets/card_images/groom_nobg.png';
import brideImg from '../../assets/card_images/bride_nobg.png';
// ...

const StoryMode = ({ onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentLine = storyData[currentIndex];

    useEffect(() => {
        if (!currentLine) return;

        setDisplayedText('');
        setIsTyping(true);

        let i = 0;
        const text = currentLine.text;
        const speed = 50;

        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        audioManager.playClick();
        if (isTyping) {
            // ...
        } else {
            // Next line
            if (currentIndex < storyData.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // End of story
                audioManager.playConfirm();
                onClose();
            }
        }
    };

    return (
        <div style={styles.container} onClick={handleNext}>
            {/* Background Layer (Optional) */}

            {/* Character Sprite */}
            <div style={styles.spriteParams}>
                {currentLine.image === 'groom' && <img src={groomImg} style={styles.sprite} alt="Groom" />}
                {currentLine.image === 'bride' && <img src={brideImg} style={styles.sprite} alt="Bride" />}
            </div>

            {/* Dialogue Box */}
            <div style={styles.dialogueBox}>
                <div style={styles.nameTag}>
                    {currentLine.speaker}
                </div>
                <p style={styles.text}>{displayedText}</p>
                <div style={styles.indicator}>▼</div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.8)', // Darken background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    spriteParams: {
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '80%',
        display: 'flex',
        alignItems: 'flex-end',
    },
    sprite: {
        height: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))',
    },
    dialogueBox: {
        position: 'relative',
        height: '150px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTop: '2px solid #fff',
        padding: '20px',
        margin: '0',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -5px 20px rgba(0,0,0,0.5)',
    },
    nameTag: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#f0bc5e', // Gold
        marginBottom: '10px',
    },
    text: {
        fontSize: '1rem',
        color: '#fff',
        lineHeight: '1.5',
    },
    indicator: {
        position: 'absolute',
        bottom: '10px',
        right: '20px',
        color: '#fff',
        animation: 'bounce 1s infinite',
    }
};

// CSS for bounce animation
const styleSheet = document.createElement("style");
styleSheet.innerText += `
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
`;
document.head.appendChild(styleSheet);

export default StoryMode;
