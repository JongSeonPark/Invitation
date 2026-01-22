import { useEffect, useRef, useState } from 'react';
import groomSprites from '../assets/sprites/groom_sprites.png';
import brideSprites from '../assets/sprites/bride_sprites.png';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { checkAchievement } from '../utils/achievementManager';

const DinoGame = ({ selectedCharacter = 'groom' }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
    const [score, setScore] = useState(0);
    const [character, setCharacter] = useState(selectedCharacter);
    const [savedHighScore, setSavedHighScore] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        setCharacter(selectedCharacter);
    }, [selectedCharacter]);

    // Load Images
    const groomSheet = useRef(new Image());
    const brideSheet = useRef(new Image());

    useEffect(() => {
        let loaded = 0;
        const totalImages = 2;

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
                    const bgR = data[0], bgG = data[1], bgB = data[2];
                    const tolerance = 30;
                    for (let i = 0; i < data.length; i += 4) {
                        if (Math.abs(data[i] - bgR) < tolerance && Math.abs(data[i + 1] - bgG) < tolerance && Math.abs(data[i + 2] - bgB) < tolerance) {
                            data[i + 3] = 0;
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
    }, []);

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;
    const GROUND_HEIGHT = 50;

    // Config
    const BASE_SIZE = 160;   // Increased from 130 to 160 (approx 1.2x)
    const Y_OFFSET = 40;     // Push down deeper to fix visuals (30 -> 40)

    // Initial State Calculation
    const getInitialDinoState = () => ({
        x: 50,
        y: CANVAS_HEIGHT - GROUND_HEIGHT - BASE_SIZE,
        w: BASE_SIZE,
        h: BASE_SIZE,
        dy: 0,
        grounded: true,
        rotation: 0
    });

    const gameData = useRef({
        dino: getInitialDinoState(), // Correct reset from start
        obstacles: [],
        clouds: [],
        particles: [],
        frame: 0,
        bgOffset: 0,
        isGameOver: false,
        animationId: null
    });

    const resetGame = () => {
        // Recalculate aspect ratio logic
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
                x: 100,
                y: CANVAS_HEIGHT - GROUND_HEIGHT - currentH,
                w: currentW,
                h: currentH,
                dy: 0,
                grounded: true,
                rotation: 0
            },
            obstacles: [],
            clouds: [],
            particles: [],
            frame: 0,
            bgOffset: 0,
            isGameOver: false,
            animationId: null
        };
        setScore(0);

        for (let i = 0; i < 5; i++) {
            gameData.current.clouds.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * (CANVAS_HEIGHT / 2),
                speed: 0.5 + Math.random() * 1
            });
        }
    };

    const jump = () => {
        if (gameData.current.dino.grounded) {
            gameData.current.dino.dy = -18; // Stronger jump for bigger body
            gameData.current.dino.grounded = false;

            for (let i = 0; i < 8; i++) {
                gameData.current.particles.push({
                    x: gameData.current.dino.x + (gameData.current.dino.w / 2),
                    y: gameData.current.dino.y + gameData.current.dino.h + Y_OFFSET,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 4,
                    life: 25
                });
            }
        }
    };

    const saveScore = async (finalScore) => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            const scoreRef = doc(db, "scores", user.uid);
            await setDoc(scoreRef, {
                uid: user.uid,
                displayName: user.displayName || 'Guest',
                score: finalScore,
                timestamp: serverTimestamp()
            }, { merge: true });

            if (finalScore > savedHighScore) setSavedHighScore(finalScore);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let lastTime = performance.now();

        const loop = (time) => {
            if (gameState !== 'PLAYING') return;
            const dt = Math.min((time - lastTime) / 16, 2);
            lastTime = time;

            const data = gameData.current;
            data.frame++;
            data.bgOffset += 2 * dt;

            // Score
            if (data.frame % 5 === 0) setScore(Math.floor(data.frame / 5));

            // Physics
            data.dino.dy += 0.8 * dt;
            data.dino.y += data.dino.dy * dt;

            // Ground Collision
            if (data.dino.y + data.dino.h > CANVAS_HEIGHT - GROUND_HEIGHT) {
                data.dino.y = CANVAS_HEIGHT - GROUND_HEIGHT - data.dino.h;
                data.dino.dy = 0;
                data.dino.grounded = true;
            }

            // Obstacles
            if (data.frame % 100 === 0) { // Slightly faster spawn
                const types = ['🎂', '🎁', '✉️', '👰‍♀️', '🤵‍♂️'];
                const type = types[Math.floor(Math.random() * types.length)];
                data.obstacles.push({
                    x: CANVAS_WIDTH,
                    y: CANVAS_HEIGHT - GROUND_HEIGHT - 60,
                    w: 60, // Bigger obstacles too
                    h: 60,
                    type: type,
                    angle: 0
                });
            }

            data.obstacles.forEach(obs => {
                obs.x -= 7 * dt; // Faster game speed
                obs.angle += 0.05;
            });
            data.obstacles = data.obstacles.filter(obs => obs.x + obs.w > 0);

            // Clouds
            data.clouds.forEach(cloud => {
                cloud.x -= cloud.speed * dt;
                if (cloud.x + 100 < 0) cloud.x = CANVAS_WIDTH;
            });

            // Particles
            data.particles.forEach(p => {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
            });
            data.particles = data.particles.filter(p => p.life > 0);

            // Collision
            const hitboxPadding = 20;
            let collided = false;
            data.obstacles.forEach(obs => {
                if (
                    data.dino.x + hitboxPadding < obs.x + obs.w - hitboxPadding &&
                    data.dino.x + data.dino.w - hitboxPadding > obs.x + hitboxPadding &&
                    data.dino.y + hitboxPadding < obs.y + obs.h - hitboxPadding &&
                    // Check logic with Visual Offset in mind? 
                    // No, logic uses 'y', drawing uses 'y + offset'. 
                    // Ground collision uses 'y'. So physics is consistent.
                    data.dino.y + data.dino.h - hitboxPadding > obs.y + hitboxPadding
                ) {
                    collided = true;
                }
            });

            if (collided) {
                setGameState('GAME_OVER');
                data.isGameOver = true;
                saveScore(Math.floor(data.frame / 5));
                checkAchievement('GAME_SCORE', Math.floor(data.frame / 5));
            }

            draw(ctx);

            if (!data.isGameOver) {
                data.animationId = requestAnimationFrame(loop);
            }
        };

        const draw = (ctx) => {
            const data = gameData.current;

            // Sky
            const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            gradient.addColorStop(0, '#60A5FA');
            gradient.addColorStop(1, '#DBEAFE');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            data.clouds.forEach(cloud => {
                ctx.beginPath();
                ctx.arc(cloud.x, cloud.y, 30, 0, Math.PI * 2);
                ctx.arc(cloud.x + 25, cloud.y - 10, 35, 0, Math.PI * 2);
                ctx.arc(cloud.x + 50, cloud.y, 30, 0, Math.PI * 2);
                ctx.fill();
            });

            // Ground
            ctx.fillStyle = '#991B1B';
            ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
            ctx.fillStyle = '#B91C1C';
            ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT + 10, CANVAS_WIDTH, GROUND_HEIGHT - 20);

            // Character
            const sheet = character === 'groom' ? groomSheet.current : brideSheet.current;
            if (sheet && sheet.complete && sheet.width > 0) {
                const frameW = sheet.width / 3;
                const frameH = sheet.height;
                const runFrame = Math.floor(data.frame / 8) % 2 + 1;
                const frameIndex = data.dino.grounded ? runFrame : 0;

                // Apply Aspect Ratio Fix
                if (data.dino.w === BASE_SIZE && frameW !== frameH) {
                    const ratio = frameW / frameH;
                    data.dino.w = data.dino.h * ratio;
                }

                ctx.save();
                // Draw with Offset to ground visuals
                ctx.drawImage(
                    sheet,
                    frameIndex * frameW, 0, frameW, frameH,
                    data.dino.x, data.dino.y + Y_OFFSET, data.dino.w, data.dino.h
                );
                ctx.restore();
            } else {
                ctx.fillStyle = 'white';
                ctx.fillRect(data.dino.x, data.dino.y, data.dino.w, data.dino.h);
            }

            // Obstacles
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            data.obstacles.forEach(obs => {
                ctx.save();
                ctx.translate(obs.x + obs.w / 2, obs.y + obs.h / 2);
                if (obs.type !== '🎂') ctx.rotate(Math.sin(data.frame * 0.1) * 0.2);
                ctx.fillText(obs.type, 0, 0);
                ctx.restore();
            });

            // Particles
            ctx.fillStyle = '#fff';
            data.particles.forEach(p => {
                ctx.globalAlpha = p.life / 20;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            // Ground Detail
            const flowerOffset = -(data.bgOffset % 100);
            ctx.font = '20px Arial';
            for (let i = 0; i < CANVAS_WIDTH + 100; i += 100) {
                ctx.fillText('🌸', i + flowerOffset, CANVAS_HEIGHT - 10);
            }
        };

        if (gameState === 'PLAYING') {
            lastTime = performance.now();
            gameData.current.animationId = requestAnimationFrame(loop);
        } else {
            // Force redraw initial state to prevent "floating" before start
            // If image is loaded, it might need one 'tick' or just a manual draw call?
            // Since we rely on 'imagesLoaded' state trigger, it will redraw when loaded.
            // Just need to ensure `dino` coordinates are correct BEFORE start.
            // We fixed initialization of gameData.current.dino above.
            draw(ctx);
        }

        return () => cancelAnimationFrame(gameData.current.animationId);

    }, [gameState, character, imagesLoaded]);

    const handleAction = (e) => {
        if (gameState === 'START' || gameState === 'GAME_OVER') {
            resetGame();
            setGameState('PLAYING');
            checkAchievement('GAME_START');
        } else {
            jump();
        }
    };

    return (
        <div className="relative w-full max-w-3xl aspect-[2/1] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-black font-['Jua'] select-none cursor-pointer group" onClick={handleAction}>
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-full block"
            ></canvas>

            {gameState === 'START' && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm">
                    <h2 className="text-5xl text-white font-black drop-shadow-md mb-4 animate-bounce">WEDDING RUN</h2>
                    <p className="text-xl text-yellow-300 mb-8 font-bold">화면을 터치해서 점프하세요!</p>
                    <div className="bg-white text-black px-8 py-3 rounded-full font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black group-hover:scale-110 transition-transform">
                        START
                    </div>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-md animate-in zoom-in duration-300">
                    <p className="text-6xl mb-2">😭</p>
                    <h2 className="text-4xl text-white font-black mb-2">OOPS!</h2>
                    <div className="bg-white/90 p-6 rounded-2xl border-4 border-black text-center mb-6 shadow-lg">
                        <p className="text-sm text-gray-500 font-bold mb-1">SCORE</p>
                        <p className="text-5xl font-black text-orange-500">{score}</p>
                    </div>
                    <div className="bg-[#22D3EE] text-white px-8 py-3 rounded-full font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black animate-pulse">
                        TRY AGAIN
                    </div>
                </div>
            )}

            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full border-2 border-black font-black text-2xl shadow-md">
                {score}m
            </div>

            <div className="absolute bottom-2 left-2 text-xs text-white/50 font-bold">
                Design by Trickcal Style
            </div>
        </div>
    );
};

export default DinoGame;
