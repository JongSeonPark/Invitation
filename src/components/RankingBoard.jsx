import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const RankingBoard = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gameType, setGameType] = useState('run'); // 'run' or 'bouquet'
    const currentNickname = localStorage.getItem('wedding_nickname');

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                // Select Collection based on Game Type
                const collectionName = gameType === 'run' ? 'scores' : 'bouquet_scores';

                // Fetch more to handle deduplication (e.g., top 50)
                const q = query(collection(db, collectionName), orderBy("score", "desc"), limit(50));
                const querySnapshot = await getDocs(q);

                const rawData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Deduplicate by displayName (keep highest score)
                const uniqueDataMap = new Map();
                rawData.forEach(item => {
                    const name = item.displayName;
                    if (!uniqueDataMap.has(name) || uniqueDataMap.get(name).score < item.score) {
                        uniqueDataMap.set(name, item);
                    }
                });

                // Convert back to array, sort, and take Top 10
                const processedData = Array.from(uniqueDataMap.values())
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);

                setRankings(processedData);
            } catch (error) {
                console.error("Error fetching rankings: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [gameType]); // Refetch on tab change

    return (
        <div className="w-full max-w-2xl mx-auto p-1 font-pixel select-none">
            {/* Retro Container */}
            <div className="bg-black/80 backdrop-blur-md border-[6px] border-white rounded-lg p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative overflow-hidden">

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                {/* Header Section */}
                <div className="text-center mb-6">
                    <h3 className="text-3xl md:text-4xl text-yellow-400 mb-2 drop-shadow-[4px_4px_0_#b91c1c] animate-pulse tracking-wider font-pixel whitespace-nowrap">
                        🏆 명예의 전당 🏆
                    </h3>
                </div>

                {/* Game Tabs */}
                <div className="flex gap-2 mb-0 justify-center relative z-10">
                    <button
                        onClick={() => setGameType('run')}
                        className={`flex-1 md:flex-none px-2 md:px-4 py-2 border-t-4 border-x-4 rounded-t-lg transition-all text-xs md:text-sm ${gameType === 'run' ? 'bg-blue-600 border-white text-white -mb-1 pb-3' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 mt-2'}`}
                    >
                        🏃 신랑 입장
                    </button>
                    <button
                        onClick={() => setGameType('bouquet')}
                        className={`flex-1 md:flex-none px-2 md:px-4 py-2 border-t-4 border-x-4 rounded-t-lg transition-all text-xs md:text-sm ${gameType === 'bouquet' ? 'bg-pink-600 border-white text-white -mb-1 pb-3' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 mt-2'}`}
                    >
                        💐 부케 받기
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden border-4 border-white bg-black min-h-[300px] relative z-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-8 h-[300px] text-white">
                            <div className="animate-spin text-4xl mb-4">⌛</div>
                            <p className="animate-pulse">데이터 로딩 중...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left bg-black text-white">
                            <thead className={`${gameType === 'run' ? 'bg-blue-800' : 'bg-pink-800'} text-yellow-300 border-b-4 border-white`}>
                                <tr>
                                    <th className="p-4 text-center w-16">순위</th>
                                    <th className="p-4">이름</th>
                                    <th className="p-4 text-right">점수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((user, index) => {
                                    const isMe = currentNickname && (
                                        user.displayName === currentNickname ||
                                        user.id === currentNickname
                                    );

                                    const getRankColor = (idx) => {
                                        if (idx === 0) return 'text-yellow-400 drop-shadow-[0_0_5px_gold]';
                                        if (idx === 1) return 'text-gray-300 drop-shadow-[0_0_5px_silver]';
                                        if (idx === 2) return 'text-orange-400 drop-shadow-[0_0_5px_orange]';
                                        return 'text-white';
                                    };

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`
                                                border-b-2 border-white/20
                                                ${isMe ? 'bg-white/20 animate-pulse' : 'hover:bg-white/10'}
                                                ${index < 3 ? 'text-lg' : ''}
                                            `}
                                        >
                                            <td className="p-3 text-center text-2xl">
                                                {index === 0 && '👑'}
                                                {index === 1 && '🥈'}
                                                {index === 2 && '🥉'}
                                                {index > 2 && <span className="text-gray-500 text-lg">#{index + 1}</span>}
                                            </td>
                                            <td className={`p-3 ${isMe ? 'text-cyan-300' : getRankColor(index)}`}>
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[120px] md:max-w-none block">{user.displayName}</span>
                                                    {isMe && <span className="text-[10px] text-cyan-500">나</span>}
                                                </div>
                                            </td>
                                            <td className={`p-3 text-right ${index < 3 ? 'text-yellow-200' : 'text-gray-300'}`}>
                                                {user.score.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {rankings.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-gray-500">
                                            아직 기록이 없습니다
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mt-6 text-center text-xs text-gray-500 tracking-widest uppercase animate-pulse">
                    게임에 참여해서 랭킹에 도전하세요
                </div>
            </div>
        </div>
    );
};

export default RankingBoard;
