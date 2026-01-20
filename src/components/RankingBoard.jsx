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
        <div style={styles.container}>
            <h3 style={styles.header}>🏆 TOP 10 요원</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>NICNAME</th>
                        <th>SCORE</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((user, index) => {
                        // Check if this row represents the current user by ID OR Nickname match
                        const isMe = currentUser && (
                            currentUser.uid === user.id ||
                            currentUser.displayName === user.displayName
                        );

                        return (
                            <tr key={user.id} style={isMe ? styles.myRow : {}}>
                                <td style={styles.cell}>{index + 1}</td>
                                <td style={styles.cell}>
                                    {user.displayName} {isMe && '(나)'}
                                </td>
                                <td style={{ ...styles.cell, fontWeight: 'bold' }}>{user.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={styles.footer}>
                * 랭킹은 실시간으로 반영됩니다.
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '10px',
        color: '#333',
        fontFamily: '"Rajdhani", sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '15px',
        borderBottom: '2px solid #333',
        paddingBottom: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
    },
    cell: {
        padding: '8px',
        borderBottom: '1px solid #ddd',
        textAlign: 'center',
    },
    myRow: {
        backgroundColor: '#fff3cd',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: '20px',
        fontSize: '0.8rem',
        color: '#888',
        textAlign: 'center',
    }
};

export default RankingBoard;
