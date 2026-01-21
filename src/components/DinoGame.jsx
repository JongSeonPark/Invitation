import { useEffect, useRef, useState } from 'react';
import groomPixel from '../assets/sprites/groom_pixel.png';
import bridePixel from '../assets/sprites/bride_pixel.png';
import groomRun1 from '../assets/sprites/groom_run1.png';
import groomRun2 from '../assets/sprites/groom_run2.png';
import brideRun1 from '../assets/sprites/bride_run1.png';
import brideRun2 from '../assets/sprites/bride_run2.png';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { checkAchievement } from '../utils/achievementManager';

const DinoGame = ({ selectedCharacter = 'groom' }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);
    const [character, setCharacter] = useState(selectedCharacter);
    const [savedHighScore, setSavedHighScore] = useState(0); // For display feedback
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Sync character if prop changes
    useEffect(() => {
        setCharacter(selectedCharacter);
    }, [selectedCharacter]);

    // Load Images
    const groomImg = useRef(new Image());
    const groomRun1Img = useRef(new Image());
    const groomRun2Img = useRef(new Image());

    const brideImg = useRef(new Image());
    const brideRun1Img = useRef(new Image());
    const brideRun2Img = useRef(new Image());

    useEffect(() => {
        let loaded = 0;
        const totalImages = 6;

        // Helper to remove background based on top-left pixel
        const processImage = (imgSrc) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;

                    // Get background color from top-left pixel
                    const bgR = data[0];
                    const bgG = data[1];
                    const bgB = data[2];

                    // Tolerance for color matching (increased for better coverage)
                    const tolerance = 30;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        if (
                            Math.abs(r - bgR) < tolerance &&
                            Math.abs(g - bgG) < tolerance &&
                            Math.abs(b - bgB) < tolerance
                        ) {
                            data[i + 3] = 0; // Make transparent
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);

                    const processedImg = new Image();
                    processedImg.onload = () => resolve(processedImg);
                    processedImg.src = canvas.toDataURL();
                };
                img.src = imgSrc;
            });
        };

        const loadContent = async () => {
            const assignRef = async (ref, src) => {
                const processed = await processImage(src);
                ref.current = processed;
                loaded++;
                if (loaded >= totalImages) setImagesLoaded(true);
            };

            await Promise.all([
                assignRef(groomImg, groomPixel),
                assignRef(groomRun1Img, groomRun1),
                assignRef(groomRun2Img, groomRun2),
                assignRef(brideImg, bridePixel),
                assignRef(brideRun1Img, brideRun1),
                assignRef(brideRun2Img, brideRun2)
            ]);
        };

        loadContent();

        // Fallback
        const timer = setTimeout(() => {
            if (loaded < totalImages) setImagesLoaded(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Game State Ref
    const gameData = useRef({
        dino: { x: 50, y: 150, w: 40, h: 40, dy: 0, grounded: true },
        obstacles: [],
        frame: 0,
        isGameOver: false,
        animationId: null
    });

    // Save Score Logic
    const saveScore = async (finalScore) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const scoreRef = doc(db, "scores", user.uid);
            const scoreSnap = await getDoc(scoreRef);

            let shouldUpdate = true;
            if (scoreSnap.exists()) {
                const prevData = scoreSnap.data();
                if (prevData.score >= finalScore) {
                    shouldUpdate = false;
                    setSavedHighScore(prevData.score);
                } else {
                    setSavedHighScore(finalScore);
                }
            } else {
                setSavedHighScore(finalScore);
            }

            if (shouldUpdate) {
                await setDoc(scoreRef, {
                    uid: user.uid,
                    displayName: user.displayName || 'Anonymous',
                    score: finalScore,
                    timestamp: serverTimestamp()
                });
                console.log("New High Score Saved!");
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    const resetGame = () => {
        gameData.current = {
            dino: { x: 50, y: 150, w: 40, h: 40, dy: 0, grounded: true },
            obstacles: [],
            frame: 0,
            isGameOver: false,
            animationId: null
        };
        setScore(0);
    };

    const jump = () => {
        if (gameData.current.dino.grounded) {
            gameData.current.dino.dy = -10;
            gameData.current.dino.grounded = false;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let lastTime = performance.now();

        const loop = (time) => {
            if (gameState !== 'PLAYING') return;

            const dt = (time - lastTime) / 16;
            lastTime = time;

            const data = gameData.current;
            data.frame++;

            if (data.frame % 10 === 0) setScore(Math.floor(data.frame / 5));

            // Physics
            data.dino.dy += 0.6 * dt;
            data.dino.y += data.dino.dy * dt;

            // Ground floor logic (Moved up by 2px to avoid line overlap)
            const groundY = canvas.height - 12;

            if (data.dino.y + data.dino.h > groundY) {
                data.dino.y = groundY - data.dino.h;
                data.dino.dy = 0;
                data.dino.grounded = true;
            }

            // Obstacles
            if (data.frame % (100 + Math.floor(Math.random() * 50)) === 0) {
                data.obstacles.push({ x: canvas.width, y: canvas.height - 10 - 20, w: 20, h: 20 });
            }

            data.obstacles.forEach(obs => obs.x -= 5 * dt);
            data.obstacles = data.obstacles.filter(obs => obs.x + obs.w > 0);

            // Collision
            let collided = false;
            data.obstacles.forEach(obs => {
                if (
                    data.dino.x + 10 < obs.x + obs.w - 5 && // Hitbox adjustment
                    data.dino.x + data.dino.w - 10 > obs.x + 5 &&
                    data.dino.y + 5 < obs.y + obs.h - 5 &&
                    data.dino.y + data.dino.h - 5 > obs.y + 5
                ) {
                    collided = true;
                }
            });

            if (collided) {
                setGameState('GAME_OVER');
                data.isGameOver = true;
                const finalScore = Math.floor(data.frame / 5);
                saveScore(finalScore);
                checkAchievement('GAME_SCORE', finalScore);
            }

            draw(ctx, canvas, data);

            if (!data.isGameOver) {
                data.animationId = requestAnimationFrame(loop);
            }
        };

        if (gameState === 'PLAYING') {
            lastTime = performance.now();
            gameData.current.animationId = requestAnimationFrame(loop);
        } else {
            draw(ctx, canvas, gameData.current);
        }

        return () => cancelAnimationFrame(gameData.current.animationId);
    }, [gameState, character, imagesLoaded]);

    // Helper to get current sprite based on state
    const getSprite = (data) => {
        const isGroom = character === 'groom';
        if (gameState !== 'PLAYING' || !data.dino.grounded) {
            return isGroom ? groomImg.current : brideImg.current;
        }

        // Run animation (switch every 10 frames)
        const runFrame = Math.floor(data.frame / 10) % 2;
        if (isGroom) {
            return runFrame === 0 ? groomRun1Img.current : groomRun2Img.current;
        } else {
            return runFrame === 0 ? brideRun1Img.current : brideRun2Img.current;
        }
    };

    const draw = (ctx, canvas, data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 10);
        ctx.lineTo(canvas.width, canvas.height - 10);
        ctx.stroke();

        // Dino (Sprite)
        const img = getSprite(data);

        if (img && img.complete) {
            ctx.drawImage(img, data.dino.x, data.dino.y, data.dino.w, data.dino.h);
        } else {
            // Fallback
            ctx.fillStyle = character === 'groom' ? '#000' : '#ff0faf';
            ctx.fillRect(data.dino.x, data.dino.y, data.dino.w, data.dino.h);
        }

        // Obstacles
        ctx.fillStyle = '#555';
        data.obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        });
    };

    const handleAction = (e) => {
        // console.log("handleAction triggered", e?.type);
        // Removing preventDefault/stopPropagation to fix interaction issues

        if (gameState === 'START' || gameState === 'GAME_OVER') {
            resetGame();
            setGameState('PLAYING');
            checkAchievement('GAME_START');
        } else {
            jump();
        }
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>RUN TO WEDDING</h2>
            <div
                style={styles.gameContainer}
                onClick={handleAction}
            >
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={200}
                    style={styles.canvas}
                ></canvas>

                {gameState === 'START' && (
                    <div style={styles.overlay}>
                        <p style={{ marginBottom: '10px' }}>TAP TO START</p>
                        <button style={styles.startBtn} onClick={(e) => {
                            e.stopPropagation();
                            resetGame();
                            setGameState('PLAYING');
                            checkAchievement('GAME_START');
                        }}>GAME START</button>
                    </div>
                )}
                {gameState === 'GAME_OVER' && (
                    <div style={styles.overlay}>
                        <p>GAME OVER</p>
                        <p style={{ fontSize: '0.8rem' }}>Score: {score}</p>
                        <p style={{ fontSize: '0.7rem', color: '#666' }}>High: {savedHighScore > score ? savedHighScore : score}</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Tap to Retry</p>
                    </div>
                )}
                <div style={styles.score}>Score: {score}</div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '3rem 1rem',
        textAlign: 'center',
        backgroundColor: '#fff',
        userSelect: 'none',
    },
    title: {
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        marginBottom: '1rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
    },
    gameContainer: {
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        tapHighlightColor: 'transparent',
    },
    canvas: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        maxWidth: '100%',
    },
    overlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.95)',
        padding: '1.5rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        color: '#333',
        minWidth: '220px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    score: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: '2px 5px',
        borderRadius: '4px',
        zIndex: 10,
    },
    startBtn: {
        background: '#00eaff',
        color: '#141824',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1rem',
        boxShadow: '0 0 10px rgba(0, 234, 255, 0.5)',
    },
    charBtn: {
        marginTop: '10px',
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        transition: 'all 0.2s',
    }
}

export default DinoGame;
