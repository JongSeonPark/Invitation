import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../utils/audioManager';
import { checkAchievement } from '../../utils/achievementManager';
import { addDiamonds } from '../../utils/currencyManager';
import brideImg from '../../assets/sprites/bride_pixel.png'; // Pixel Bride
import { auth, db } from '../../firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Helper to filter magenta
const ChromaKeySprite = ({ src, filterColor = [255, 0, 255] }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        // img.crossOrigin = "Anonymous"; // Caused issues on iOS for local assets
        img.src = src;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const [rK, gK, bK] = filterColor;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Broader tolerance for magenta and surrounding pinkish artifacts
                // Target: R=255, G=0, B=255. 
                // We allow lower R/B and slightly higher G to catch anti-aliasing.
                if (r > 200 && g < 100 && b > 200) {
                    // Additional check: Make sure it's dominantly purple/pink
                    // (R and B should be significantly higher than G)
                    if ((r - g > 50) && (b - g > 50)) {
                        data[i + 3] = 0; // Alpha 0
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        };
    }, [src]);

    return <canvas ref={canvasRef} className="w-full h-full object-contain drop-shadow-lg" style={{ imageRendering: 'pixelated' }} />;
};

const BouquetGame = ({ onClose }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0); // Seconds
    const [lane, setLane] = useState(2); // 0, 1, 2, 3, 4 (Center is 2)
    const [items, setItems] = useState([]); // { id, x, y, type: 'bouquet'|'bomb'|'withered' }

    // Refs for game loop
    const gameLoopRef = useRef(null);
    const spawnerRef = useRef(null);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);
    const gameStateRef = useRef('start');
    const laneRef = useRef(2); // Track lane
    const itemsRef = useRef([]);
    const lastTimeRef = useRef(0);

    // Asset
    const bgImage = new URL('../../assets/pixel_castle_bg.png', import.meta.url).href;
    const LANES = 5;
    const LANE_WIDTH = 100 / LANES; // 20%
    const PLAYER_WIDTH = 15; // % slightly smaller than lane

    // Sync state to refs
    useEffect(() => {
        laneRef.current = lane;
    }, [lane]);

    const startGame = () => {
        audioManager.playClick();
        setGameState('playing');
        setScore(0);
        setTime(0);
        setLane(2);
        setItems([]);

        scoreRef.current = 0;
        laneRef.current = 2;
        itemsRef.current = [];
        gameStateRef.current = 'playing';

        // Start Spawner
        if (spawnerRef.current) clearInterval(spawnerRef.current);
        spawnerRef.current = setInterval(spawnItem, 800);

        // Start Timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        // Start Game Loop
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    const spawnItem = () => {
        if (gameStateRef.current !== 'playing') return;

        const id = Date.now() + Math.random();
        const isBad = Math.random() > 0.6;
        const type = isBad ? (Math.random() > 0.5 ? 'bomb' : 'withered') : 'bouquet';

        // Spawn in one of the 5 lanes
        const randomLane = Math.floor(Math.random() * LANES);
        // Center of the lane (Lane 0: 0-20 -> Center 10)
        // Adjust for item width (approx 10%?) -> Center align
        const x = (randomLane * LANE_WIDTH) + (LANE_WIDTH / 2) - 5; // -5 to center 10% wide item?

        const newItem = { id, x, y: -10, type, lane: randomLane };
        itemsRef.current.push(newItem);
    };

    const updateGame = (time) => {
        if (gameStateRef.current !== 'playing') return;

        // Calculate Delta Time
        const now = time || performance.now();
        if (!lastTimeRef.current) lastTimeRef.current = now;
        const dt = Math.min((now - lastTimeRef.current) / 16, 2);
        lastTimeRef.current = now;

        // Speed increases with score
        const speedBase = (0.4 + (scoreRef.current * 0.05)) * dt;
        let gameOverTriggered = false;

        itemsRef.current = itemsRef.current.filter(item => {
            item.y += speedBase;

            // Collision Detection
            if (item.y > 75 && item.y < 95) { // Hitbox check
                // Check Lane first (simple logic)
                if (item.lane === laneRef.current) {
                    if (item.type === 'bouquet') {
                        audioManager.playConfirm();
                        scoreRef.current += 1;
                        setScore(scoreRef.current);
                        return false;
                    } else {
                        audioManager.playDamage();
                        gameOverTriggered = true;
                        return false;
                    }
                }
            }
            return item.y < 105;
        });

        if (gameOverTriggered) {
            endGame('gameover');
            return;
        }

        setItems([...itemsRef.current]);
        gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    const saveScore = async (finalScore) => {
        const nickname = localStorage.getItem('wedding_nickname');
        if (!nickname) return;
        try {
            // Use Nickname as ID for Score Doc too, easier to track
            const scoreRef = doc(db, "bouquet_scores", nickname);
            await setDoc(scoreRef, {
                uid: auth.currentUser?.uid || 'anon',
                displayName: nickname,
                score: finalScore,
                timestamp: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error saving bouquet score:", error);
        }
    };

    const endGame = (result) => {
        gameStateRef.current = result;
        setGameState(result);

        if (result === 'gameover') {
            const finalScore = scoreRef.current;
            addDiamonds(Math.floor(finalScore));
            saveScore(finalScore);
            checkAchievement('BOUQUET_GAME_SCORE', finalScore);
        }

        if (result === 'clear') {
            // clear condition unused in infinite mode
        }
        clearInterval(spawnerRef.current);
        clearInterval(timerRef.current);
        cancelAnimationFrame(gameLoopRef.current);
    };

    useEffect(() => {
        return () => {
            clearInterval(spawnerRef.current);
            clearInterval(timerRef.current);
            cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);

    const handleMove = (direction) => {
        if (gameState !== 'playing') return;
        setLane(prev => {
            const next = prev + direction;
            return Math.max(0, Math.min(LANES - 1, next));
        });
    };

    // Format time MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Render Helpers
    const getLaneLeft = (i) => (i * LANE_WIDTH);

    return (
        <div className="relative w-full h-[400px] bg-sky-200 overflow-hidden font-['Silkscreen'] select-none border-4 border-black">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-bottom opacity-50" style={{ backgroundImage: `url(${bgImage})`, imageRendering: 'pixelated' }}></div>

            {/* UI Layer */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                <div className="bg-black/50 text-white px-2 border-2 border-white/50 text-sm flex items-center">
                    ⏰ {formatTime(time)}
                </div>
            </div>

            <div className="absolute top-4 right-4 text-2xl z-20 text-blue-600 drop-shadow-[2px_2px_0_white]">
                SCORE: {score}
            </div>

            {/* Start Screen */}
            {gameState === 'start' && (
                <div
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-50 p-4 text-center cursor-pointer font-['Silkscreen']"
                    onClick={startGame}
                >
                    <h2 className="text-3xl text-yellow-300 mb-4 animate-bounce drop-shadow-md font-['Silkscreen']">💐 BOUQUET RUSH 💐</h2>
                    <p className="mb-2 text-lg">Infinite Challenge!</p>
                    <div className="flex gap-4 mb-6 text-2xl">
                        <span>💐 = +1</span>
                        <span>💣/🥀 = DIE</span>
                    </div>
                    <button className="bg-blue-600 border-4 border-white px-8 py-4 text-xl hover:scale-105 active:scale-95 transition-transform animate-pulse">
                        TAP TO START
                    </button>
                    <p className="mt-4 text-sm text-gray-400">Use Arrows or Tap Sides to Move</p>
                </div>
            )}

            {/* Result Screen */}
            {(gameState === 'gameover') && (
                <div
                    className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50 cursor-pointer font-['Silkscreen']"
                    onClick={startGame}
                >
                    <h2 className="text-4xl mb-4 text-red-500 drop-shadow-md font-['Silkscreen']">💀 GAME OVER</h2>
                    <p className="text-3xl mb-2 text-yellow-300">SCORE: {score}</p>
                    <p className="text-xl mb-2 text-cyan-400 font-bold animate-pulse">💎 EARNED: +{score}</p>
                    <p className="text-xl mb-8 text-gray-300">Time: {formatTime(time)}</p>

                    <p className="text-sm text-gray-400 mb-8 animate-pulse">TAP SCREEN TO RETRY</p>
                    <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={startGame} className="bg-white text-black border-4 border-gray-400 px-6 py-2 hover:bg-gray-200">
                            RETRY
                        </button>
                        <button onClick={onClose} className="bg-red-500 text-white border-4 border-red-800 px-6 py-2 hover:bg-red-400">
                            QUIT
                        </button>
                    </div>
                </div>
            )}

            {/* Falling Items */}
            {items.map(item => (
                <div key={item.id}
                    className="absolute text-4xl transition-transform"
                    style={{ left: `${item.x}%`, top: `${item.y}%`, width: '10%' }}
                >
                    {item.type === 'bouquet' ? '💐' : item.type === 'bomb' ? '💣' : '🥀'}
                </div>
            ))}


            {/* Player Character */}
            <div
                className="absolute bottom-4 h-24 transition-all duration-100 ease-out"
                style={{
                    left: `${(lane * LANE_WIDTH) + (LANE_WIDTH - PLAYER_WIDTH) / 2}%`,
                    width: `${PLAYER_WIDTH}%`
                }}
            >
                <ChromaKeySprite src={brideImg} />
                <div className="absolute bottom-0 w-full text-center text-[10px] text-white/50 backdrop-blur-sm">YOU</div>
            </div>

            {/* Controls (Touch/Click Zones) */}
            {gameState === 'playing' && (
                <>
                    <div
                        className="absolute top-0 bottom-0 left-0 w-1/2 z-30 active:bg-white/5"
                        onPointerDown={() => handleMove(-1)}
                    ></div>
                    <div
                        className="absolute top-0 bottom-0 right-0 w-1/2 z-30 active:bg-white/5"
                        onPointerDown={() => handleMove(1)}
                    ></div>

                    <button
                        className="absolute bottom-6 left-4 w-16 h-16 bg-white/40 border-2 border-white rounded-full text-3xl flex items-center justify-center z-40 active:scale-90 transition-transform"
                        onPointerDown={() => handleMove(-1)}
                    >
                        ⬅️
                    </button>
                    <button
                        className="absolute bottom-6 right-4 w-16 h-16 bg-white/40 border-2 border-white rounded-full text-3xl flex items-center justify-center z-40 active:scale-90 transition-transform"
                        onPointerDown={() => handleMove(1)}
                    >
                        ➡️
                    </button>
                </>
            )}
        </div>
    );
};

export default BouquetGame;
