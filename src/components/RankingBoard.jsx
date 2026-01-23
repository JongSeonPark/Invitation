import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const RankingBoard = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                // Fetch more to handle deduplication (e.g., top 50)
                const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(50));
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
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white/50 backdrop-blur-md rounded-3xl shadow-soft-lg border border-white/60 font-body">
            <h3 className="text-2xl text-center text-primary font-heading font-medium mb-6">Hall of Fame</h3>

            <div className="overflow-hidden rounded-2xl border border-white/50">
                <table className="w-full text-left">
                    <thead className="bg-white/60">
                        <tr>
                            <th className="p-4 text-sm font-bold text-text/70 uppercase tracking-wider text-center">#</th>
                            <th className="p-4 text-sm font-bold text-text/70 uppercase tracking-wider">Agent</th>
                            <th className="p-4 text-sm font-bold text-text/70 uppercase tracking-wider text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                        {rankings.map((user, index) => {
                            const isMe = currentUser && (
                                currentUser.uid === user.id ||
                                currentUser.displayName === user.displayName
                            );

                            return (
                                <tr
                                    key={user.id}
                                    className={`
                                        transition-colors hover:bg-white/40
                                        ${isMe ? 'bg-primary/10' : ''}
                                        ${index < 3 ? 'font-bold' : ''}
                                    `}
                                >
                                    <td className="p-4 text-center">
                                        {index === 0 && '🥇'}
                                        {index === 1 && '🥈'}
                                        {index === 2 && '🥉'}
                                        {index > 2 && index + 1}
                                    </td>
                                    <td className={`p-4 ${isMe ? 'text-primary' : 'text-text'}`}>
                                        {user.displayName} {isMe && '(You)'}
                                    </td>
                                    <td className="p-4 text-right font-mono text-text/80">
                                        {user.score.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-center text-xs text-text/40 tracking-widest uppercase">
                * Real-time Updates
            </div>
        </div>
    );
};

export default RankingBoard;
