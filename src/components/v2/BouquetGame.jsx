import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../utils/audioManager';
import { checkAchievement } from '../../utils/achievementManager';
import { addDiamonds } from '../../utils/currencyManager';
import brideImg from '../../assets/card_images/bride_nobg.png';
import { auth, db } from '../../firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const BouquetGame = ({ onClose }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0); // Seconds
    const [playerX, setPlayerX] = useState(50); // percentage 0-100
    const [items, setItems] = useState([]); // { id, x, y, type: 'bouquet'|'bomb'|'withered' }

    // Refs for game loop
    const gameLoopRef = useRef(null);
    const spawnerRef = useRef(null);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);
    const gameStateRef = useRef('start');
    const playerRef = useRef(50);
    const itemsRef = useRef([]);

    // Asset
    const bgImage = new URL('../../assets/pixel_castle_bg.png', import.meta.url).href;
    const PLAYER_WIDTH = 15; // % of screen width

    // Sync state to refs
    useEffect(() => {
        playerRef.current = playerX;
    }, [playerX]);

    const startGame = () => {
        audioManager.playClick();
        setGameState('playing');
        setScore(0);
        setTime(0);
        setPlayerX(50);
        setItems([]);

        scoreRef.current = 0;
        playerRef.current = 50;
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
        const x = Math.random() * 90;

        const newItem = { id, x, y: -10, type };
        itemsRef.current.push(newItem);
    };

    const updateGame = () => {
        if (gameStateRef.current !== 'playing') return;

        // Speed increases with score
        const speedBase = 0.4 + (scoreRef.current * 0.05);
        let gameOverTriggered = false;

        itemsRef.current = itemsRef.current.filter(item => {
            item.y += speedBase;

            // Collision Detection
            if (item.y > 75 && item.y < 98) {
                const pX = playerRef.current;
                const itemCenter = item.x + 5;
                const playerCenter = pX + (PLAYER_WIDTH / 2);

                if (Math.abs(itemCenter - playerCenter) < 10) {
                    if (item.type === 'bouquet') {
                        audioManager.playConfirm();
                        scoreRef.current += 1;
                        setScore(scoreRef.current);
                        // Infinite Mode: No Win Condition
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
        const user = auth.currentUser;
        if (!user) return;
        try {
            const scoreRef = doc(db, "bouquet_scores", user.uid);
            await setDoc(scoreRef, {
                uid: user.uid,
                displayName: user.displayName || 'Guest',
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
            addDiamonds(Math.floor(scoreRef.current));
            saveScore(scoreRef.current);
        }

        if (result === 'clear') { // Should not happen in loop, but keep for safety
            checkAchievement('BOUQUET_CATCH');
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

    const handleMove = (delta) => {
        if (gameState !== 'playing') return;
        setPlayerX(prev => {
            const next = prev + delta;
            return Math.max(0, Math.min(100 - PLAYER_WIDTH, next));
        });
    };

    // Format time MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                    {item.type === 'bouquet' ? '💐' : item.type === 'bomb' ? '💣' : '🥀'}
                </div>
            ))}

            {/* Player Character */}
            <div
                className="absolute bottom-4 h-24 transition-all duration-75 ease-linear"
                style={{ left: `${playerX}%`, width: `${PLAYER_WIDTH}%` }}
            >
                <img src={brideImg} className="w-full h-full object-contain drop-shadow-lg" style={{ imageRendering: 'pixelated' }} />
                <div className="absolute bottom-0 w-full text-center text-[10px] text-white/50 backdrop-blur-sm">YOU</div>
            </div>

            {/* Controls (Touch/Click Zones) */}
            {gameState === 'playing' && (
                <>
                    <div
                        className="absolute top-0 bottom-0 left-0 w-1/2 z-30 active:bg-white/5"
                        onPointerDown={() => handleMove(-10)}
                    ></div>
                    <div
                        className="absolute top-0 bottom-0 right-0 w-1/2 z-30 active:bg-white/5"
                        onPointerDown={() => handleMove(10)}
                    ></div>

                    <button
                        className="absolute bottom-6 left-4 w-16 h-16 bg-white/40 border-2 border-white rounded-full text-3xl flex items-center justify-center z-40 active:scale-90 transition-transform"
                        onPointerDown={() => handleMove(-10)}
                    >
                        ⬅️
                    </button>
                    <button
                        className="absolute bottom-6 right-4 w-16 h-16 bg-white/40 border-2 border-white rounded-full text-3xl flex items-center justify-center z-40 active:scale-90 transition-transform"
                        onPointerDown={() => handleMove(10)}
                    >
                        ➡️
                    </button>
                </>
            )}
        </div>
    );
};

export default BouquetGame;
