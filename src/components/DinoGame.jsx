import { useEffect, useRef, useState } from 'react';
import groomPixel from '../assets/sprites/groom_pixel.png'; // Make sure these exist
import bridePixel from '../assets/sprites/bride_pixel.png';

const DinoGame = () => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);
    const [character, setCharacter] = useState('groom'); // 'groom' or 'bride'

    // Load Images
    const groomImg = useRef(new Image());
    const brideImg = useRef(new Image());

    useEffect(() => {
        groomImg.current.src = groomPixel;
        brideImg.current.src = bridePixel;
    }, []);

    // Game State Ref
    const gameData = useRef({
        dino: { x: 50, y: 150, w: 40, h: 40, dy: 0, grounded: true }, // Increased size slightly
        obstacles: [],
        frame: 0,
        isGameOver: false,
        animationId: null
    });

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

    const toggleCharacter = (e) => {
        if (gameState === 'START') {
            e.stopPropagation();
            setCharacter(prev => prev === 'groom' ? 'bride' : 'groom');
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

            if (data.dino.y + data.dino.h > canvas.height - 10) {
                data.dino.y = canvas.height - 10 - data.dino.h;
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
    }, [gameState, character]); // Re-run when character changes

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
        const img = character === 'groom' ? groomImg.current : brideImg.current;
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
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (gameState === 'START' || gameState === 'GAME_OVER') {
            resetGame();
            setGameState('PLAYING');
        } else {
            jump();
        }
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>RUN TO WEDDING</h2>
            <div
                style={styles.gameContainer}
                onMouseDown={handleAction}
                onTouchStart={handleAction}
            >
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={200}
                    style={styles.canvas}
                ></canvas>

                {gameState === 'START' && (
                    <div style={styles.overlay}>
                        <p>TAP TO START</p>
                        <button style={styles.charBtn} onClick={toggleCharacter} onMouseDown={(e) => e.stopPropagation()}>
                            Character: {character === 'groom' ? '🤵' : '👰'} (Tap to Swap)
                        </button>
                    </div>
                )}
                {gameState === 'GAME_OVER' && (
                    <div style={styles.overlay}>
                        <p>GAME OVER</p>
                        <p style={{ fontSize: '0.8rem' }}>Tap to Retry</p>
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
        background: 'rgba(255,255,255,0.9)',
        padding: '1rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        color: '#333',
        minWidth: '200px',
    },
    score: {
        marginTop: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '1.2rem',
    },
    charBtn: {
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
    }
}

export default DinoGame;
