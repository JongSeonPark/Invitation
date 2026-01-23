import { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        // Auto-play attempt
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // Set initial volume
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.log("Auto-play prevented:", error);
                    setIsPlaying(false);
                });
            }
        }
    }, []);

    return (
        <div style={styles.container}>
            <audio
                ref={audioRef}
                src={`${import.meta.env.BASE_URL}bgm.mp3`}
                loop
            />
            <button onClick={togglePlay} style={styles.button}>
                {isPlaying ? '🎵 끄기' : '🔇 켜기'}
            </button>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
    },
    button: {
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ddd',
        borderRadius: '20px',
        padding: '8px 16px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontFamily: "'Gowun Batang', serif",
    }
};

export default MusicPlayer;
