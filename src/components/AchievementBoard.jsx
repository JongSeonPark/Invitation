import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { ACHIEVEMENTS } from '../utils/achievementManager';

const AchievementBoard = () => {
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!currentUser) return;
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUnlockedIds(docSnap.data().achievements || []);
                }
            } catch (error) {
                console.error("Error fetching achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [currentUser]);

    const achievementList = Object.values(ACHIEVEMENTS);

    return (
        <div className="w-full max-w-2xl mx-auto p-1 font-pixel select-none text-white">
            {/* Retro Container */}
            <div className="bg-black/80 backdrop-blur-md border-[6px] border-white rounded-lg p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative overflow-hidden">

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <h3 className="text-3xl md:text-4xl text-yellow-400 mb-2 drop-shadow-[4px_4px_0_#b91c1c] animate-pulse tracking-wider whitespace-nowrap">
                        🎖️ 명예의 전당 🎖️
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase">
                        Mission Progress: {unlockedIds.length} / {achievementList.length}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {achievementList.map((ach) => {
                        const isUnlocked = unlockedIds.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`
                                    relative border-4 p-4 transition-all duration-300 group
                                    ${isUnlocked
                                        ? 'bg-blue-900/40 border-yellow-400 shadow-[4px_4px_0_rgba(250,204,21,0.5)]'
                                        : 'bg-gray-900/50 border-gray-600 grayscale opacity-60'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon Box */}
                                    <div className={`
                                        w-12 h-12 flex items-center justify-center text-3xl border-2 
                                        ${isUnlocked ? 'bg-black border-yellow-400' : 'bg-black border-gray-600'}
                                    `}>
                                        {isUnlocked ? '🏆' : '🔒'}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`
                                            font-bold text-lg mb-1 truncate
                                            ${isUnlocked ? 'text-yellow-300' : 'text-gray-500'}
                                        `}>
                                            {ach.title}
                                        </div>
                                        <div className="text-xs text-gray-300 leading-relaxed break-keep">
                                            {ach.desc}
                                        </div>
                                    </div>
                                </div>

                                {/* Unlocked Badge (Stamp effect) */}
                                {isUnlocked && (
                                    <div className="absolute -right-2 -bottom-2 transform rotate-[-12deg] border-2 border-red-500 text-red-500 px-2 py-0.5 text-[10px] font-bold tracking-widest bg-black/80 opacity-80 pointer-events-none">
                                        CLEAR
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Message */}
                <div className="mt-8 text-center border-t-2 border-white/20 pt-4">
                    <p className="text-[10px] text-gray-500 animate-pulse">
                        모든 업적을 달성하여 최고의 하객이 되어보세요!
                    </p>
                </div>
            </div>
        </div>
    );
};

// No inline styles needed with Tailwind
const styles = {};

export default AchievementBoard;
