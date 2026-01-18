import { useEffect, useRef, useState } from 'react';

const DinoGame = () => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);

    // Game State Ref (Mutable, doesn't trigger render)
    const gameData = useRef({
        dino: { x: 50, y: 150, w: 30, h: 30, dy: 0, grounded: true },
        obstacles: [],
        frame: 0,
        isGameOver: false,
        animationId: null
    });

    const resetGame = () => {
        gameData.current = {
            dino: { x: 50, y: 160, w: 30, h: 30, dy: 0, grounded: true },
            obstacles: [],
            frame: 0,
            isGameOver: false,
            animationId: null
        };
        setScore(0);
    };

    const jump = () => {
        if (gameData.current.dino.grounded) {
            gameData.current.dino.dy = -10; // Jump force
            gameData.current.dino.grounded = false;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const loop = () => {
            if (gameState !== 'PLAYING') return;

            const data = gameData.current;
            data.frame++;

            // Update Score every 10 frames to reduce renders (optional, but good practice)
            if (data.frame % 10 === 0) setScore(Math.floor(data.frame / 5));

            // Dino Physics
            data.dino.dy += 0.6; // Gravity
            data.dino.y += data.dino.dy;

            // Ground
            if (data.dino.y + data.dino.h > canvas.height - 10) {
                data.dino.y = canvas.height - 10 - data.dino.h;
                data.dino.dy = 0;
                data.dino.grounded = true;
            }

            // Obstacles
            if (data.frame % (100 + Math.floor(Math.random() * 50)) === 0) {
                data.obstacles.push({ x: canvas.width, y: canvas.height - 10 - 20, w: 20, h: 20 });
            }

            // Move Obstacles
            data.obstacles.forEach(obs => obs.x -= 5);
            data.obstacles = data.obstacles.filter(obs => obs.x + obs.w > 0);

            // Collision
            let collided = false;
            data.obstacles.forEach(obs => {
                if (
                    data.dino.x < obs.x + obs.w &&
                    data.dino.x + data.dino.w > obs.x &&
                    data.dino.y < obs.y + obs.h &&
                    data.dino.y + data.dino.h > obs.y
                ) {
                    collided = true;
                }
            });

            if (collided) {
                setGameState('GAME_OVER');
                data.isGameOver = true;
            }

            // Draw
            draw(ctx, canvas, data);

            if (!data.isGameOver) {
                data.animationId = requestAnimationFrame(loop);
            }
        };

        if (gameState === 'PLAYING') {
            gameData.current.animationId = requestAnimationFrame(loop);
        } else {
            // If START or GAME_OVER, just draw one frame or static
            draw(ctx, canvas, gameData.current);
        }

        return () => {
            cancelAnimationFrame(gameData.current.animationId);
        };
    }, [gameState]);

    const draw = (ctx, canvas, data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 10);
        ctx.lineTo(canvas.width, canvas.height - 10);
        ctx.stroke();

        // Dino
        ctx.fillStyle = '#8E7F7F';
        ctx.fillRect(data.dino.x, data.dino.y, data.dino.w, data.dino.h);

        // Obstacles
        ctx.fillStyle = '#555';
        data.obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        });

        // Text Overlays handled by HTML/CSS ideally, but canvas text is fine
    };

    const handleAction = (e) => {
        if (e) e.preventDefault();

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
                className="game-container"
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
                        <p>TAP TO START</p>
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
        backgroundColor: '#FAFAFA',
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
        background: 'rgba(255,255,255,0.8)',
        padding: '1rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        color: '#333',
    },
    score: {
        marginTop: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '1.2rem',
    }
}

export default DinoGame;
