import { useEffect, useRef, useState } from 'react';
import groomSprites from '../assets/sprites/groom_sprites.png';
import brideSprites from '../assets/sprites/bride_sprites.png';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { checkAchievement } from '../utils/achievementManager';
import { audioManager } from '../utils/audioManager';
import { addDiamonds } from '../utils/currencyManager';

const DinoGame = ({ selectedCharacter = 'groom' }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER, CLEAR
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [character, setCharacter] = useState('groom'); // Force Groom Only
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);


    // Load Images
    const groomSheet = useRef(new Image());
    const brideSheet = useRef(new Image());
    const bgImage = useRef(new Image());


    useEffect(() => {
        let loaded = 0;
        const totalImages = 3;

        const checkLoaded = () => {
            loaded++;
            if (loaded >= totalImages) setImagesLoaded(true);
        };

        const bg = new Image();
        bg.src = new URL('../assets/pixel_castle_bg.png', import.meta.url).href;
        bg.onload = () => {
            bgImage.current = bg;
            checkLoaded();
        };

        // Targeted transparency for White Background (255, 255, 255)
        const processImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = src;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        // If pixel is Magenta (255, 0, 255), make it transparent
                        if (r === 255 && g === 0 && b === 255) {
                            data[i + 3] = 0;
                        }
                    }

                    ctx.putImageData(imgData, 0, 0);
                    const processed = new Image();
                    processed.onload = () => resolve(processed);
                    processed.src = canvas.toDataURL();
                };
            });
        };

        const loadSprite = async (ref, src) => {
            const processed = await processImage(src);
            ref.current = processed;
            checkLoaded();
        };

        loadSprite(groomSheet, groomSprites);
        loadSprite(brideSheet, brideSprites);

        loadSprite(groomSheet, groomSprites);
        loadSprite(brideSheet, brideSprites);
    }, []);

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 450; // Taller for mobile (16:9)
    const GROUND_HEIGHT = 50;
    const CLEAR_SCORE = 2026;

    const BASE_SIZE = 140; // Slightly smaller characters for better visibility (was 160)
    const Y_OFFSET = 40;

    const gameData = useRef({
        dino: { x: 50, y: 0, w: 0, h: 0, dy: 0, grounded: true },
        items: [],
        obstacles: [],
        clouds: [],
        particles: [],
        fireworks: [],
        frame: 0,
        bgOffset: 0,
        isGameOver: false,
        isGameClear: false,
        animationId: null
    });

    const resetGame = () => {
        const currentH = BASE_SIZE;
        let currentW = BASE_SIZE;

        const sheet = character === 'groom' ? groomSheet.current : brideSheet.current;
        if (sheet && sheet.complete && sheet.width > 0) {
            const frameW = sheet.width / 3;
            const frameH = sheet.height;
            const ratio = frameW / frameH;
            currentW = currentH * ratio;
        }

        gameData.current = {
            dino: {
                x: 80, // Slightly improved initial X (was 100)
                y: CANVAS_HEIGHT - GROUND_HEIGHT - currentH,
                w: currentW,
                h: currentH,
                dy: 0,
                grounded: true
            },
            items: [],
            obstacles: [],
            clouds: [],
            particles: [],
            fireworks: [],
            frame: 0,
            bgOffset: 0,
            isGameOver: false,
            isGameClear: false,
            animationId: null,
            speed: 6,
            runTime: 0,
            spawnTimer: 0, // Time-based spawner
            lastSpawnType: null
        };
        setScore(0);
        scoreRef.current = 0;
        setTime(0);
    };

    const jump = () => {
        if (gameData.current.dino.grounded) {
            audioManager.playJump();
            gameData.current.dino.dy = -15; // Lower jump (was -18)
            gameData.current.dino.grounded = false;

            for (let i = 0; i < 5; i++) {
                gameData.current.particles.push({
                    x: gameData.current.dino.x + (gameData.current.dino.w / 2),
                    y: gameData.current.dino.y + gameData.current.dino.h + Y_OFFSET,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 2,
                    life: 20,
                    color: '#fff'
                });
            }
        }
    };

    const createFirework = (x, y) => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            gameData.current.fireworks.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60, color: color
            });
        }
    };

    const saveScore = async (finalScore) => {
        const nickname = localStorage.getItem('wedding_nickname');
        if (!nickname) return;
        try {
            // Use Nickname as ID for Score Doc
            const scoreRef = doc(db, "scores", nickname);
            await setDoc(scoreRef, {
                uid: auth.currentUser?.uid || 'anon',
                displayName: nickname,
                score: finalScore,
                timestamp: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let lastTime = performance.now();

        // Start Timer if Playing
        if (gameState === 'PLAYING') {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }

        const loop = (time) => {
            if (gameState !== 'PLAYING') return;
            const dt = Math.min((time - lastTime) / 16, 2);
            lastTime = time;

            const data = gameData.current;

            if (!data.isGameClear && !data.isGameOver) {
                data.frame++; // Keep for animations

                data.runTime += dt * 16; // ms

                // Difficulty Scaling (Time-based now!)
                // Increase speed every 5 seconds
                const timeDifficulty = Math.floor(data.runTime / 5000);
                data.speed = Math.min(22, 6 + (timeDifficulty * 1.5));

                data.bgOffset += (data.speed * 0.5) * dt;

                // Check Game Clear
                if (scoreRef.current >= CLEAR_SCORE) {
                    data.isGameClear = true;
                    setGameState('CLEAR');
                    checkAchievement('GAME_CLEAR');
                    saveScore(scoreRef.current);
                    addDiamonds(scoreRef.current);
                    audioManager.playWin();
                    createFirework(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                    if (timerRef.current) clearInterval(timerRef.current);
                }

                // Physics
                data.dino.dy += 1.5 * dt;
                data.dino.y += data.dino.dy * dt;
                if (data.dino.y + data.dino.h > CANVAS_HEIGHT - GROUND_HEIGHT) {
                    data.dino.y = CANVAS_HEIGHT - GROUND_HEIGHT - data.dino.h;
                    data.dino.dy = 0;
                    data.dino.grounded = true;
                }

                // Spawn Logic (Time-based) - Reduced spacing by ~25%
                const minSpawnTime = 300; // was 400
                const maxSpawnTime = 650; // was 900
                // Use timeDifficulty for Spawn Rate too
                const currentSpawnInterval = Math.max(minSpawnTime, maxSpawnTime - (timeDifficulty * 40));

                data.spawnTimer -= (dt * 16);
                if (data.spawnTimer <= 0) {
                    data.spawnTimer = currentSpawnInterval;

                    let isItem = Math.random() > 0.4;
                    if (data.lastSpawnType === 'obstacle') isItem = true;

                    if (isItem) {
                        const items = ['🎟️', '🍔', '✈️', '💍', '💌'];
                        const item = items[Math.floor(Math.random() * items.length)];
                        data.items.push({
                            x: CANVAS_WIDTH,
                            y: CANVAS_HEIGHT - GROUND_HEIGHT - 60 - (Math.random() * 100),
                            w: 50, h: 50, type: item, vy: Math.sin(data.frame) * 0.5
                        });
                        data.lastSpawnType = 'item';
                    } else {
                        // Use safer emojis for Windows compatibility
                        const obstacles = ['🔥', '💣'];
                        const obs = obstacles[Math.floor(Math.random() * obstacles.length)];
                        data.obstacles.push({
                            x: CANVAS_WIDTH,
                            y: CANVAS_HEIGHT - GROUND_HEIGHT - 50,
                            w: 50, h: 50, type: obs
                        });
                        data.lastSpawnType = 'obstacle';
                    }
                }

                // Move & Filter
                const moveObj = (obj) => {
                    obj.x -= data.speed * dt;
                    if (obj.vy) obj.y += Math.sin(data.frame * 0.1) * 2 * dt;
                };
                [...data.items, ...data.obstacles].forEach(moveObj);

                data.items = data.items.filter(i => i.x + i.w > 0 && !i.collected);
                data.obstacles = data.obstacles.filter(o => o.x + o.w > 0);

                // Collision
                const hb = 20;
                const checkCol = (obj) =>
                    data.dino.x + hb < obj.x + obj.w - hb &&
                    data.dino.x + data.dino.w - hb > obj.x + hb &&
                    data.dino.y + hb < obj.y + obj.h - hb &&
                    data.dino.y + data.dino.h - hb > obj.y + hb;

                data.items.forEach(item => {
                    if (checkCol(item)) {
                        item.collected = true;
                        audioManager.playConfirm();
                        setScore(prev => {
                            const newScore = prev + 1;
                            scoreRef.current = newScore;
                            checkAchievement('GAME_SCORE', newScore);
                            return newScore;
                        });
                        for (let i = 0; i < 5; i++) {
                            data.particles.push({
                                x: item.x, y: item.y,
                                vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                                life: 30, color: '#FFD700'
                            });
                        }
                    }
                });

                data.obstacles.forEach(obs => {
                    if (checkCol(obs)) {
                        audioManager.playDamage();
                        data.isGameOver = true;
                        setGameState('GAME_OVER');
                        if (timerRef.current) clearInterval(timerRef.current);
                        saveScore(scoreRef.current);
                        addDiamonds(scoreRef.current);
                    }
                });

            } else if (data.isGameClear) {
                if (data.frame % 30 === 0) createFirework(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT / 2);
                if (timerRef.current) clearInterval(timerRef.current);
            }

            // Particles
            data.particles.forEach(p => {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
                p.vy += 0.1 * dt;
            });
            data.fireworks.forEach(p => {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
                p.vy += 0.1 * dt;
            });
            data.particles = data.particles.filter(p => p.life > 0);
            data.fireworks = data.fireworks.filter(p => p.life > 0);

            draw(ctx);

            if (gameState === 'PLAYING' || gameState === 'CLEAR') {
                gameData.current.animationId = requestAnimationFrame(loop);
            }
        };

        const draw = (ctx) => {
            const data = gameData.current;

            // Background
            if (bgImage.current && bgImage.current.complete) {
                const xPos = -(data.bgOffset % bgImage.current.width);
                ctx.drawImage(bgImage.current, xPos, 0, bgImage.current.width, CANVAS_HEIGHT);
                ctx.drawImage(bgImage.current, xPos + bgImage.current.width, 0, bgImage.current.width, CANVAS_HEIGHT);
            } else {
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            // Objects
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '40px "Segoe UI Emoji", "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", sans-serif';

            // Objects (Draw Text Directly)
            data.items.forEach(item => {
                if (!item.collected) {
                    ctx.fillText(item.type, item.x + item.w / 2, item.y + item.h / 2 + 5);
                }
            });
            data.obstacles.forEach(obs => {
                ctx.fillText(obs.type, obs.x + obs.w / 2, obs.y + obs.h / 2 + 5);
            });

            // Player
            const sheet = character === 'groom' ? groomSheet.current : brideSheet.current;
            if (sheet && sheet.complete && sheet.width > 0) {
                const frameW = sheet.width / 3;
                const frameH = sheet.height;
                const runFrame = Math.floor(data.frame / 6) % 2 + 1;
                const frameIndex = (data.dino.grounded && !data.isGameClear) ? runFrame : 0;
                ctx.drawImage(sheet, frameIndex * frameW, 0, frameW, frameH, data.dino.x, data.dino.y + Y_OFFSET, data.dino.w, data.dino.h);
            }

            // Particles (Batch drawing by color to reduce state changes)
            // Yellow
            ctx.fillStyle = '#FFD700';
            data.particles.forEach(p => {
                if (p.color === '#FFD700') ctx.fillRect(p.x, p.y, 4, 4);
            });
            // White
            ctx.fillStyle = '#FFFFFF';
            data.particles.forEach(p => {
                if (p.color === '#fff' || p.color === '#FFFFFF') ctx.fillRect(p.x, p.y, 4, 4);
            });

            // Fireworks
            data.fireworks.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 3, 3);
            });
        };

        if (gameState === 'PLAYING' || gameState === 'CLEAR') {
            lastTime = performance.now();
            gameData.current.animationId = requestAnimationFrame(loop);
        } else {
            draw(ctx);
        }

        return () => {
            cancelAnimationFrame(gameData.current.animationId);
            if (timerRef.current) clearInterval(timerRef.current);
        };

    }, [gameState, character, imagesLoaded]);

    const handleAction = (e) => {
        if (e && e.cancelable) e.preventDefault(); // Prevent scroll/zoom on touch

        if (gameState === 'START' || gameState === 'GAME_OVER' || gameState === 'CLEAR') {
            audioManager.playClick();
            resetGame();
            setGameState('PLAYING');
            checkAchievement('GAME_START');
        } else {
            jump();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            onClick={handleAction}
            onTouchStart={handleAction}
            className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-sky-300 border-4 border-black overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.5)] font-['Silkscreen'] select-none cursor-pointer touch-none"
        >
            <canvas ref={canvasRef} width={800} height={450} className="w-full h-full block" style={{ imageRendering: 'pixelated' }}></canvas>

            {gameState === 'START' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 font-['Silkscreen']">
                    <h2 className="text-3xl md:text-4xl text-yellow-400 mb-4 animate-bounce drop-shadow-md font-['Silkscreen'] text-center">WEDDING RUN</h2>
                    <p className="text-xs md:text-sm mb-8 animate-pulse text-gray-300">INSERT COIN TO START</p>
                    <div className="border-4 border-white px-6 py-2 bg-blue-600 hover:bg-blue-500 blink text-sm md:text-base">
                        PRESS START
                    </div>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white font-['Silkscreen']">
                    <h2 className="text-5xl text-red-500 mb-4 drop-shadow-md font-['Silkscreen']">GAME OVER</h2>
                    <p className="text-2xl mb-2">SCORE: {score}</p>
                    <p className="text-xl mb-2 text-cyan-400 font-bold animate-pulse">💎 EARNED: +{score}</p>
                    <p className="text-lg text-gray-400 mb-8">TIME: {formatTime(time)}</p>
                    <div className="border-4 border-white px-6 py-2 hover:bg-white hover:text-black transition-colors">
                        RETRY ?
                    </div>
                </div>
            )}

            {/* In-Game HUD */}
            <div className="absolute top-4 left-4 z-20">
                <div className="bg-black/50 text-white px-3 py-1 border-2 border-white/50 text-sm flex items-center shadow-md backdrop-blur-sm rounded-md">
                    ⏰ {formatTime(time)}
                </div>
            </div>
            <div className="absolute top-4 right-4 text-2xl text-white drop-shadow-[2px_2px_0_black]">
                SCORE: {score}
            </div>
        </div>
    );
};

export default DinoGame;
