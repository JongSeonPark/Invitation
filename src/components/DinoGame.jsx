import { useEffect, useRef, useState } from 'react';
import groomSprites from '../assets/sprites/groom_sprites.png';
import brideSprites from '../assets/sprites/bride_sprites.png';
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
    const groomSheet = useRef(new Image());
    const brideSheet = useRef(new Image());

    useEffect(() => {
        let loaded = 0;
        const totalImages = 2;

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
                assignRef(groomSheet, groomSprites),
                assignRef(brideSheet, brideSprites)
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
        dino: { x: 50, y: 150, w: 75, h: 75, dy: 0, grounded: true },
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

    // Adjust dimensions based on sprite aspect ratio
    const resizeDino = () => {
        const img = character === 'groom' ? groomSheet.current : brideSheet.current;
        if (img && img.complete && img.width > 0) {
            const frameW = img.width / 3;
            // Trim padding to get actual visual width ratio
            // Consistent with draw logic (paddingX = 20)
            const paddingX = 20;
            const effectiveW = frameW - (paddingX * 2);

            const frameH = img.height;
            const ratio = effectiveW / frameH;

            // Fixed height target (Increased from 60 -> 75)
            const targetH = 75;
            const targetW = targetH * ratio;

            gameData.current.dino.w = targetW;
            gameData.current.dino.h = targetH;
        }
    };

    useEffect(() => {
        if (imagesLoaded) resizeDino();
    }, [character, imagesLoaded]);

    const resetGame = () => {
        // Reset but keep current dimensions if loaded
        const currentW = gameData.current.dino.w;
        const currentH = gameData.current.dino.h;

        let startY = 150;
        if (canvasRef.current) {
            const groundY = canvasRef.current.height - 10;
            startY = groundY - currentH;
        }

        gameData.current = {
            dino: { x: 50, y: startY, w: currentW, h: currentH, dy: 0, grounded: true },
            obstacles: [],
            frame: 0,
            isGameOver: false,
            animationId: null
        };
        resizeDino(); // Ensure correct size
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

            // Ground floor logic (Remove -2 cushion to sit lower)
            const groundY = canvas.height - 10;

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
            // Snap to ground for static display (Prevent Jump)
            const groundY = canvas.height - 10;
            if (canvas.height > 0 && gameData.current.dino.y + gameData.current.dino.h !== groundY) {
                gameData.current.dino.y = groundY - gameData.current.dino.h;
            }
            draw(ctx, canvas, gameData.current);
        }

        return () => cancelAnimationFrame(gameData.current.animationId);
    }, [gameState, character, imagesLoaded]);

    const draw = (ctx, canvas, data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 10);
        ctx.lineTo(canvas.width, canvas.height - 10);
        ctx.stroke();

        // Character Sprite
        const sheet = character === 'groom' ? groomSheet.current : brideSheet.current;

        // Configuration for visual offsets (framing)
        // Adjust 'y' to pull the character down if they look like they are floating
        const spriteConfig = {
            groom: {
                stand: { frameIndex: 0, y: 21 },  // Lowered idle (+5)
                run1: { frameIndex: 1, y: 22 },
                run2: { frameIndex: 2, y: 22 }
            },
            bride: {
                stand: { frameIndex: 0, y: 22 },  // Lowered idle (+6)
                run1: { frameIndex: 1, y: 22 },
                run2: { frameIndex: 2, y: 22 }
            }
        };

        const config = spriteConfig[character] || spriteConfig.groom;
        let currentPose = config.stand;

        if (gameState === 'PLAYING' && data.dino.grounded) {
            const runFrame = Math.floor(data.frame / 10) % 2;
            currentPose = runFrame === 0 ? config.run1 : config.run2;
        }

        if (sheet && sheet.complete && sheet.width > 0) {
            const frameWidth = sheet.width / 3;
            const frameHeight = sheet.height;

            // Trim edges to prevent bleeding next frame
            // Take 40px off total width (20px from left, 20px from right)
            const paddingX = 20;
            const sourceW = frameWidth - (paddingX * 2);
            const sourceX = (currentPose.frameIndex * frameWidth) + paddingX;

            ctx.drawImage(
                sheet,
                sourceX, 0, sourceW, frameHeight, // Source (trimmed)
                data.dino.x, data.dino.y + currentPose.y, data.dino.w, data.dino.h // Dest
            );
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
        <section className="py-20 px-4 text-center bg-gray-50 select-none">
            <h2 className="text-sm text-primary tracking-[0.2em] font-bold mb-8 uppercase">
                RUN TO WEDDING
            </h2>
            <div
                className="relative inline-block w-full max-w-3xl aspect-[16/10] bg-white rounded-xl shadow-soft-xl overflow-hidden cursor-pointer touch-manipulation border border-gray-200"
                onClick={handleAction}
            >
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={200}
                    className="w-full h-full block pixelated"
                    style={{ imageRendering: 'pixelated' }}
                ></canvas>

                {gameState === 'START' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white/95 px-8 py-6 rounded-xl shadow-lg border border-gray-100 min-w-[240px]">
                        <p className="mb-4 font-bold text-gray-800 tracking-wider">TAP TO START</p>
                        <button
                            className="bg-cta text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                            onClick={(e) => {
                                e.stopPropagation();
                                resetGame();
                                setGameState('PLAYING');
                                checkAchievement('GAME_START');
                            }}
                        >
                            GAME START
                        </button>
                    </div>
                )}
                {gameState === 'GAME_OVER' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white/95 px-8 py-6 rounded-xl shadow-lg border border-gray-100 min-w-[240px]">
                        <p className="font-black text-xl text-gray-800 mb-2">GAME OVER</p>
                        <p className="text-lg font-mono font-bold text-primary mb-1">Score: {score}</p>
                        <p className="text-sm text-gray-500 mb-4">High: {savedHighScore > score ? savedHighScore : score}</p>
                        <p className="text-sm font-medium text-gray-400 animate-pulse">Tap to Retry</p>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded font-mono font-bold text-lg shadow-sm">
                    Score: {score}
                </div>
            </div>
        </section>
    );
};

export default DinoGame;
